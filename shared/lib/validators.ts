import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(8, "Enter a valid phone number.")
  .regex(/^[+\d\s-]+$/, "Use digits, spaces, or + only.");

export const profileSchema = z.object({
  fullName: z.string().min(2, "Enter the user's full name."),
  heightCm: z.coerce.number().min(80).max(260),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  deviceSyncEnabled: z.boolean().default(false),
});

export const activitySchema = z.object({
  type: z.string().min(2),
  durationMin: z.coerce.number().min(5).max(240),
  distanceKm: z.coerce.number().min(0).max(500).optional(),
});

export const productSchema = z.object({
  barcode: z.string().min(6),
  name: z.string().min(2),
  brand: z.string().min(2),
  category: z.string().min(2),
  servingSize: z.string().min(2),
  calories: z.coerce.number().min(0).max(5000),
  sugarGrams: z.coerce.number().min(0).max(500),
  caffeineMg: z.coerce.number().min(0).max(500),
  status: z.string().min(2),
  warningText: z.string().optional(),
  alternativeText: z.string().optional(),
  reminderNote: z.string().optional(),
  avoidItems: z.string().optional(),
  stock: z.coerce.number().min(0).max(100000),
});

export const reminderSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(6),
  channel: z.string().min(2),
  type: z.string().min(2),
  repeatRule: z.string().optional(),
});

export const directMessageSchema = z.object({
  phone: phoneSchema,
  type: z.string().min(2),
  channel: z.string().min(2),
  body: z.string().min(6),
});
