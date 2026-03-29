import { startTransition, createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { ConvexError } from "convex/values";
import { api } from "@convex/_generated/api";
import { requestMockOtp, verifyMockOtp } from "@shared/adapters/auth";
import { syncDeviceMetricsMock } from "@shared/adapters/device-sync";
import { analyzeMealMock } from "@shared/adapters/meal-analysis";
import { connectZaloMock } from "@shared/adapters/zalo";
import { createDemoState, DEMO_PHONE } from "@shared/data/demo";
import { getCurrentProfile, getCurrentUser, getTodayActivities, getTodayWaterLog } from "@shared/data/selectors";
import { getConvexClient } from "@shared/lib/convex";
import { estimateBurnedCalories } from "@shared/lib/calories";
import { dateKey } from "@shared/lib/date";
import type { Activity, ActivityType, AppState, DailyLog, DirectMessage, Product, Reminder } from "@shared/types/domain";

const STORAGE_KEY = "mediflow-state-v1";

const convexApi = api as unknown as {
  seed: { ensureDemoData: unknown };
  dashboard: { mobileSnapshot: unknown; adminSnapshot: unknown };
  auth: { mockSignIn: unknown };
  mobile: {
    upsertProfile: unknown;
    toggleMedicineLog: unknown;
    upsertWaterLog: unknown;
    addActivity: unknown;
    recordBarcodeScan: unknown;
  };
  admin: {
    upsertProduct: unknown;
    importProducts: unknown;
    upsertReminder: unknown;
    upsertAdminNote: unknown;
    upsertFollowUpRule: unknown;
    sendDirectMessage: unknown;
  };
};

interface AppProviderProps {
  convexUrl?: string;
  convexHttpUrl?: string;
}

interface AddProductInput {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  servingSize: string;
  calories: number;
  sugarGrams: number;
  caffeineMg: number;
  status: string;
  warningText?: string;
  alternativeText?: string;
  reminderNote?: string;
  avoidItems: string[];
  stock: number;
  source: string;
}

interface SendMessageInput {
  phone: string;
  type: string;
  channel: string;
  body: string;
}

type MobileSnapshot = Pick<
  AppState,
  | "medicines"
  | "medicineLogs"
  | "reminders"
  | "dailyLogs"
  | "waterLogs"
  | "sleepLogs"
  | "activities"
  | "nutritionEntries"
  | "scannedMeals"
  | "notifications"
> & {
  user?: AppState["users"][number];
  profile?: AppState["profiles"][number];
};

type AdminSnapshot = Pick<
  AppState,
  | "users"
  | "profiles"
  | "products"
  | "barcodeScans"
  | "avoidItems"
  | "adminNotes"
  | "followUpRules"
  | "healthCheckResults"
  | "directMessages"
  | "messageDeliveries"
>;

interface AppContextValue {
  state: AppState;
  currentUser: ReturnType<typeof getCurrentUser>;
  currentProfile: ReturnType<typeof getCurrentProfile>;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtpCode: (code: string) => Promise<boolean>;
  signOut: () => void;
  saveProfile: (input: { fullName: string; heightCm: number; bloodType: string; deviceSyncEnabled: boolean }) => Promise<void>;
  connectZalo: () => Promise<void>;
  syncWearables: (enabled: boolean) => Promise<void>;
  setMedicineStatus: (medicineId: string, scheduledFor: number, status: string, note?: string) => Promise<void>;
  changeWaterCups: (delta: number) => Promise<void>;
  saveSleepHours: (hours: number) => Promise<void>;
  addActivity: (input: { type: ActivityType; durationMin: number; distanceKm?: number; source?: string }) => Promise<Activity>;
  addNutrition: (input: { name: string; calories: number; protein?: number; carbs?: number; fat?: number; note?: string; source?: string }) => Promise<void>;
  analyzeMeal: (fileName?: string) => Promise<void>;
  lookupBarcode: (barcode: string, source: string) => Promise<Product | null>;
  addProduct: (input: AddProductInput) => Promise<void>;
  importProducts: (rows: AddProductInput[]) => Promise<void>;
  saveReminder: (input: Omit<Reminder, "_id" | "_creationTime" | "createdAt">) => Promise<void>;
  saveAdminNote: (input: { title: string; body: string; type: string; createdBy: string; productId?: string; medicineId?: string }) => Promise<void>;
  saveFollowUpRule: (input: { name: string; triggerType: string; triggerLabel: string; condition: string; delayDays: number; channel: string; status: string }) => Promise<void>;
  sendDirectMessage: (input: SendMessageInput) => Promise<void>;
  markNotification: (notificationId: string, status: string) => void;
  refreshRemote: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function normalizeError(error: unknown) {
  if (error instanceof ConvexError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unable to reach Convex. Falling back to local demo data.";
}

function makeLocalId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function createDoc<T extends Record<string, unknown>>(prefix: string, data: T) {
  const now = Date.now();
  return {
    _id: makeLocalId(prefix),
    _creationTime: now,
    ...data,
  };
}

function loadState() {
  if (typeof window === "undefined") {
    return createDemoState();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return createDemoState();
  }

  try {
    const parsed = JSON.parse(stored) as AppState;
    return {
      ...createDemoState(),
      ...parsed,
      remoteMode: "booting" as const,
      remoteError: null,
    };
  } catch {
    return createDemoState();
  }
}

function persistState(state: AppState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function upsertDailyLog(state: AppState, userId: string, updater: (entry: DailyLog) => DailyLog) {
  const today = dateKey();
  const current = state.dailyLogs.find((entry) => entry.userId === userId && entry.dateKey === today);
  if (current) {
    state.dailyLogs = state.dailyLogs.map((entry) => (entry._id === current._id ? updater(entry) : entry));
    return;
  }

  state.dailyLogs.push(
    createDoc("daily", {
      userId,
      dateKey: today,
      steps: 0,
      sleepHours: 0,
      waterGoal: 10,
      waterCups: 0,
      intakeCalories: 0,
      burnedCalories: 0,
      mood: "steady",
      source: "manual",
    }),
  );
  upsertDailyLog(state, userId, updater);
}

function cloneAndUpdate(state: AppState, updater: (draft: AppState) => void) {
  const draft = structuredClone(state);
  updater(draft);
  persistState(draft);
  return draft;
}

export function AppProvider({ children, convexUrl }: PropsWithChildren<AppProviderProps>) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    void refreshRemote();
  }, []);

  async function refreshRemote() {
    const client = getConvexClient(convexUrl);
    if (!client) {
      setState((current) => ({ ...current, remoteMode: "local", remoteError: null }));
      return;
    }

    try {
      await client.mutation(convexApi.seed.ensureDemoData as never, {});
      const phone = state.session.phone || DEMO_PHONE;
      const [mobileSnapshot, adminSnapshot] = await Promise.all([
        client.query(convexApi.dashboard.mobileSnapshot as never, { phone } as never) as Promise<MobileSnapshot | null>,
        client.query(convexApi.dashboard.adminSnapshot as never, {} as never) as Promise<AdminSnapshot>,
      ]);

      if (!mobileSnapshot) {
        setState((current) => ({ ...current, remoteMode: "local", remoteError: "No remote mobile snapshot available." }));
        return;
      }

      startTransition(() => {
        setState((current) => {
          const next: AppState = {
            ...current,
            session: current.session,
            users: adminSnapshot.users,
            profiles: adminSnapshot.profiles,
            medicines: mobileSnapshot.medicines,
            medicineLogs: mobileSnapshot.medicineLogs,
            reminders: mobileSnapshot.reminders,
            dailyLogs: mobileSnapshot.dailyLogs,
            waterLogs: mobileSnapshot.waterLogs,
            sleepLogs: mobileSnapshot.sleepLogs,
            activities: mobileSnapshot.activities,
            nutritionEntries: mobileSnapshot.nutritionEntries,
            scannedMeals: mobileSnapshot.scannedMeals,
            products: adminSnapshot.products,
            barcodeScans: adminSnapshot.barcodeScans,
            avoidItems: adminSnapshot.avoidItems,
            adminNotes: adminSnapshot.adminNotes,
            followUpRules: adminSnapshot.followUpRules,
            healthCheckResults: adminSnapshot.healthCheckResults,
            notifications: mobileSnapshot.notifications,
            directMessages: adminSnapshot.directMessages,
            messageDeliveries: adminSnapshot.messageDeliveries,
            remoteMode: "synced",
            remoteError: null,
            lastSyncedAt: Date.now(),
          };
          persistState(next);
          return next;
        });
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        remoteMode: current.remoteMode === "booting" ? "local" : "error",
        remoteError: normalizeError(error),
      }));
    }
  }

  async function safeMutation(reference: unknown, args: object) {
    const client = getConvexClient(convexUrl);
    if (!client) {
      return;
    }
    try {
      await client.mutation(reference as never, args as never);
    } catch (error) {
      setState((current) => ({
        ...current,
        remoteMode: "error",
        remoteError: normalizeError(error),
      }));
    }
  }

  async function requestOtp(phone: string) {
    const otp = await requestMockOtp(phone);
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        draft.session.phone = otp.phone;
        draft.session.demoOtpCode = otp.code;
        draft.session.otpRequested = true;
        draft.session.lastOtpSentAt = Date.now();
      }),
    );
  }

  async function verifyOtpCode(code: string) {
    const valid = await verifyMockOtp(code, state.session.demoOtpCode);
    if (!valid) {
      return false;
    }

    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        draft.session.isAuthenticated = true;
        draft.session.otpVerified = true;
        draft.session.otpRequested = true;
        if (!draft.users.some((user) => user.phone === draft.session.phone)) {
          const user = createDoc("user", {
            phone: draft.session.phone,
            displayName: "New member",
            role: "user",
            zaloConnected: false,
            authProvider: "mock-otp",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          draft.users.push(user);
          draft.profiles.push(
            createDoc("profile", {
              userId: user._id,
              fullName: "New member",
              heightCm: 170,
              bloodType: "O+",
              deviceSyncEnabled: false,
              avatarHue: 96,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }),
          );
          draft.session.profileComplete = false;
        }
      }),
    );

    await safeMutation(convexApi.auth.mockSignIn, { phone: state.session.phone });
    await refreshRemote();
    return true;
  }

  function signOut() {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        draft.session.isAuthenticated = false;
        draft.session.otpRequested = false;
        draft.session.otpVerified = false;
      }),
    );
  }

  async function saveProfile(input: { fullName: string; heightCm: number; bloodType: string; deviceSyncEnabled: boolean }) {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (!user) {
          return;
        }
        const existing = draft.profiles.find((profile) => profile.userId === user._id);
        if (existing) {
          existing.fullName = input.fullName;
          existing.heightCm = input.heightCm;
          existing.bloodType = input.bloodType;
          existing.deviceSyncEnabled = input.deviceSyncEnabled;
          existing.updatedAt = Date.now();
          user.displayName = input.fullName;
        }
        draft.session.profileComplete = true;
      }),
    );

    await safeMutation(convexApi.mobile.upsertProfile, {
      phone: state.session.phone,
      ...input,
    });
  }

  async function connectZalo() {
    await connectZaloMock();
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (user) {
          user.zaloConnected = true;
          user.updatedAt = Date.now();
        }
      }),
    );
  }

  async function syncWearables(enabled: boolean) {
    const sync = enabled ? await syncDeviceMetricsMock() : null;
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        const profile = getCurrentProfile(draft);
        if (!user || !profile) {
          return;
        }
        profile.deviceSyncEnabled = enabled;
        profile.updatedAt = Date.now();
        if (!sync) {
          return;
        }
        upsertDailyLog(draft, user._id, (entry) => ({
          ...entry,
          steps: sync.steps,
          sleepHours: sync.sleepHours,
          burnedCalories: sync.activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0),
          source: "watch-sync",
        }));
        draft.activities = draft.activities.filter((activity) => !(activity.userId === user._id && activity.dateKey === dateKey() && activity.source === "watch-sync"));
        sync.activities.forEach((activity) => {
          draft.activities.push(
            createDoc("activity", {
              userId: user._id,
              dateKey: dateKey(),
              ...activity,
            }),
          );
        });
      }),
    );
  }

  async function setMedicineStatus(medicineId: string, scheduledFor: number, status: string, note?: string) {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (!user) {
          return;
        }
        const existing = draft.medicineLogs.find((entry) => entry.userId === user._id && entry.medicineId === medicineId && entry.scheduledFor === scheduledFor);
        if (existing) {
          existing.status = status;
          existing.note = note;
          existing.loggedAt = status === "taken" ? Date.now() : undefined;
        } else {
          draft.medicineLogs.push(
            createDoc("medicineLog", {
              userId: user._id,
              medicineId,
              scheduledFor,
              status,
              note,
              loggedAt: status === "taken" ? Date.now() : undefined,
            }),
          );
        }
      }),
    );

    await safeMutation(convexApi.mobile.toggleMedicineLog, {
      phone: state.session.phone,
      medicineId,
      scheduledFor,
      status,
      note,
    });
  }

  async function changeWaterCups(delta: number) {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (!user) {
          return;
        }
        const now = Date.now();
        const waterLog = getTodayWaterLog(draft);
        if (waterLog) {
          waterLog.cups = Math.max(0, Math.min(waterLog.goal, waterLog.cups + delta));
          waterLog.entries = Array.from({ length: waterLog.cups }, (_, index) => now - index * 35 * 60 * 1000).reverse();
          waterLog.updatedAt = now;
        }
        upsertDailyLog(draft, user._id, (entry) => ({
          ...entry,
          waterCups: Math.max(0, Math.min(entry.waterGoal, entry.waterCups + delta)),
        }));
      }),
    );

    const nextLog = getTodayWaterLog(loadState());
    if (nextLog) {
      await safeMutation(convexApi.mobile.upsertWaterLog, {
        phone: state.session.phone,
        dateKey: nextLog.dateKey,
        entries: nextLog.entries,
        cups: nextLog.cups,
        goal: nextLog.goal,
      });
    }
  }

  async function saveSleepHours(hours: number) {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (!user) {
          return;
        }
        const today = dateKey();
        const existing = draft.sleepLogs.find((entry) => entry.userId === user._id && entry.dateKey === today);
        if (existing) {
          existing.durationHours = hours;
          existing.quality = hours >= 7 ? "rested" : "fair";
          existing.updatedAt = Date.now();
        } else {
          draft.sleepLogs.push(
            createDoc("sleep", {
              userId: user._id,
              dateKey: today,
              durationHours: hours,
              quality: hours >= 7 ? "rested" : "fair",
              source: "manual",
              updatedAt: Date.now(),
            }),
          );
        }
        upsertDailyLog(draft, user._id, (entry) => ({
          ...entry,
          sleepHours: hours,
        }));
      }),
    );
  }

  async function addActivity(input: { type: ActivityType; durationMin: number; distanceKm?: number; source?: string }) {
    let created!: Activity;
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (!user) {
          return;
        }
        created = createDoc("activity", {
          userId: user._id,
          dateKey: dateKey(),
          type: input.type,
          durationMin: input.durationMin,
          distanceKm: input.distanceKm,
          caloriesBurned: estimateBurnedCalories(input.type, input.durationMin),
          source: input.source ?? "manual",
        });
        draft.activities.push(created);
        upsertDailyLog(draft, user._id, (entry) => ({
          ...entry,
          burnedCalories: getTodayActivities(draft).reduce((sum, activity) => sum + activity.caloriesBurned, 0),
        }));
      }),
    );

    await safeMutation(convexApi.mobile.addActivity, {
      phone: state.session.phone,
      dateKey: created.dateKey,
      type: created.type,
      durationMin: created.durationMin,
      caloriesBurned: created.caloriesBurned,
      distanceKm: created.distanceKm,
      source: created.source,
    });

    return created;
  }

  async function addNutrition(input: { name: string; calories: number; protein?: number; carbs?: number; fat?: number; note?: string; source?: string }) {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (!user) {
          return;
        }
        draft.nutritionEntries.push(
          createDoc("nutrition", {
            userId: user._id,
            dateKey: dateKey(),
            name: input.name,
            calories: input.calories,
            protein: input.protein ?? 24,
            carbs: input.carbs ?? 38,
            fat: input.fat ?? 18,
            note: input.note,
            source: input.source ?? "manual",
          }),
        );
        upsertDailyLog(draft, user._id, (entry) => ({
          ...entry,
          intakeCalories: draft.nutritionEntries
            .filter((item) => item.userId === user._id && item.dateKey === dateKey())
            .reduce((sum, item) => sum + item.calories, 0),
        }));
      }),
    );
  }

  async function analyzeMeal(fileName?: string) {
    const result = await analyzeMealMock(fileName);
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        if (!user) {
          return;
        }
        draft.scannedMeals.unshift(
          createDoc("meal", {
            userId: user._id,
            dateKey: dateKey(),
            title: result.title,
            estimatedCalories: result.estimatedCalories,
            detectedItems: result.detectedItems,
            analyzer: result.analyzer,
            confidence: result.confidence,
            status: result.status,
            photoName: fileName,
            createdAt: Date.now(),
          }),
        );
        draft.nutritionEntries.unshift(
          createDoc("nutrition", {
            userId: user._id,
            dateKey: dateKey(),
            name: result.title,
            calories: result.estimatedCalories,
            protein: 26,
            carbs: 34,
            fat: 20,
            source: "meal-scan",
          }),
        );
        upsertDailyLog(draft, user._id, (entry) => ({
          ...entry,
          intakeCalories: draft.nutritionEntries
            .filter((item) => item.userId === user._id && item.dateKey === dateKey())
            .reduce((sum, item) => sum + item.calories, 0),
        }));
      }),
    );
  }

  async function lookupBarcode(barcode: string, source: string) {
    const product = state.products.find((entry) => entry.barcode === barcode) ?? null;
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = getCurrentUser(draft);
        draft.barcodeScans.unshift(
          createDoc("scan", {
            userId: user?._id,
            productId: product?._id,
            barcode,
            source,
            resultStatus: product ? "matched" : "missing",
            createdAt: Date.now(),
          }),
        );
      }),
    );

    await safeMutation(convexApi.mobile.recordBarcodeScan, {
      phone: source === "mobile" ? state.session.phone : undefined,
      barcode,
      source,
    });

    return product;
  }

  async function addProduct(input: AddProductInput) {
    const nextProduct = createDoc("product", {
      ...input,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const existing = draft.products.find((product) => product.barcode === input.barcode);
        if (existing) {
          Object.assign(existing, nextProduct);
          return;
        }
        draft.products.unshift(nextProduct);
      }),
    );

    await safeMutation(convexApi.admin.upsertProduct, input);
  }

  async function importProducts(rows: AddProductInput[]) {
    for (const row of rows) {
      await addProduct(row);
    }
    await safeMutation(convexApi.admin.importProducts, {
      rows,
    });
  }

  async function saveReminder(input: Omit<Reminder, "_id" | "_creationTime" | "createdAt">) {
    const createdAt = Date.now();
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        draft.reminders.unshift(
          createDoc("reminder", {
            ...input,
            createdAt,
          }),
        );
      }),
    );

    await safeMutation(convexApi.admin.upsertReminder, {
      userPhone: state.session.phone || undefined,
      medicineId: input.medicineId,
      type: input.type,
      title: input.title,
      body: input.body,
      channel: input.channel,
      dueAt: input.dueAt,
      repeatRule: input.repeatRule,
      isActive: input.isActive,
    });
  }

  async function saveAdminNote(input: { title: string; body: string; type: string; createdBy: string; productId?: string; medicineId?: string }) {
    const user = getCurrentUser(state);
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        draft.adminNotes.unshift(
          createDoc("note", {
            userId: user?._id,
            title: input.title,
            body: input.body,
            type: input.type,
            createdBy: input.createdBy,
            productId: input.productId,
            medicineId: input.medicineId,
            createdAt: Date.now(),
          }),
        );
      }),
    );

    await safeMutation(convexApi.admin.upsertAdminNote, {
      userPhone: input.createdBy === "Admin Console" ? undefined : state.session.phone || undefined,
      title: input.title,
      body: input.body,
      type: input.type,
      createdBy: input.createdBy,
      productId: input.productId,
      medicineId: input.medicineId,
    });
  }

  async function saveFollowUpRule(input: { name: string; triggerType: string; triggerLabel: string; condition: string; delayDays: number; channel: string; status: string }) {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        draft.followUpRules.unshift(
          createDoc("rule", {
            ...input,
            createdAt: Date.now(),
          }),
        );
      }),
    );
    await safeMutation(convexApi.admin.upsertFollowUpRule, input);
  }

  async function sendDirectMessage(input: SendMessageInput) {
    let createdMessage!: DirectMessage;
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const user = draft.users.find((entry) => entry.phone === input.phone);
        createdMessage = createDoc("message", {
          userId: user?._id,
          phone: input.phone,
          type: input.type,
          channel: input.channel,
          body: input.body,
          preview: input.body,
          status: "queued",
          sentAt: Date.now(),
          createdAt: Date.now(),
        });
        draft.directMessages.unshift(createdMessage);
        input.channel
          .split("+")
          .map((value) => value.trim().toLowerCase())
          .filter(Boolean)
          .forEach((channel) => {
            draft.messageDeliveries.unshift(
              createDoc("delivery", {
                directMessageId: createdMessage._id,
                channel,
                status: channel === "app" ? "delivered" : "pending",
                deliveredAt: channel === "app" ? Date.now() : undefined,
              }),
            );
          });
      }),
    );

    await safeMutation(convexApi.admin.sendDirectMessage, input);
  }

  function markNotification(notificationId: string, status: string) {
    setState((current) =>
      cloneAndUpdate(current, (draft) => {
        const notification = draft.notifications.find((entry) => entry._id === notificationId);
        if (notification) {
          notification.status = status;
        }
      }),
    );
  }

  const value: AppContextValue = {
    state,
    currentUser: getCurrentUser(state),
    currentProfile: getCurrentProfile(state),
    requestOtp,
    verifyOtpCode,
    signOut,
    saveProfile,
    connectZalo,
    syncWearables,
    setMedicineStatus,
    changeWaterCups,
    saveSleepHours,
    addActivity,
    addNutrition,
    analyzeMeal,
    lookupBarcode,
    addProduct,
    importProducts,
    saveReminder,
    saveAdminNote,
    saveFollowUpRule,
    sendDirectMessage,
    markNotification,
    refreshRemote,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppProvider.");
  }
  return context;
}
