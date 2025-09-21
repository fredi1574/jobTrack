import Link from "next/link";
import AnimatedButtons from "./landing/AnimatedButtons";
import AnimatedGradient from "./landing/AnimatedGradient";
import AnimatedHeader from "./landing/AnimatedHeader";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-gray-900 dark:to-gray-950">
      <AnimatedGradient />

      <main className="flex flex-grow items-center justify-center">
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <AnimatedHeader />
          <AnimatedButtons />
        </div>
      </main>

      <footer className="relative z-20 py-4 text-center text-sm text-gray-200 dark:text-gray-400">
        <p>© 2025 JobTrack. All rights reserved.</p>
        <Link
          href="/privacy"
          className="relative z-20 mt-2 block hover:underline"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
