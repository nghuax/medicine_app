import type { MutationCtx, QueryCtx } from "./_generated/server";

export const DEMO_PHONE = "+84 93 555 0182";

type DbCtx = QueryCtx | MutationCtx;

export async function getUserByPhone(ctx: DbCtx, phone: string) {
  return ctx.db.query("users").withIndex("by_phone", (q) => q.eq("phone", phone)).unique();
}

export async function getProfileByUserId(ctx: DbCtx, userId: string) {
  return ctx.db.query("profiles").withIndex("by_user", (q) => q.eq("userId", userId as never)).unique();
}

export function startOfDay(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function dateKeyFromTimestamp(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function daysAgo(base: number, count: number) {
  return startOfDay(base) - count * 24 * 60 * 60 * 1000;
}

export function sortByNewest<T extends { createdAt?: number; dueAt?: number; observedAt?: number }>(
  items: T[],
) {
  return [...items].sort((left, right) => {
    const leftValue = left.createdAt ?? left.dueAt ?? left.observedAt ?? 0;
    const rightValue = right.createdAt ?? right.dueAt ?? right.observedAt ?? 0;
    return rightValue - leftValue;
  });
}
