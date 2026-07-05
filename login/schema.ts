import { pgTable, text, timestamp, primaryKey, integer } from "pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// Primary User Table
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password"), // Added for credential authentication
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

// Required Auth.js Account Table (for OAuth like Google/GitHub if added later)
export const accounts = pgTable("account", {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    { compositeKey: primaryKey({ columns: [account.provider, account.providerAccountId] }) },
  ]
);

// Required Auth.js Sessions Table
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
