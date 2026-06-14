import { eq, and, or, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contacts, Contact, InsertContact } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserContacts(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contacts: database not available");
    return [];
  }

  try {
    const result = await db.select().from(contacts).where(eq(contacts.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user contacts:", error);
    throw error;
  }
}

export async function getContactById(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get contact:", error);
    throw error;
  }
}

export async function createContact(contact: InsertContact) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(contacts).values(contact);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create contact:", error);
    throw error;
  }
}

export async function updateContact(contactId: number, userId: number, data: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contact: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db
      .update(contacts)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update contact:", error);
    throw error;
  }
}

export async function deleteContact(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete contact: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db
      .delete(contacts)
      .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete contact:", error);
    throw error;
  }
}

export async function searchContacts(userId: number, query: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search contacts: database not available");
    return [];
  }

  try {
    const searchPattern = `%${query}%`;
    const result = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.userId, userId),
          or(
            like(contacts.nome, searchPattern),
            like(contacts.email, searchPattern),
            like(contacts.telefone, searchPattern)
          )
        )
      );
    return result;
  } catch (error) {
    console.error("[Database] Failed to search contacts:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.
