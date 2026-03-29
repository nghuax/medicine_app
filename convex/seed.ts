import type { MutationCtx } from "./_generated/server";
import { mutation } from "./_generated/server";
import { DEMO_PHONE, dateKeyFromTimestamp, daysAgo, getUserByPhone, startOfDay } from "./helpers";

export async function seedDemoData(ctx: MutationCtx) {
  const existing = await getUserByPhone(ctx, DEMO_PHONE);
  if (existing) {
    return { seeded: false, phone: DEMO_PHONE };
  }

  const now = Date.now();
  const today = startOfDay(now);

  const userId = await ctx.db.insert("users", {
    phone: DEMO_PHONE,
    displayName: "Nghia Nguyen",
    role: "user",
    zaloConnected: true,
    authProvider: "mock-otp",
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("profiles", {
    userId,
    fullName: "Nghia Nguyen",
    heightCm: 174,
    bloodType: "B+",
    deviceSyncEnabled: true,
    avatarHue: 18,
    createdAt: now,
    updatedAt: now,
  });

  const productSpecs = [
      {
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
      },
      {
        barcode: "893123450199",
        name: "Ferrous Sulfate",
        brand: "Sunrise Care",
        category: "Capsule",
        servingSize: "1 capsule",
        calories: 0,
        sugarGrams: 0,
        caffeineMg: 0,
        status: "active",
        warningText: "Avoid coffee, tea, and cola within two hours.",
        alternativeText: "Take with water or citrus water later in the day.",
        reminderNote: "Take with water only.",
        avoidItems: ["Coffee", "Tea", "Cola"],
        stock: 126,
      },
      {
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
      },
      {
        barcode: "893850000001",
        name: "Coca-Cola Zero 320ml",
        brand: "Coca-Cola",
        category: "Beverage",
        servingSize: "320ml",
        calories: 4,
        sugarGrams: 0,
        caffeineMg: 34,
        status: "review",
        warningText: "Avoid close to iron medicine.",
        alternativeText: "Better alternative: water with lemon or unsweetened tea later in the day.",
        reminderNote: "Monitor caffeine if used near sleep or iron doses.",
        avoidItems: ["Iron dose", "Late-night caffeine"],
        stock: 64,
      },
    ];

  const productIds = await Promise.all(
    productSpecs.map((product) =>
      ctx.db.insert("products", {
        ...product,
        source: product.barcode === "893850000001" ? "scanner" : "catalog",
        createdAt: now,
        updatedAt: now,
      }),
    ),
  );

  const [metforminProductId, ironProductId, omegaProductId, colaProductId] = productIds;

  const medicineIds = await Promise.all([
      ctx.db.insert("medicines", {
        userId,
        productId: metforminProductId,
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
      ctx.db.insert("medicines", {
        userId,
        productId: ironProductId,
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
        createdAt: now,
        updatedAt: now,
      }),
      ctx.db.insert("medicines", {
        userId,
        productId: omegaProductId,
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
        createdAt: now,
        updatedAt: now,
      }),
    ]);

  const [metforminId, ironId, omegaId] = medicineIds;

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const dayTimestamp = daysAgo(today, dayIndex);
      const dateKey = dateKeyFromTimestamp(dayTimestamp);
      const steps = [5500, 7200, 8400, 6900, 6100, 8100, 7000][dayIndex] ?? 6200;
      const sleepHours = [7.6, 7.1, 7.4, 6.8, 7.0, 7.8, 7.2][dayIndex] ?? 7.0;
      const waterCups = [8, 7, 10, 6, 8, 9, 7][dayIndex] ?? 8;
      const intakeCalories = [1820, 1740, 1910, 1680, 1765, 1880, 1710][dayIndex] ?? 1800;
      const burnedCalories = [620, 680, 710, 540, 610, 760, 590][dayIndex] ?? 600;

    await ctx.db.insert("dailyLogs", {
        userId,
        dateKey,
        steps,
        sleepHours,
        waterGoal: 10,
        waterCups,
        intakeCalories,
        burnedCalories,
        mood: dayIndex === 0 ? "steady" : dayIndex % 2 === 0 ? "energized" : "calm",
        source: dayIndex === 0 ? "device-sync" : "mixed",
      });

    await ctx.db.insert("waterLogs", {
        userId,
        dateKey,
        entries: Array.from({ length: waterCups }, (_, index) => dayTimestamp + index * 70 * 60 * 1000),
        cups: waterCups,
        goal: 10,
        updatedAt: dayTimestamp + 20 * 60 * 60 * 1000,
      });

    await ctx.db.insert("sleepLogs", {
        userId,
        dateKey,
        durationHours: sleepHours,
        quality: sleepHours >= 7.4 ? "rested" : "fair",
        source: dayIndex === 0 ? "watch-sync" : "manual",
        updatedAt: dayTimestamp + 7 * 60 * 60 * 1000,
      });

    const activityList = [
      { type: "walk", durationMin: 42, caloriesBurned: 215, distanceKm: 3.8 },
      { type: "bike", durationMin: 28, caloriesBurned: 240, distanceKm: 7.2 },
    ];

    if (dayIndex % 3 === 0) {
      activityList.push({ type: "swim", durationMin: 35, caloriesBurned: 310, distanceKm: 1.1 });
    }

    for (const activity of activityList) {
      await ctx.db.insert("activities", {
        userId,
        dateKey,
        ...activity,
        source: dayIndex === 0 ? "watch-sync" : "manual",
      });
    }

    await ctx.db.insert("nutritionEntries", {
        userId,
        dateKey,
        name: dayIndex === 0 ? "Avocado chicken bowl" : "Balanced meal plan",
        calories: intakeCalories,
        protein: 86,
        carbs: 184,
        fat: 62,
        note: dayIndex === 0 ? "Lunch logged after photo scan." : undefined,
        source: dayIndex === 0 ? "meal-scan" : "manual",
      });
  }

  const todayKey = dateKeyFromTimestamp(today);

  const scheduledEntries = [
    { medicineId: metforminId, at: today + 8 * 60 * 60 * 1000, status: "taken", note: "After breakfast" },
    { medicineId: ironId, at: today + 13 * 60 * 60 * 1000, status: "taken", note: "Water only" },
    { medicineId: ironId, at: today + 20 * 60 * 60 * 1000, status: "pending", note: "Avoid coffee nearby" },
    { medicineId: omegaId, at: today + 20.5 * 60 * 60 * 1000, status: "pending", note: "Take after dinner" },
  ];

  for (const entry of scheduledEntries) {
    await ctx.db.insert("medicineLogs", {
      userId,
      medicineId: entry.medicineId,
      scheduledFor: entry.at,
      loggedAt: entry.status === "taken" ? entry.at + 8 * 60 * 1000 : undefined,
      status: entry.status,
      note: entry.note,
    });
  }

  await ctx.db.insert("scannedMeals", {
      userId,
      dateKey: todayKey,
      title: "Chicken and avocado salad",
      estimatedCalories: 540,
      detectedItems: ["Chicken", "Avocado", "Leafy greens", "Olive oil"],
      analyzer: "mock-ai-v1",
      confidence: 0.88,
      status: "reviewed",
      photoName: "meal-bowl.jpg",
      createdAt: now - 2 * 60 * 60 * 1000,
    });

  await ctx.db.insert("barcodeScans", {
      userId,
      productId: colaProductId,
      barcode: "893850000001",
      source: "mobile",
      resultStatus: "matched",
      createdAt: now - 45 * 60 * 1000,
    });

  await ctx.db.insert("barcodeScans", {
      productId: omegaProductId,
      barcode: "893123450288",
      source: "admin",
      resultStatus: "matched",
      createdAt: now - 10 * 60 * 1000,
    });

  await ctx.db.insert("avoidItems", {
      label: "Coffee",
      note: "Keep away from iron reminder windows.",
      severity: "medium",
      productId: ironProductId,
      medicineId: ironId,
      createdAt: now,
    });

  await ctx.db.insert("avoidItems", {
      label: "Sweet soda",
      note: "May affect blood sugar and evening dose quality.",
      severity: "high",
      productId: metforminProductId,
      medicineId: metforminId,
      createdAt: now,
    });

  await ctx.db.insert("adminNotes", {
      userId,
      productId: ironProductId,
      medicineId: ironId,
      title: "Customer note",
      body: "Avoid candy, cake, and Coke close to your evening iron dose.",
      type: "care-note",
      createdBy: "Admin Linh",
      createdAt: now,
    });

  await ctx.db.insert("adminNotes", {
      userId,
      productId: colaProductId,
      title: "What to avoid consume",
      body: "Caffeine-heavy drinks should stay away from iron and sleep reminders.",
      type: "avoid-guidance",
      createdBy: "Admin Linh",
      createdAt: now - 30 * 60 * 1000,
    });

  await ctx.db.insert("followUpRules", {
      name: "High blood sugar result",
      triggerType: "lab",
      triggerLabel: "A1C above threshold",
      condition: "A1C >= 7.0",
      delayDays: 14,
      channel: "app+zalo+clinic",
      status: "active",
      createdAt: now,
    });

  await ctx.db.insert("followUpRules", {
      name: "Low iron recheck",
      triggerType: "clinic",
      triggerLabel: "Iron marker below range",
      condition: "Ferritin < 30",
      delayDays: 21,
      channel: "app+zalo",
      status: "active",
      createdAt: now - 5 * 60 * 1000,
    });

  await ctx.db.insert("healthCheckResults", {
      userId,
      metric: "A1C",
      value: 7.4,
      unit: "%",
      source: "clinic",
      observedAt: now - 10 * 24 * 60 * 60 * 1000,
      severity: "attention",
    });

  await ctx.db.insert("healthCheckResults", {
      userId,
      metric: "Ferritin",
      value: 24,
      unit: "ng/mL",
      source: "hospital",
      observedAt: now - 12 * 24 * 60 * 60 * 1000,
      severity: "attention",
    });

  const reminderSpecs = [
      {
        medicineId: metforminId,
        type: "medicine",
        title: "Take Metformin",
        body: "08:00 AM • 1 tablet after breakfast",
        channel: "app",
        dueAt: today + 8 * 60 * 60 * 1000,
        repeatRule: "daily",
      },
      {
        type: "water",
        title: "Drink water",
        body: "You are 2 cups away from today's goal.",
        channel: "app",
        dueAt: today + 15 * 60 * 60 * 1000,
        repeatRule: "daily",
      },
      {
        type: "mood",
        title: "Daily mood check",
        body: "How steady did your day feel?",
        channel: "app",
        dueAt: today + 21 * 60 * 60 * 1000,
        repeatRule: "daily",
      },
      {
        type: "follow_up",
        title: "Clinic follow-up reminder",
        body: "Please revisit in 14 days based on your latest result.",
        channel: "zalo",
        dueAt: now + 14 * 24 * 60 * 60 * 1000,
        repeatRule: "once",
      },
    ];

  for (const reminder of reminderSpecs) {
    await ctx.db.insert("reminders", {
      userId,
      isActive: true,
      createdAt: now,
      ...reminder,
    });
  }

  const notificationSpecs = [
      {
        type: "medicine",
        title: "20:00 Take Ferrous Sulfate",
        body: "1 capsule with water only. Avoid coffee, tea, and cola nearby.",
        channel: "app",
        dueAt: today + 20 * 60 * 60 * 1000,
        status: "needs-action",
      },
      {
        type: "water",
        title: "Hydration check",
        body: "Add 2 more cups to complete today's checklist.",
        channel: "app",
        dueAt: today + 17 * 60 * 60 * 1000,
        status: "pending",
      },
      {
        type: "mood",
        title: "Daily mood check",
        body: "Let us know how your energy felt today.",
        channel: "app",
        dueAt: today + 21 * 60 * 60 * 1000,
        status: "pending",
      },
      {
        type: "warning",
        title: "Today's checklist still needs attention",
        body: "Medicine or water was not checked by the end of day.",
        channel: "zalo",
        dueAt: today + 21.5 * 60 * 60 * 1000,
        status: "pending",
      },
    ];

  for (const notification of notificationSpecs) {
    await ctx.db.insert("notifications", {
      userId,
      metadata: { source: "seed" },
      ...notification,
    });
  }

  const directMessageId = await ctx.db.insert("directMessages", {
      userId,
      phone: DEMO_PHONE,
      type: "medicine-reminder",
      channel: "zalo+app",
      body: "Hi Nghia Nguyen, this is a reminder to take Ferrous Sulfate at 8:00 PM and avoid coffee nearby.",
      preview: "Hi Nghia Nguyen, this is a reminder to take Ferrous Sulfate at 8:00 PM and avoid coffee nearby.",
      status: "queued",
      sentAt: now - 20 * 60 * 1000,
      createdAt: now - 20 * 60 * 1000,
    });

  await ctx.db.insert("messageDeliveries", {
      directMessageId,
      channel: "app",
      status: "delivered",
      deliveredAt: now - 18 * 60 * 1000,
    });

  await ctx.db.insert("messageDeliveries", {
      directMessageId,
      channel: "zalo",
      status: "pending",
    });

  return { seeded: true, phone: DEMO_PHONE };
}

export const ensureDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    return seedDemoData(ctx);
  },
});
