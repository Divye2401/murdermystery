"use client";

import { useState } from "react";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!validateEmail(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({ signup: null });
      const { data, error } = await auth.signUp(email, password);
      if (error) {
        console.error("Error signing up:", error);
        setErrors({ signup: error.message });
        return;
      }

      router.push("/");

      setLoading(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrors({ signup: "Connection failed. Please try again." });
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
          <h2 className="mt-6 text-xl text-gray-300">Create Your Account</h2>
        </div>

        {/* Form */}
        <form
          className="mt-8 space-y-6 bg-black/20  border border-gray-500/30 p-8 rounded-3xl shadow-2xl"
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
                className={`transition-all ease-in-out duration-100 w-full px-3 py-2 border-2 rounded-md bg-black/40 text-white placeholder-gray-400 hover:bg-black hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
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
                className={`transition-all ease-in-out duration-100 w-full px-3 py-2 border-2 rounded-md bg-black/40 text-white placeholder-gray-400 hover:bg-black hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Create a password (min. 6 characters)"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`transition-all ease-in-out duration-100 w-full px-3 py-2 border-2 rounded-md bg-black/40 text-white placeholder-gray-400 hover:bg-black hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex mt-12 mb-4 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {errors.signup && <p className="text-red-500">{errors.signup}</p>}

            <Link
              href="/login"
              className="transition-all ease-in-out duration-100 w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-black  hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign In Instead
            </Link>
          </div>
        </form>
      </div>
      <AudioPlayer src="/audio/login.wav" volume={0.1} autoPlay={true} />
    </div>
  );
}
