import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserByPhone } from "./helpers";

const productShape = {
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
};

export const upsertProduct = mutation({
  args: productShape,
  handler: async (ctx, product) => {
    const existing = await ctx.db.query("products").withIndex("by_barcode", (q) => q.eq("barcode", product.barcode)).unique();
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...product,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("products", {
      ...product,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const importProducts = mutation({
  args: {
    rows: v.array(v.object(productShape)),
  },
  handler: async (ctx, { rows }) => {
    const ids = [];
    for (const row of rows) {
      ids.push(await upsertProduct.handler(ctx, row));
    }
    return ids;
  },
});

export const upsertReminder = mutation({
  args: {
    userPhone: v.optional(v.string()),
    medicineId: v.optional(v.id("medicines")),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    channel: v.string(),
    dueAt: v.number(),
    repeatRule: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = args.userPhone ? await getUserByPhone(ctx, args.userPhone) : null;
    return ctx.db.insert("reminders", {
      userId: user?._id,
      medicineId: args.medicineId,
      type: args.type,
      title: args.title,
      body: args.body,
      channel: args.channel,
      dueAt: args.dueAt,
      repeatRule: args.repeatRule,
      isActive: args.isActive,
      createdAt: Date.now(),
    });
  },
});

export const upsertAdminNote = mutation({
  args: {
    userPhone: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    medicineId: v.optional(v.id("medicines")),
    title: v.string(),
    body: v.string(),
    type: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const user = args.userPhone ? await getUserByPhone(ctx, args.userPhone) : null;
    return ctx.db.insert("adminNotes", {
      userId: user?._id,
      productId: args.productId,
      medicineId: args.medicineId,
      title: args.title,
      body: args.body,
      type: args.type,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });
  },
});

export const upsertFollowUpRule = mutation({
  args: {
    name: v.string(),
    triggerType: v.string(),
    triggerLabel: v.string(),
    condition: v.string(),
    delayDays: v.number(),
    channel: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("followUpRules", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const sendDirectMessage = mutation({
  args: {
    phone: v.string(),
    type: v.string(),
    channel: v.string(),
    body: v.string(),
  },
  handler: async (ctx, { phone, type, channel, body }) => {
    const user = await getUserByPhone(ctx, phone);
    const now = Date.now();
    const preview = body;

    const directMessageId = await ctx.db.insert("directMessages", {
      userId: user?._id,
      phone,
      type,
      channel,
      body,
      preview,
      status: "queued",
      sentAt: now,
      createdAt: now,
    });

    const channels = channel.split("+").map((value) => value.trim().toLowerCase()).filter(Boolean);
    for (const targetChannel of channels) {
      await ctx.db.insert("messageDeliveries", {
        directMessageId,
        channel: targetChannel,
        status: targetChannel === "app" ? "delivered" : "pending",
        deliveredAt: targetChannel === "app" ? now : undefined,
      });
    }

    if (user) {
      await ctx.db.insert("notifications", {
        userId: user._id,
        type,
        title: "Admin message",
        body,
        channel,
        dueAt: now,
        status: "queued",
        metadata: { directMessageId },
      });
    }

    return directMessageId;
  },
});
