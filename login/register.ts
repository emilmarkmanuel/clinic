"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Missing fields" };

  try {
    // Check if user already exists
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) return { error: "Email already registered" };

    // Hash the password securely before saving
    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (err) {
    return { error: "Something went wrong during registration" };
  }
}
