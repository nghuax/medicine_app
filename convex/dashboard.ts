import { query } from "./_generated/server";
import { v } from "convex/values";
import { DEMO_PHONE, getProfileByUserId, getUserByPhone, sortByNewest } from "./helpers";

export const mobileSnapshot = query({
  args: {
    phone: v.optional(v.string()),
  },
  handler: async (ctx, { phone }) => {
    const targetPhone = phone ?? DEMO_PHONE;
    const user = await getUserByPhone(ctx, targetPhone);
    if (!user) {
      return null;
    }

    const [profile, medicines, medicineLogs, reminders, dailyLogs, waterLogs, sleepLogs, activities, nutritionEntries, scannedMeals, notifications, products, barcodeScans, avoidItems, adminNotes, healthCheckResults] =
      await Promise.all([
        getProfileByUserId(ctx, user._id),
        ctx.db.query("medicines").withIndex("by_user", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("medicineLogs").withIndex("by_user", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("reminders").withIndex("by_user_due", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("dailyLogs").withIndex("by_user_date", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("waterLogs").withIndex("by_user_date", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("sleepLogs").withIndex("by_user_date", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("activities").withIndex("by_user_date", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("nutritionEntries").withIndex("by_user_date", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("scannedMeals").withIndex("by_user_date", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("notifications").withIndex("by_user_due", (q) => q.eq("userId", user._id)).collect(),
        ctx.db.query("products").collect(),
        ctx.db.query("barcodeScans").collect(),
        ctx.db.query("avoidItems").collect(),
        ctx.db.query("adminNotes").collect(),
        ctx.db.query("healthCheckResults").withIndex("by_user", (q) => q.eq("userId", user._id)).collect(),
      ]);

    return {
      user,
      profile,
      medicines,
      medicineLogs: sortByNewest(medicineLogs),
      reminders: sortByNewest(reminders),
      dailyLogs: [...dailyLogs].sort((left, right) => left.dateKey.localeCompare(right.dateKey)),
      waterLogs,
      sleepLogs,
      activities,
      nutritionEntries,
      scannedMeals: sortByNewest(scannedMeals),
      notifications: sortByNewest(notifications),
      products,
      barcodeScans: sortByNewest(barcodeScans),
      avoidItems,
      adminNotes: sortByNewest(adminNotes),
      healthCheckResults: sortByNewest(healthCheckResults),
    };
  },
});

export const adminSnapshot = query({
  args: {},
  handler: async (ctx) => {
    const [users, profiles, products, reminders, barcodeScans, avoidItems, adminNotes, followUpRules, healthCheckResults, notifications, directMessages, messageDeliveries] =
      await Promise.all([
        ctx.db.query("users").collect(),
        ctx.db.query("profiles").collect(),
        ctx.db.query("products").collect(),
        ctx.db.query("reminders").collect(),
        ctx.db.query("barcodeScans").collect(),
        ctx.db.query("avoidItems").collect(),
        ctx.db.query("adminNotes").collect(),
        ctx.db.query("followUpRules").collect(),
        ctx.db.query("healthCheckResults").collect(),
        ctx.db.query("notifications").collect(),
        ctx.db.query("directMessages").collect(),
        ctx.db.query("messageDeliveries").collect(),
      ]);

    return {
      users,
      profiles,
      products,
      reminders: sortByNewest(reminders),
      barcodeScans: sortByNewest(barcodeScans),
      avoidItems,
      adminNotes: sortByNewest(adminNotes),
      followUpRules: sortByNewest(followUpRules),
      healthCheckResults: sortByNewest(healthCheckResults),
      notifications: sortByNewest(notifications),
      directMessages: sortByNewest(directMessages),
      messageDeliveries: sortByNewest(messageDeliveries),
    };
  },
});

export const productByBarcode = query({
  args: {
    barcode: v.string(),
  },
  handler: async (ctx, { barcode }) => {
    return ctx.db.query("products").withIndex("by_barcode", (q) => q.eq("barcode", barcode)).unique();
  },
});
