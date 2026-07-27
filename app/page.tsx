import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl animate-fade-in">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            exiles.lol
          </span>
        </h1>
        <p className="text-zinc-400 text-lg sm:text-xl mb-10 max-w-md mx-auto">
          Create a beautiful, customizable link-in-bio page in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-glow hover:shadow-glow-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-glow hover:shadow-glow-lg"
            >
              Get Started
            </Link>
          )}
          <a
            href="#features"
            className="px-8 py-3.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium transition-all"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* Features section */}
      <section id="features" className="relative z-10 mt-32 w-full max-w-4xl px-4 pb-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Fully Customizable",
              desc: "Avatar, background, colors, links — make it yours.",
            },
            {
              title: "Discord & Google Login",
              desc: "Sign in instantly with your favorite accounts.",
            },
            {
              title: "Fast & Clean",
              desc: "No ads, no clutter. Just a beautiful profile.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-card/60 border border-zinc-800/80 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
