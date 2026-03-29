import type { Activity, AppState, DailyLog, Medicine, MedicineLog, NutritionEntry, Product, WaterLog } from "@shared/types/domain";
import { dateKey, getPastDateKeys } from "@shared/lib/date";

export function getCurrentUser(state: AppState) {
  return state.users.find((user) => user.phone === state.session.phone) ?? state.users[0] ?? null;
}

export function getCurrentProfile(state: AppState) {
  const user = getCurrentUser(state);
  if (!user) {
    return null;
  }
  return state.profiles.find((profile) => profile.userId === user._id) ?? null;
}

export function getTodayDailyLog(state: AppState) {
  const user = getCurrentUser(state);
  const today = dateKey();
  return state.dailyLogs.find((entry) => entry.userId === user?._id && entry.dateKey === today) ?? null;
}

export function getTodayWaterLog(state: AppState) {
  const user = getCurrentUser(state);
  const today = dateKey();
  return state.waterLogs.find((entry) => entry.userId === user?._id && entry.dateKey === today) ?? null;
}

export function getTodaySleepLog(state: AppState) {
  const user = getCurrentUser(state);
  const today = dateKey();
  return state.sleepLogs.find((entry) => entry.userId === user?._id && entry.dateKey === today) ?? null;
}

export function getTodayActivities(state: AppState) {
  const user = getCurrentUser(state);
  const today = dateKey();
  return state.activities.filter((entry) => entry.userId === user?._id && entry.dateKey === today);
}

export function getTodayNutrition(state: AppState) {
  const user = getCurrentUser(state);
  const today = dateKey();
  return state.nutritionEntries.filter((entry) => entry.userId === user?._id && entry.dateKey === today);
}

export function getActiveMedicines(state: AppState) {
  const user = getCurrentUser(state);
  return state.medicines.filter((medicine) => medicine.userId === user?._id && medicine.isActive);
}

export function getTodayMedicineSchedule(state: AppState) {
  const user = getCurrentUser(state);
  const todayLogs = state.medicineLogs.filter((entry) => entry.userId === user?._id);
  const medicines = getActiveMedicines(state);

  return medicines.flatMap((medicine) =>
    medicine.scheduleTimes.map((scheduleTime, index) => {
      const scheduledFor = new Date(`${dateKey()}T${scheduleTime}:00`).getTime();
      const log =
        todayLogs.find((entry) => entry.medicineId === medicine._id && Math.abs(entry.scheduledFor - scheduledFor) < 60_000) ??
        null;

      return {
        medicine,
        scheduleTime,
        reminderTime: medicine.reminderTimes[index] ?? scheduleTime,
        scheduledFor,
        log,
      };
    }),
  );
}

export function getWeeklySeries(state: AppState) {
  const user = getCurrentUser(state);
  const keys = getPastDateKeys(7);
  return keys.map((key) => {
    const daily = state.dailyLogs.find((entry) => entry.userId === user?._id && entry.dateKey === key);
    return {
      key,
      intake: daily?.intakeCalories ?? 0,
      burned: daily?.burnedCalories ?? 0,
      water: daily?.waterCups ?? 0,
      steps: daily?.steps ?? 0,
      sleep: daily?.sleepHours ?? 0,
      label: new Date(`${key}T00:00:00`).toLocaleDateString("en-US", { weekday: "narrow" }),
    };
  });
}

export function getProductByBarcode(state: AppState, barcode: string) {
  return state.products.find((product) => product.barcode === barcode) ?? null;
}

export function getHydrationProgress(state: AppState) {
  const log = getTodayWaterLog(state);
  if (!log) {
    return 0;
  }
  return (log.cups / Math.max(log.goal, 1)) * 100;
}

export function getMedicineAdherence(state: AppState) {
  const schedule = getTodayMedicineSchedule(state);
  if (schedule.length === 0) {
    return 0;
  }
  const taken = schedule.filter((entry) => entry.log?.status === "taken").length;
  return (taken / schedule.length) * 100;
}

export function sumCalories(entries: NutritionEntry[]) {
  return entries.reduce((total, entry) => total + entry.calories, 0);
}

export function sumBurned(activities: Activity[]) {
  return activities.reduce((total, entry) => total + entry.caloriesBurned, 0);
}

export function findProductForMedicine(products: Product[], medicine: Medicine) {
  return products.find((product) => product._id === medicine.productId) ?? null;
}

export function getProductWarnings(state: AppState) {
  return state.products.filter((product) => product.warningText);
}

export function buildReminderPreview(medicine: Medicine, log?: MedicineLog | null) {
  return `${medicine.name} • ${medicine.dosage}${log?.note ? ` • ${log.note}` : ""}`;
}

export function withTodayLog<T extends DailyLog | WaterLog>(collection: T[], userId?: string | null) {
  return collection.find((entry) => entry.userId === userId && entry.dateKey === dateKey()) ?? null;
}
