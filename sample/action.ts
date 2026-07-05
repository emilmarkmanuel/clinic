'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) return { error: 'All fields are required.' };

  try {
    // Insert into PostgreSQL via Drizzle
    await db.insert(users).values({ name, email });
    
    // Refresh the page data instantly
    revalidatePath('/users'); 
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create user.' };
  }
}
