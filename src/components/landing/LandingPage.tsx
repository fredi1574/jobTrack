import { Calendar, ChartArea, Target } from "lucide-react";
import Link from "next/link";
import { ElementType } from "react";
import AnimatedButtons from "./AnimatedButtons";
import AnimatedGradient from "./AnimatedGradient";
import AnimatedHeader from "./AnimatedHeader";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-gray-900 dark:to-gray-950">
      <AnimatedGradient />

      <main className="flex flex-grow flex-col items-center justify-center">
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <AnimatedHeader />
        </div>

        <div className="my-16 text-gray-800 dark:text-gray-200">
          <div className="mt-4 flex flex-wrap justify-center gap-8">
            <FeatureCard
              icon={Target}
              title="Track everything"
              description="Keep track of every job application, from the first contact to the final offer. Add notes, contacts, and salary information to have all the details in one place."
            />
            <FeatureCard
              icon={Calendar}
              title="Never miss a deadline"
              description="Get timely reminders for your upcoming interviews and deadlines."
            />
            <FeatureCard
              icon={ChartArea}
              title="Visualize your progress"
              description="Beautiful charts and statistics to visualize your job search journey."
            />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl text-center">
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

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-xs rounded-lg bg-white/30 p-6 shadow-lg backdrop-blur-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-800/30">
      <div className="flex justify-center">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}
