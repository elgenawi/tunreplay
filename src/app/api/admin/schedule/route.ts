import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getScheduleListForAdmin,
  insertScheduleRow,
  deleteScheduleRow,
} from "@/lib/queries";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const rows = await getScheduleListForAdmin();
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json();
  const { day, time, series_id } = body;
  if (!day || !time || !series_id) {
    return NextResponse.json(
      { error: "day, time and series_id are required" },
      { status: 400 }
    );
  }
  if (!DAYS.includes(day)) {
    return NextResponse.json(
      { error: "day must be one of: " + DAYS.join(", ") },
      { status: 400 }
    );
  }
  const timeStr = String(time).trim();
  if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)) {
    return NextResponse.json(
      { error: "time must be HH:mm or HH:mm:ss" },
      { status: 400 }
    );
  }
  const id = await insertScheduleRow(day, timeStr, Number(series_id));
  return NextResponse.json({ success: true, id });
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "id query parameter is required" },
      { status: 400 }
    );
  }
  await deleteScheduleRow(Number(id));
  return NextResponse.json({ success: true });
}
