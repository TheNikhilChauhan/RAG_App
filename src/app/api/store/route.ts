import { QDRANT_COLLECTION, qdrantClient } from "@/lib/qdrant";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await qdrantClient.scroll(QDRANT_COLLECTION, { limit: 50 });
    return NextResponse.json({ points: res.points || [] });
  } catch (e: any) {
    console.error("/api/store GET error", e);

    if (e.message.includes("Not Found")) {
      await qdrantClient.createCollection(QDRANT_COLLECTION, {
        vectors: { size: 3072, distance: "Cosine" }, // 3072 = text-embedding-3-large
      });
      return NextResponse.json({ points: [] });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await qdrantClient.deleteCollection(QDRANT_COLLECTION);

    //recreate empty collection
    await qdrantClient.createCollection(QDRANT_COLLECTION, {
      vectors: { size: 1536, distance: "Cosine" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || String(e) },
      { status: 500 }
    );
  }
}
