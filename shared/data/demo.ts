import type {
  Activity,
  AdminNote,
  AppNotification,
  AppState,
  BarcodeScan,
  DailyLog,
  DirectMessage,
  FollowUpRule,
  HealthCheckResult,
  Medicine,
  MedicineLog,
  MessageDelivery,
  NutritionEntry,
  Product,
  Profile,
  Reminder,
  ScannedMeal,
  SleepLog,
  User,
  WaterLog,
} from "@shared/types/domain";
import { dateKey, getPastDateKeys, startOfDayLocal } from "@shared/lib/date";
import { estimateBurnedCalories } from "@shared/lib/calories";

export const DEMO_PHONE = "+84 93 555 0182";

function doc<T extends Record<string, unknown>>(id: string, timestamp: number, data: T) {
  return {
    _id: id,
    _creationTime: timestamp,
    ...data,
  };
}

export function createDemoState(): AppState {
  const now = Date.now();
  const todayStart = startOfDayLocal().getTime();
  const todayKey = dateKey();
  const weekKeys = getPastDateKeys(7);

  const user: User = doc("user_demo", now, {
    phone: DEMO_PHONE,
    displayName: "Nghia Nguyen",
    role: "user",
    zaloConnected: true,
    authProvider: "mock-otp",
    createdAt: now,
    updatedAt: now,
  });

  const profile: Profile = doc("profile_demo", now, {
    userId: user._id,
    fullName: "Nghia Nguyen",
    heightCm: 174,
    bloodType: "B+",
    deviceSyncEnabled: true,
    avatarHue: 18,
    createdAt: now,
    updatedAt: now,
  });

  const products: Product[] = [
    doc("product_metformin", now, {
      barcode: "893123450012",
      name: "Metformin 500mg",
      brand: "Sunrise Care",
      category: "Tablet",
      servingSize: "1 tablet",
      calories: 0,
      sugarGrams: 0,
      caffeineMg: 0,
      status: "active",
      warningText: "Avoid candy, cake, and sweet drinks close to this dose.",
      alternativeText: "Choose plain water or a small protein snack instead.",
      reminderNote: "Take after breakfast and dinner.",
      avoidItems: ["Candy", "Cake", "Sweet soda"],
      stock: 184,
      source: "catalog",
      createdAt: now,
      updatedAt: now,
    }),
    doc("product_iron", now - 1000, {
      barcode: "893123450199",
      name: "Ferrous Sulfate",
      brand: "Sunrise Care",
      category: "Capsule",
      servingSize: "1 capsule",
      calories: 0,
      sugarGrams: 0,
      caffeineMg: 0,
      status: "active",
      warningText: "Avoid close to iron medicine.",
      alternativeText: "Water with lemon or unsweetened tea later in the day.",
      reminderNote: "Water only, avoid coffee nearby.",
      avoidItems: ["Coffee", "Tea", "Cola"],
      stock: 126,
      source: "catalog",
      createdAt: now - 1000,
      updatedAt: now - 1000,
    }),
    doc("product_omega", now - 2000, {
      barcode: "893123450288",
      name: "Omega 3",
      brand: "Wellspring",
      category: "Softgel",
      servingSize: "2 softgels",
      calories: 10,
      sugarGrams: 0,
      caffeineMg: 0,
      status: "active",
      warningText: "Best after dinner for comfort.",
      alternativeText: "Take with a balanced meal.",
      reminderNote: "Take after dinner.",
      avoidItems: ["Empty stomach"],
      stock: 92,
      source: "catalog",
      createdAt: now - 2000,
      updatedAt: now - 2000,
    }),
    doc("product_cola", now - 3000, {
      barcode: "893850000001",
      name: "Coca-Cola Zero 320ml",
      brand: "Coca-Cola",
      category: "Beverage",
      servingSize: "320ml",
      calories: 4,
      sugarGrams: 0,
      caffeineMg: 34,
      status: "review",
      warningText: "Avoid close to iron medicine",
      alternativeText: "Better alternative: water with lemon or unsweetened tea later in the day.",
      reminderNote: "Monitor caffeine near sleep or iron doses.",
      avoidItems: ["Iron dose", "Late-night caffeine"],
      stock: 64,
      source: "scanner",
      createdAt: now - 3000,
      updatedAt: now - 3000,
    }),
  ];

  const medicines: Medicine[] = [
    doc("medicine_metformin", now, {
      userId: user._id,
      productId: products[0]._id,
      name: "Metformin",
      strength: "500mg",
      form: "tablet",
      dosage: "1 tablet",
      scheduleTimes: ["08:00", "20:00"],
      reminderTimes: ["08:00", "20:00"],
      note: "Take after breakfast and dinner.",
      avoidItems: ["Candy", "Cake", "Sweet soda"],
      status: "on-track",
      adherenceRate: 92,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
    doc("medicine_iron", now - 500, {
      userId: user._id,
      productId: products[1]._id,
      name: "Ferrous Sulfate",
      strength: "325mg",
      form: "capsule",
      dosage: "1 capsule",
      scheduleTimes: ["13:00", "20:00"],
      reminderTimes: ["13:00", "20:00"],
      note: "Water only, avoid coffee nearby.",
      avoidItems: ["Coffee", "Tea", "Cola"],
      status: "needs-attention",
      adherenceRate: 85,
      isActive: true,
      createdAt: now - 500,
      updatedAt: now - 500,
    }),
    doc("medicine_omega", now - 1000, {
      userId: user._id,
      productId: products[2]._id,
      name: "Omega 3",
      strength: "1000mg",
      form: "softgel",
      dosage: "2 softgels",
      scheduleTimes: ["20:30"],
      reminderTimes: ["20:30"],
      note: "Take after dinner.",
      avoidItems: ["Empty stomach"],
      status: "on-track",
      adherenceRate: 90,
      isActive: true,
      createdAt: now - 1000,
      updatedAt: now - 1000,
    }),
  ];

  const medicineLogs: MedicineLog[] = [
    doc("log_metformin_am", now, {
      userId: user._id,
      medicineId: medicines[0]._id,
      scheduledFor: todayStart + 8 * 60 * 60 * 1000,
      loggedAt: todayStart + 8 * 60 * 60 * 1000 + 8 * 60 * 1000,
      status: "taken",
      note: "After breakfast",
    }),
    doc("log_iron_noon", now - 1000, {
      userId: user._id,
      medicineId: medicines[1]._id,
      scheduledFor: todayStart + 13 * 60 * 60 * 1000,
      loggedAt: todayStart + 13 * 60 * 60 * 1000 + 5 * 60 * 1000,
      status: "taken",
      note: "Water only",
    }),
    doc("log_iron_pm", now - 2000, {
      userId: user._id,
      medicineId: medicines[1]._id,
      scheduledFor: todayStart + 20 * 60 * 60 * 1000,
      status: "pending",
      note: "Avoid coffee nearby",
    }),
    doc("log_omega_pm", now - 3000, {
      userId: user._id,
      medicineId: medicines[2]._id,
      scheduledFor: todayStart + 20.5 * 60 * 60 * 1000,
      status: "pending",
      note: "Take after dinner",
    }),
  ];

  const dailyLogs: DailyLog[] = weekKeys.map((key, index) =>
    doc(`daily_${key}`, now - index * 10_000, {
      userId: user._id,
      dateKey: key,
      steps: [5500, 7200, 8400, 6900, 6100, 8100, 7000][index] ?? 6200,
      sleepHours: [7.6, 7.1, 7.4, 6.8, 7.0, 7.8, 7.2][index] ?? 7.0,
      waterGoal: 10,
      waterCups: [8, 7, 10, 6, 8, 9, 7][index] ?? 8,
      intakeCalories: [1820, 1740, 1910, 1680, 1765, 1880, 1710][index] ?? 1800,
      burnedCalories: [620, 680, 710, 540, 610, 760, 590][index] ?? 600,
      mood: index % 2 === 0 ? "steady" : "energized",
      source: index === 0 ? "device-sync" : "mixed",
    }),
  );

  const waterLogs: WaterLog[] = dailyLogs.map((entry, index) =>
    doc(`water_${entry.dateKey}`, now - index * 10_000, {
      userId: user._id,
      dateKey: entry.dateKey,
      entries: Array.from({ length: entry.waterCups }, (_, offset) => todayStart + offset * 65 * 60 * 1000),
      cups: entry.waterCups,
      goal: 10,
      updatedAt: now,
    }),
  );

  const sleepLogs: SleepLog[] = dailyLogs.map((entry, index) =>
    doc(`sleep_${entry.dateKey}`, now - index * 10_000, {
      userId: user._id,
      dateKey: entry.dateKey,
      durationHours: entry.sleepHours,
      quality: entry.sleepHours >= 7.4 ? "rested" : "fair",
      source: index === 0 ? "watch-sync" : "manual",
      updatedAt: now,
    }),
  );

  const activityTemplates = [
    { type: "walk", durationMin: 42, caloriesBurned: estimateBurnedCalories("walk", 42), distanceKm: 3.8 },
    { type: "bike", durationMin: 28, caloriesBurned: estimateBurnedCalories("bike", 28), distanceKm: 7.2 },
    { type: "swim", durationMin: 35, caloriesBurned: estimateBurnedCalories("swim", 35), distanceKm: 1.1 },
  ];

  const activities: Activity[] = weekKeys.flatMap((key, index) => {
    const base = activityTemplates.slice(0, index % 3 === 0 ? 3 : 2);
    return base.map((activity, activityIndex) =>
      doc(`activity_${key}_${activity.type}`, now - index * 10_000 - activityIndex * 1000, {
        userId: user._id,
        dateKey: key,
        type: activity.type,
        durationMin: activity.durationMin,
        caloriesBurned: activity.caloriesBurned,
        distanceKm: activity.distanceKm,
        source: index === 0 ? "watch-sync" : "manual",
      }),
    );
  });

  const nutritionEntries: NutritionEntry[] = weekKeys.map((key, index) =>
    doc(`nutrition_${key}`, now - index * 10_000, {
      userId: user._id,
      dateKey: key,
      name: index === 0 ? "Avocado chicken bowl" : "Balanced meal plan",
      calories: dailyLogs[index]?.intakeCalories ?? 1800,
      protein: 86,
      carbs: 184,
      fat: 62,
      note: index === 0 ? "Logged after meal photo scan." : undefined,
      source: index === 0 ? "meal-scan" : "manual",
    }),
  );

  const scannedMeals: ScannedMeal[] = [
    doc("meal_today", now - 5_000, {
      userId: user._id,
      dateKey: todayKey,
      title: "Chicken avocado salad",
      estimatedCalories: 540,
      detectedItems: ["Chicken", "Avocado", "Leafy greens", "Olive oil"],
      analyzer: "mock-ai-v1",
      confidence: 0.88,
      status: "reviewed",
      photoName: "meal-bowl.jpg",
      createdAt: now - 2 * 60 * 60 * 1000,
    }),
  ];

  const reminders: Reminder[] = [
    doc("reminder_metformin", now, {
      userId: user._id,
      medicineId: medicines[0]._id,
      type: "medicine",
      title: "Take Metformin",
      body: "08:00 AM • 1 tablet after breakfast",
      channel: "app",
      dueAt: todayStart + 8 * 60 * 60 * 1000,
      repeatRule: "daily",
      isActive: true,
      createdAt: now,
    }),
    doc("reminder_water", now - 1000, {
      userId: user._id,
      type: "water",
      title: "Drink water",
      body: "You are 2 cups away from today's goal.",
      channel: "app",
      dueAt: todayStart + 15 * 60 * 60 * 1000,
      repeatRule: "daily",
      isActive: true,
      createdAt: now - 1000,
    }),
    doc("reminder_followup", now - 2000, {
      userId: user._id,
      type: "follow_up",
      title: "Clinic follow-up reminder",
      body: "Please revisit in 14 days based on your latest result.",
      channel: "zalo",
      dueAt: now + 14 * 24 * 60 * 60 * 1000,
      repeatRule: "once",
      isActive: true,
      createdAt: now - 2000,
    }),
  ];

  const barcodeScans: BarcodeScan[] = [
    doc("scan_mobile_cola", now - 4000, {
      userId: user._id,
      productId: products[3]._id,
      barcode: products[3].barcode,
      source: "mobile",
      resultStatus: "matched",
      createdAt: now - 45 * 60 * 1000,
    }),
    doc("scan_admin_omega", now - 3000, {
      productId: products[2]._id,
      barcode: products[2].barcode,
      source: "admin",
      resultStatus: "matched",
      createdAt: now - 10 * 60 * 1000,
    }),
  ];

  const adminNotes: AdminNote[] = [
    doc("note_iron", now - 1000, {
      userId: user._id,
      productId: products[1]._id,
      medicineId: medicines[1]._id,
      title: "Customer note",
      body: "Avoid candy, cake, and Coke close to your evening iron dose.",
      type: "care-note",
      createdBy: "Admin Linh",
      createdAt: now - 1000,
    }),
    doc("note_cola", now - 2000, {
      userId: user._id,
      productId: products[3]._id,
      title: "What to avoid consume",
      body: "Caffeine-heavy drinks should stay away from iron and sleep reminders.",
      type: "avoid-guidance",
      createdBy: "Admin Linh",
      createdAt: now - 2000,
    }),
  ];

  const followUpRules: FollowUpRule[] = [
    doc("rule_a1c", now, {
      name: "High blood sugar result",
      triggerType: "lab",
      triggerLabel: "A1C above threshold",
      condition: "A1C >= 7.0",
      delayDays: 14,
      channel: "app+zalo+clinic",
      status: "active",
      createdAt: now,
    }),
    doc("rule_iron", now - 1000, {
      name: "Low iron recheck",
      triggerType: "clinic",
      triggerLabel: "Iron marker below range",
      condition: "Ferritin < 30",
      delayDays: 21,
      channel: "app+zalo",
      status: "active",
      createdAt: now - 1000,
    }),
  ];

  const healthCheckResults: HealthCheckResult[] = [
    doc("lab_a1c", now - 1000, {
      userId: user._id,
      metric: "A1C",
      value: 7.4,
      unit: "%",
      source: "clinic",
      observedAt: now - 10 * 24 * 60 * 60 * 1000,
      severity: "attention",
    }),
    doc("lab_ferritin", now - 2000, {
      userId: user._id,
      metric: "Ferritin",
      value: 24,
      unit: "ng/mL",
      source: "hospital",
      observedAt: now - 12 * 24 * 60 * 60 * 1000,
      severity: "attention",
    }),
  ];

  const notifications: AppNotification[] = [
    doc("notification_iron", now, {
      userId: user._id,
      type: "medicine",
      title: "20:00 Take Ferrous Sulfate",
      body: "1 capsule with water only. Avoid coffee, tea, and cola nearby.",
      channel: "app",
      dueAt: todayStart + 20 * 60 * 60 * 1000,
      status: "needs-action",
      metadata: { source: "seed" },
    }),
    doc("notification_water", now - 1000, {
      userId: user._id,
      type: "water",
      title: "Hydration check",
      body: "Add 2 more cups to complete today's checklist.",
      channel: "app",
      dueAt: todayStart + 17 * 60 * 60 * 1000,
      status: "pending",
      metadata: { source: "seed" },
    }),
    doc("notification_mood", now - 2000, {
      userId: user._id,
      type: "mood",
      title: "Daily mood check",
      body: "Let us know how your energy felt today.",
      channel: "app",
      dueAt: todayStart + 21 * 60 * 60 * 1000,
      status: "pending",
      metadata: { source: "seed" },
    }),
    doc("notification_warning", now - 3000, {
      userId: user._id,
      type: "warning",
      title: "Today's checklist still needs attention",
      body: "Medicine or water was not checked by the end of day.",
      channel: "zalo",
      dueAt: todayStart + 21.5 * 60 * 60 * 1000,
      status: "pending",
      metadata: { source: "seed" },
    }),
  ];

  const directMessages: DirectMessage[] = [
    doc("message_queued", now, {
      userId: user._id,
      phone: DEMO_PHONE,
      type: "medicine-reminder",
      channel: "zalo+app",
      body: "Hi Nghia Nguyen, this is a reminder to take Ferrous Sulfate at 8:00 PM and avoid coffee nearby.",
      preview: "Hi Nghia Nguyen, this is a reminder to take Ferrous Sulfate at 8:00 PM and avoid coffee nearby.",
      status: "queued",
      sentAt: now - 20 * 60 * 1000,
      createdAt: now - 20 * 60 * 1000,
    }),
  ];

  const messageDeliveries: MessageDelivery[] = [
    doc("delivery_app", now - 1000, {
      directMessageId: directMessages[0]._id,
      channel: "app",
      status: "delivered",
      deliveredAt: now - 18 * 60 * 1000,
    }),
    doc("delivery_zalo", now - 2000, {
      directMessageId: directMessages[0]._id,
      channel: "zalo",
      status: "pending",
    }),
  ];

  return {
    session: {
      phone: DEMO_PHONE,
      isAuthenticated: false,
      otpRequested: false,
      otpVerified: false,
      profileComplete: true,
      demoOtpCode: "4826",
      lastOtpSentAt: null,
    },
    users: [user],
    profiles: [profile],
    medicines,
    medicineLogs,
    reminders,
    dailyLogs,
    waterLogs,
    sleepLogs,
    activities,
    nutritionEntries,
    scannedMeals,
    products,
    barcodeScans,
    avoidItems: [],
    adminNotes,
    followUpRules,
    healthCheckResults,
    notifications,
    directMessages,
    messageDeliveries,
    remoteMode: "booting",
    remoteError: null,
    lastSyncedAt: null,
  };
}
