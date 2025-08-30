"use client";

import { useState } from "react";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Signing in:", { email, password, rememberMe });
      const { data, error } = await auth.signIn({
        email,
        password,
        rememberMe,
      });

      if (error) {
        console.error("Error signing in:", error);
        setError(error.message);
        return;
      }

      // Success - redirect to home
      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0.6)),url('https://images.unsplash.com/photo-1535905313417-483b22cb9d03?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-fixed">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Murder Mystery Detective
          </h1>
          <h2 className="mt-6 text-xl text-gray-300">
            Welcome Back, Detective
          </h2>
        </div>

        {/* Form */}
        <form
          className="mt-8 space-y-6 bg-black/20 border border-gray-500/30 p-8 rounded-3xl shadow-2xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all ease-in-out duration-100 w-full px-3 py-2 border-2 rounded-md bg-black/40 text-white placeholder-gray-400 hover:bg-black hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-600"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all ease-in-out duration-100 w-full px-3 py-2 border-2 rounded-md bg-black/40 text-white placeholder-gray-400 hover:bg-black hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-600"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex mt-12 mb-4 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {error && <p className="text-red-500">{error}</p>}

            <Link
              href="/signup"
              className="transition-all ease-in-out duration-100 w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-black hover:border-2 hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
      <AudioPlayer src="/audio/login.wav" volume={0.1} autoPlay={true} />
    </div>
  );
}
