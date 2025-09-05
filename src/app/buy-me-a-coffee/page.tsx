import { Coffee } from "lucide-react";
import Link from "next/link";

export default function BuyMeACoffeePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="bg-card w-full rounded-lg p-6 text-center shadow-xl md:max-w-1/2 md:p-10">
        <Coffee className="mx-auto mb-6 size-20 text-yellow-500 dark:text-yellow-400" />
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Support My Work!
        </h1>
        <p className="mb-8 text-lg text-gray-700 md:text-xl dark:text-gray-300">
          If you find JobTrack useful, consider buying me a coffee! Your support
          helps me continue developing and improving this application.
        </p>
        <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
          I understand that the job market can be tough, and I don&apos;t want
          to take money from people in a situation like mine. It feels like
          greed and exploitation. So, please know that any donation is entirely
          your choice, and you are welcome to contribute as little as you want.
          Your support, in any form, is greatly appreciated!
        </p>
        <Link
          href="https://buymeacoffee.com/fredi1574"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-8 py-3 text-lg font-semibold text-gray-900 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 focus:outline-none dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-700"
        >
          <Coffee className="mr-3 size-6" />
          Buy Me A Coffee!
        </Link>
      </div>
    </div>
  );
}
