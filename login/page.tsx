import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-xl font-bold mb-4">Login to Your Account</h1>
      
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData);
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input name="email" type="email" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" required className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  );
}
