import AnimatedButtons from "./landing/AnimatedButtons";
import AnimatedGradient from "./landing/AnimatedGradient";
import AnimatedHeader from "./landing/AnimatedHeader";

export default function LandingPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300 px-4 py-16 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-950">
      <AnimatedGradient />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <AnimatedHeader />
        <AnimatedButtons />
      </div>
      <div className="absolute bottom-4 left-0 w-full text-center text-sm text-gray-200 dark:text-gray-400">
        © 2025 JobTrack. All rights reserved.
      </div>
    </section>
  );
}
