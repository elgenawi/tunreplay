import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "";
const DIRECTUS_API_KEY = process.env.DIRECTUS_API_KEY || "";
const FOLDER_ID = "d2283b71-d0dd-4771-a2fc-893549acc21c";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { url } = body;
      if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }

      const importRes = await fetch(`${DIRECTUS_URL}/files/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DIRECTUS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          data: { folder: FOLDER_ID },
        }),
      });

      if (!importRes.ok) {
        const errText = await importRes.text();
        console.error("Directus import error:", errText);
        return NextResponse.json({ error: "Failed to import from URL" }, { status: 500 });
      }

      const result = await importRes.json();
      const fileId = result.data?.id;
      const imageUrl = `${DIRECTUS_URL}/assets/${fileId}`;
      return NextResponse.json({ success: true, id: fileId, url: imageUrl });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const directusForm = new FormData();
    directusForm.append("folder", FOLDER_ID);
    directusForm.append("file", file, file.name);

    const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_API_KEY}`,
      },
      body: directusForm,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Directus upload error:", errText);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    const result = await uploadRes.json();
    const fileId = result.data?.id;
    const imageUrl = `${DIRECTUS_URL}/assets/${fileId}`;
    return NextResponse.json({ success: true, id: fileId, url: imageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
