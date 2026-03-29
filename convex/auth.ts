import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { DEMO_PHONE, getProfileByUserId, getUserByPhone } from "./helpers";
import { seedDemoData } from "./seed";

export const getSessionUser = query({
  args: {
    phone: v.string(),
  },
  handler: async (ctx, { phone }) => {
    const user = await getUserByPhone(ctx, phone);
    if (!user) {
      return null;
    }

    const profile = await getProfileByUserId(ctx, user._id);
    return { user, profile };
  },
});

export const mockSignIn = mutation({
  args: {
    phone: v.string(),
  },
  handler: async (ctx, { phone }) => {
    await seedDemoData(ctx);

    const normalizedPhone = phone.trim() || DEMO_PHONE;
    const now = Date.now();

    let user = await getUserByPhone(ctx, normalizedPhone);
    if (!user) {
      const userId = await ctx.db.insert("users", {
        phone: normalizedPhone,
        displayName: normalizedPhone === DEMO_PHONE ? "Nghia Nguyen" : "New member",
        role: "user",
        zaloConnected: false,
        authProvider: "mock-otp",
        createdAt: now,
        updatedAt: now,
      });

      await ctx.db.insert("profiles", {
        userId,
        fullName: normalizedPhone === DEMO_PHONE ? "Nghia Nguyen" : "New member",
        heightCm: 170,
        bloodType: "O+",
        deviceSyncEnabled: false,
        avatarHue: 96,
        createdAt: now,
        updatedAt: now,
      });

      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new Error("Unable to create session user.");
    }

    await ctx.db.patch(user._id, {
      updatedAt: now,
    });

    const profile = await getProfileByUserId(ctx, user._id);
    return { user, profile };
  },
});
