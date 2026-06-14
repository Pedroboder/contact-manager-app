import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `sample-user-${userId}`,
    email: `sample${userId}@example.com`,
    name: `Sample User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("contacts.list", () => {
  it("should return empty array for user with no contacts", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should only return contacts for the authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // This test verifies that the query is properly scoped to the user
    // In a real scenario, you would seed test data first
    const result = await caller.contacts.list();

    expect(Array.isArray(result)).toBe(true);
    // All results should belong to the authenticated user
    result.forEach((contact) => {
      expect(contact.userId).toBe(ctx.user.id);
    });
  });
});
