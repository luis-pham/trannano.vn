import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function zodError(error: ZodError) {
  return NextResponse.json(
    {
      error: "Dữ liệu không hợp lệ",
      details: error.flatten().fieldErrors,
    },
    { status: 400 }
  );
}

export function nullIfEmpty(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null || value.trim() === "") return null;
  return value;
}
