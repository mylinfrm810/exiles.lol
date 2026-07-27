import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { username, bio, background, accentColor, links } = body;

    if (username) {
      // Validate username
      if (!/^[a-z0-9_-]{3,20}$/.test(username)) {
        return NextResponse.json(
          { error: "Username must be 3-20 characters (a-z, 0-9, _, -)" },
          { status: 400 }
        );
      }

      // Check if taken by someone else
      const existing = await prisma.user.findUnique({
        where: { username },
      });

      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: username || null,
        bio: bio || null,
        background: background || null,
        accentColor: accentColor || "#8b5cf6",
        links: JSON.stringify(links || []),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
