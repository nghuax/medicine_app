import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    phone: v.string(),
    displayName: v.optional(v.string()),
    role: v.string(),
    zaloConnected: v.boolean(),
    authProvider: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_phone", ["phone"]),

  profiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    heightCm: v.number(),
    bloodType: v.string(),
    deviceSyncEnabled: v.boolean(),
    avatarHue: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  medicines: defineTable({
    userId: v.id("users"),
    productId: v.optional(v.id("products")),
    name: v.string(),
    strength: v.string(),
    form: v.string(),
    dosage: v.string(),
    scheduleTimes: v.array(v.string()),
    reminderTimes: v.array(v.string()),
    note: v.optional(v.string()),
    avoidItems: v.array(v.string()),
    status: v.string(),
    adherenceRate: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  medicineLogs: defineTable({
    userId: v.id("users"),
    medicineId: v.id("medicines"),
    scheduledFor: v.number(),
    loggedAt: v.optional(v.number()),
    status: v.string(),
    note: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_medicine", ["medicineId"]),

  reminders: defineTable({
    userId: v.optional(v.id("users")),
    medicineId: v.optional(v.id("medicines")),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    channel: v.string(),
    dueAt: v.number(),
    repeatRule: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user_due", ["userId", "dueAt"])
    .index("by_type", ["type"]),

  dailyLogs: defineTable({
    userId: v.id("users"),
    dateKey: v.string(),
    steps: v.number(),
    sleepHours: v.number(),
    waterGoal: v.number(),
    waterCups: v.number(),
    intakeCalories: v.number(),
    burnedCalories: v.number(),
    mood: v.optional(v.string()),
    source: v.string(),
  }).index("by_user_date", ["userId", "dateKey"]),

  waterLogs: defineTable({
    userId: v.id("users"),
    dateKey: v.string(),
    entries: v.array(v.number()),
    cups: v.number(),
    goal: v.number(),
    updatedAt: v.number(),
  }).index("by_user_date", ["userId", "dateKey"]),

  sleepLogs: defineTable({
    userId: v.id("users"),
    dateKey: v.string(),
    durationHours: v.number(),
    quality: v.string(),
    source: v.string(),
    updatedAt: v.number(),
  }).index("by_user_date", ["userId", "dateKey"]),

  activities: defineTable({
    userId: v.id("users"),
    dateKey: v.string(),
    type: v.string(),
    durationMin: v.number(),
    caloriesBurned: v.number(),
    distanceKm: v.optional(v.number()),
    source: v.string(),
  }).index("by_user_date", ["userId", "dateKey"]),

  nutritionEntries: defineTable({
    userId: v.id("users"),
    dateKey: v.string(),
    name: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    note: v.optional(v.string()),
    source: v.string(),
  }).index("by_user_date", ["userId", "dateKey"]),

  scannedMeals: defineTable({
    userId: v.id("users"),
    dateKey: v.string(),
    title: v.string(),
    estimatedCalories: v.number(),
    detectedItems: v.array(v.string()),
    analyzer: v.string(),
    confidence: v.number(),
    status: v.string(),
    photoName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user_date", ["userId", "dateKey"]),

  products: defineTable({
    barcode: v.string(),
    name: v.string(),
    brand: v.string(),
    category: v.string(),
    servingSize: v.string(),
    calories: v.number(),
    sugarGrams: v.number(),
    caffeineMg: v.number(),
    status: v.string(),
    warningText: v.optional(v.string()),
    alternativeText: v.optional(v.string()),
    reminderNote: v.optional(v.string()),
    avoidItems: v.array(v.string()),
    stock: v.number(),
    source: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_barcode", ["barcode"])
    .index("by_name", ["name"]),

  barcodeScans: defineTable({
    userId: v.optional(v.id("users")),
    productId: v.optional(v.id("products")),
    barcode: v.string(),
    source: v.string(),
    resultStatus: v.string(),
    createdAt: v.number(),
  })
    .index("by_barcode", ["barcode"])
    .index("by_source", ["source"]),

  avoidItems: defineTable({
    label: v.string(),
    note: v.optional(v.string()),
    severity: v.string(),
    productId: v.optional(v.id("products")),
    medicineId: v.optional(v.id("medicines")),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_medicine", ["medicineId"]),

  adminNotes: defineTable({
    userId: v.optional(v.id("users")),
    productId: v.optional(v.id("products")),
    medicineId: v.optional(v.id("medicines")),
    title: v.string(),
    body: v.string(),
    type: v.string(),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  followUpRules: defineTable({
    name: v.string(),
    triggerType: v.string(),
    triggerLabel: v.string(),
    condition: v.string(),
    delayDays: v.number(),
    channel: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  healthCheckResults: defineTable({
    userId: v.id("users"),
    metric: v.string(),
    value: v.number(),
    unit: v.string(),
    source: v.string(),
    observedAt: v.number(),
    severity: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_metric", ["userId", "metric"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    channel: v.string(),
    dueAt: v.number(),
    status: v.string(),
    metadata: v.optional(v.any()),
  }).index("by_user_due", ["userId", "dueAt"]),

  directMessages: defineTable({
    userId: v.optional(v.id("users")),
    phone: v.string(),
    type: v.string(),
    channel: v.string(),
    body: v.string(),
    preview: v.string(),
    status: v.string(),
    sentAt: v.number(),
    createdAt: v.number(),
  }).index("by_phone", ["phone"]),

  messageDeliveries: defineTable({
    directMessageId: v.id("directMessages"),
    channel: v.string(),
    status: v.string(),
    deliveredAt: v.optional(v.number()),
    error: v.optional(v.string()),
  }).index("by_message", ["directMessageId"]),
});
