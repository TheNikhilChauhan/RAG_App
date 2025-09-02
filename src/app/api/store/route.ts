import { QDRANT_COLLECTION, qdrantClient } from "@/lib/qdrant";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await qdrantClient.scroll(QDRANT_COLLECTION, { limit: 50 });
    return NextResponse.json({ points: res.points || [] });
  } catch (e: any) {
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
