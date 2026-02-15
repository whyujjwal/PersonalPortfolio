import { NextRequest, NextResponse } from "next/server";
import { getViews, incrementViews, isViewStoreEnabled } from "@/lib/view-store";

export const dynamic = "force-dynamic";

function normalizeSlug(raw: string | null) {
  if (!raw) {
    return null;
  }
  const slug = raw.trim();
  if (!slug) {
    return null;
  }
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return null;
  }
  return slug.toLowerCase();
}

export async function GET(request: NextRequest) {
  const slug = normalizeSlug(request.nextUrl.searchParams.get("slug"));
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const enabled = isViewStoreEnabled();
  const views = enabled ? await getViews(slug) : null;

  return NextResponse.json({
    slug,
    views,
    enabled,
  });
}

export async function POST(request: NextRequest) {
  const slug = normalizeSlug(request.nextUrl.searchParams.get("slug"));
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const enabled = isViewStoreEnabled();
  const views = enabled ? await incrementViews(slug) : null;

  return NextResponse.json({
    slug,
    views,
    enabled,
  });
}
