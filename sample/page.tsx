import { db } from '@/db';
import { users } from '@/db/schema';
import { createUser } from '../actions';

export default async function UsersPage() {
  // Fetch data directly on the server during page load
  const allUsers = await db.select().from(users);

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      {/* Input Form using Server Actions */}
      <form action={createUser} className="flex flex-col gap-3 border p-4 rounded-lg bg-gray-50">
        <h2 className="font-semibold text-gray-700">Add New User</h2>
        <input name="name" type="text" placeholder="Name" required className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Save User
        </button>
      </form>

      {/* Dynamic User Roster */}
      <div>
        <h2 className="font-semibold text-lg mb-2 text-gray-800">Existing Users ({allUsers.length})</h2>
        <ul className="divide-y divide-gray-200">
          {allUsers.map((user) => (
            <li key={user.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-xs text-gray-400">ID: {user.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
