"use client";

type LinkItem = {
  title: string;
  url: string;
};

type ProfileUser = {
  name: string | null;
  image: string | null;
  username: string;
  bio: string | null;
  background: string | null;
  accentColor: string;
  links: LinkItem[];
};

export default function ProfileView({ user }: { user: ProfileUser }) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{
        background: user.background
          ? `url(${user.background}) center/cover no-repeat fixed`
          : undefined,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-30"
          style={{ backgroundColor: user.accentColor }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="rounded-3xl bg-card/80 border border-zinc-800/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-6">
            {user.image ? (
              <img
                src={user.image}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover mb-4 ring-4"
                style={{
                  // @ts-ignore
                  "--tw-ring-color": `${user.accentColor}80`,
                  boxShadow: `0 0 30px ${user.accentColor}40`,
                }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: `${user.accentColor}30` }}
              >
                {user.username[0].toUpperCase()}
              </div>
            )}

            <h1 className="text-2xl font-bold text-white mb-1">
              {user.name || user.username}
            </h1>
            <p className="text-sm text-zinc-400 mb-3">@{user.username}</p>

            {user.bio && (
              <p className="text-zinc-300 text-sm leading-relaxed max-w-xs">
                {user.bio}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {user.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 px-5 rounded-xl text-center font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: `${user.accentColor}20`,
                  border: `1px solid ${user.accentColor}40`,
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${user.accentColor}40`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${user.accentColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${user.accentColor}20`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-xs mt-6">
          Powered by{" "}
          <a href="/" className="hover:text-zinc-300 transition">
            exiles.lol
          </a>
        </p>
      </div>
    </main>
  );
}
