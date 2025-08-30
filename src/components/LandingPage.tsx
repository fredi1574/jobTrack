import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-16 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-950">
      {/* Background elements for wow effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 opacity-30 blur-3xl dark:from-blue-800 dark:to-indigo-800"></div>
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-20 blur-3xl dark:from-purple-800 dark:to-pink-800"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h1 className="animate-fade-in-up text-5xl font-extrabold tracking-tight text-balance text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
          Your Journey to Success Starts Here
          <span className="text-primary-600 dark:text-primary-400 block">
            Job Application Tracker
          </span>
        </h1>
        <p className="animate-fade-in-up text-muted-foreground mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-pretty sm:text-xl dark:text-gray-300">
          Effortlessly manage your job applications, track your progress, and
          land your dream job with an intuitive platform.
        </p>
        <div className="animate-fade-in-up mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            className="transform rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
            asChild
          >
            <Link href="/register">Get Started - It&apos;s Free!</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="transform rounded-full border-2 border-blue-500 bg-transparent px-8 py-3 text-lg font-semibold text-blue-600 shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 w-full text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 JobTrack. All rights reserved.
      </div>
    </section>
  );
}
