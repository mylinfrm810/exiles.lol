"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";

type LinkItem = {
  title: string;
  url: string;
};

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  background: string | null;
  accentColor: string;
  links: LinkItem[];
};

export default function DashboardClient({ user }: { user: UserData }) {
  const router = useRouter();
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [background, setBackground] = useState(user.background || "");
  const [accentColor, setAccentColor] = useState(user.accentColor);
  const [links, setLinks] = useState<LinkItem[]>(user.links || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const addLink = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const updateLink = (index: number, field: "title" | "url", value: string) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          bio,
          background,
          accentColor,
          links: links.filter((l) => l.title && l.url),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to save");
      } else {
        setMessage("Saved successfully!");
        router.refresh();
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            exiles.lol
          </Link>
          <div className="flex items-center gap-4">
            {username && (
              <Link
                href={`/${username}`}
                target="_blank"
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                View profile →
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Profile preview */}
        <div className="mb-8 p-6 rounded-2xl bg-card border border-zinc-800 flex items-center gap-4">
          {user.image && (
            <img
              src={user.image}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-500/50"
            />
          )}
          <div>
            <p className="font-medium">{user.name || "User"}</p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-sm">exiles.lol/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="yourname"
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Background Image URL
            </label>
            <input
              type="url"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-10 rounded-lg cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:outline-none transition w-32"
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-zinc-300">Links</label>
              <button
                onClick={addLink}
                className="text-sm text-violet-400 hover:text-violet-300 transition"
              >
                + Add link
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(i, "title", e.target.value)}
                    placeholder="Title"
                    className="w-1/3 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:outline-none transition text-sm"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(i, "url", e.target.value)}
                    placeholder="https://"
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:outline-none transition text-sm"
                  />
                  <button
                    onClick={() => removeLink(i)}
                    className="px-3 text-zinc-500 hover:text-red-400 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-sm text-zinc-500">No links yet. Add some!</p>
              )}
            </div>
          </div>

          {/* Save */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium transition-all shadow-glow"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {message && (
              <p
                className={`mt-3 text-sm text-center ${
                  message.includes("success") ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
