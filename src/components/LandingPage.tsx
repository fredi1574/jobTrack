import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Take Control of Your{" "}
            <span className="text-primary">Job Applications</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl">
            Streamline your search, organize your applications, and land your
            dream job. Your personal assistant for managing every step of your
            career journey.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="default"
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
              asChild
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent px-8 py-3 text-lg font-semibold"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
