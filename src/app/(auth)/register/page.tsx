"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    // Client-side password strength validation
    const passwordRegex = /^.{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      // 1. Call the registration API endpoint
      const res = await fetch("/api/register", {
        // Uses the new App Router API route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Registration successful, now sign the user in
      const signInResponse = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResponse?.ok) {
        router.push("/");
      } else {
        setError(
          signInResponse?.error ||
            "Registration succeeded, but sign-in failed.",
        );
      }
    } catch (err) {
      console.error("Registration or Sign In Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 dark:from-gray-900 dark:to-gray-950">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 opacity-30 blur-3xl dark:from-blue-800 dark:to-indigo-800"></div>
      </div>
      <Card className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white/90 p-8 shadow-2xl dark:border-gray-700 dark:bg-slate-800/70">
        <CardHeader className="mb-6 text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Your Account
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
            Start tracking your job applications today!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Name (Optional)
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                disabled={loading}
                className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                disabled={loading}
                className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Minimum 8 characters
              </p>
            </div>
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 dark:border-red-700 dark:bg-red-900/20">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
            <Button
              type="submit"
              className="h-11 w-full cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
              disabled={loading}
              variant={undefined}
              size={undefined}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          <Button
            className="h-11 w-full cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-lg font-semibold text-gray-700 shadow-md transition-all duration-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            disabled={loading}
            variant={undefined}
            size={undefined}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.9 7.18l7.71 5.98c4.51-4.18 7.11-10.59 7.11-18.63z"
              ></path>
              <path
                fill="#FBBC04"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14-.76-4.59l-7.98-6.19C3.38 15.53 2.56 19.73 2.56 24c0 4.27.82 8.47 2.56 12.22l7.98-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.71-5.98c-2.05 1.3-4.73 2.08-8.18 2.08-6.27 0-11.59-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign Up with Google
          </Button>

          <div className="mt-6 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
