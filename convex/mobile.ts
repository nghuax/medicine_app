import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { dateKeyFromTimestamp, getUserByPhone } from "./helpers";

export const upsertProfile = mutation({
  args: {
    phone: v.string(),
    fullName: v.string(),
    heightCm: v.number(),
    bloodType: v.string(),
    deviceSyncEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByPhone(ctx, args.phone);
    if (!user) {
      throw new Error("User not found.");
    }

    const existingProfile = await ctx.db.query("profiles").withIndex("by_user", (q) => q.eq("userId", user._id)).unique();
    const now = Date.now();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        fullName: args.fullName,
        heightCm: args.heightCm,
        bloodType: args.bloodType,
        deviceSyncEnabled: args.deviceSyncEnabled,
        updatedAt: now,
      });
      return existingProfile._id;
    }

    return ctx.db.insert("profiles", {
      userId: user._id,
      fullName: args.fullName,
      heightCm: args.heightCm,
      bloodType: args.bloodType,
      deviceSyncEnabled: args.deviceSyncEnabled,
      avatarHue: 96,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const toggleMedicineLog = mutation({
  args: {
    phone: v.string(),
    medicineId: v.id("medicines"),
    scheduledFor: v.number(),
    status: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { phone, medicineId, scheduledFor, status, note }) => {
    const user = await getUserByPhone(ctx, phone);
    if (!user) {
      throw new Error("User not found.");
    }

    const existingLogs = await ctx.db.query("medicineLogs").withIndex("by_medicine", (q) => q.eq("medicineId", medicineId)).collect();
    const matching = existingLogs.find((entry) => entry.scheduledFor === scheduledFor && entry.userId === user._id);
    const now = Date.now();

    if (matching) {
      await ctx.db.patch(matching._id, {
        status,
        note,
        loggedAt: status === "taken" ? now : undefined,
      });
      return matching._id;
    }

    return ctx.db.insert("medicineLogs", {
      userId: user._id,
      medicineId,
      scheduledFor,
      loggedAt: status === "taken" ? now : undefined,
      status,
      note,
    });
  },
});

export const upsertDailyLog = mutation({
  args: {
    phone: v.string(),
    dateKey: v.string(),
    steps: v.number(),
    sleepHours: v.number(),
    waterGoal: v.number(),
    waterCups: v.number(),
    intakeCalories: v.number(),
    burnedCalories: v.number(),
    mood: v.optional(v.string()),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByPhone(ctx, args.phone);
    if (!user) {
      throw new Error("User not found.");
    }

    const existing = await ctx.db.query("dailyLogs").withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("dateKey", args.dateKey)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        phone: undefined,
      } as never);
      return existing._id;
    }

    return ctx.db.insert("dailyLogs", {
      userId: user._id,
      dateKey: args.dateKey,
      steps: args.steps,
      sleepHours: args.sleepHours,
      waterGoal: args.waterGoal,
      waterCups: args.waterCups,
      intakeCalories: args.intakeCalories,
      burnedCalories: args.burnedCalories,
      mood: args.mood,
      source: args.source,
    });
  },
});

export const upsertWaterLog = mutation({
  args: {
    phone: v.string(),
    dateKey: v.string(),
    entries: v.array(v.number()),
    cups: v.number(),
    goal: v.number(),
  },
  handler: async (ctx, { phone, dateKey, entries, cups, goal }) => {
    const user = await getUserByPhone(ctx, phone);
    if (!user) {
      throw new Error("User not found.");
    }

    const existing = await ctx.db.query("waterLogs").withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("dateKey", dateKey)).unique();
    const updatedAt = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { entries, cups, goal, updatedAt });
      return existing._id;
    }

    return ctx.db.insert("waterLogs", {
      userId: user._id,
      dateKey,
      entries,
      cups,
      goal,
      updatedAt,
    });
  },
});

export const upsertSleepLog = mutation({
  args: {
    phone: v.string(),
    dateKey: v.string(),
    durationHours: v.number(),
    quality: v.string(),
    source: v.string(),
  },
  handler: async (ctx, { phone, dateKey, durationHours, quality, source }) => {
    const user = await getUserByPhone(ctx, phone);
    if (!user) {
      throw new Error("User not found.");
    }

    const existing = await ctx.db.query("sleepLogs").withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("dateKey", dateKey)).unique();
    const updatedAt = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { durationHours, quality, source, updatedAt });
      return existing._id;
    }

    return ctx.db.insert("sleepLogs", {
      userId: user._id,
      dateKey,
      durationHours,
      quality,
      source,
      updatedAt,
    });
  },
});

export const addActivity = mutation({
  args: {
    phone: v.string(),
    dateKey: v.string(),
    type: v.string(),
    durationMin: v.number(),
    caloriesBurned: v.number(),
    distanceKm: v.optional(v.number()),
    source: v.string(),
  },
  handler: async (ctx, { phone, ...activity }) => {
    const user = await getUserByPhone(ctx, phone);
    if (!user) {
      throw new Error("User not found.");
    }

    return ctx.db.insert("activities", {
      userId: user._id,
      ...activity,
    });
  },
});

export const saveNutritionEntry = mutation({
  args: {
    phone: v.string(),
    dateKey: v.string(),
    name: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    note: v.optional(v.string()),
    source: v.string(),
  },
  handler: async (ctx, { phone, ...entry }) => {
    const user = await getUserByPhone(ctx, phone);
    if (!user) {
      throw new Error("User not found.");
    }

    return ctx.db.insert("nutritionEntries", {
      userId: user._id,
      ...entry,
    });
  },
});

export const saveScannedMeal = mutation({
  args: {
    phone: v.string(),
    title: v.string(),
    estimatedCalories: v.number(),
    detectedItems: v.array(v.string()),
    analyzer: v.string(),
    confidence: v.number(),
    status: v.string(),
    photoName: v.optional(v.string()),
  },
  handler: async (ctx, { phone, title, estimatedCalories, detectedItems, analyzer, confidence, status, photoName }) => {
    const user = await getUserByPhone(ctx, phone);
    if (!user) {
      throw new Error("User not found.");
    }

    const now = Date.now();
    return ctx.db.insert("scannedMeals", {
      userId: user._id,
      dateKey: dateKeyFromTimestamp(now),
      title,
      estimatedCalories,
      detectedItems,
      analyzer,
      confidence,
      status,
      photoName,
      createdAt: now,
    });
  },
});

export const recordBarcodeScan = mutation({
  args: {
    phone: v.optional(v.string()),
    barcode: v.string(),
    source: v.string(),
  },
  handler: async (ctx, { phone, barcode, source }) => {
    const user = phone ? await getUserByPhone(ctx, phone) : null;
    const product = await ctx.db.query("products").withIndex("by_barcode", (q) => q.eq("barcode", barcode)).unique();
    return ctx.db.insert("barcodeScans", {
      userId: user?._id,
      productId: product?._id,
      barcode,
      source,
      resultStatus: product ? "matched" : "missing",
      createdAt: Date.now(),
    });
  },
});
