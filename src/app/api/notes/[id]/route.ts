import { NextResponse } from "next/server";
import { z } from "zod";
import { DateTime } from "luxon";

import { getCurrentUser } from "@/app/lib/server/auth";
import { sql } from "@/app/lib/server/db";

const NoteSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  is_published: z.boolean().optional(),
});

const UpdateNoteSchema = NoteSchema.omit({ id: true, user_id: true }); // gonna get that from jwt

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const validateFields = UpdateNoteSchema.safeParse(body);

  if (!validateFields.success) {
    return NextResponse.json(
      {
        errors: validateFields.error.flatten().fieldErrors,
        message: "update note error",
      },
      {
        status: 400,
      }
    );
  }

  const { data } = validateFields;

  const user = await getCurrentUser();

  const userNoteRes = await sql(
    "select * from notes where id = $1 and user_id = $2",
    [id, user.id]
  );

  if (userNoteRes.rowCount === 0) {
    return NextResponse.json(
      {
        message: "unauthorized",
      },
      {
        status: 403,
      }
    );
  }

  const noteRes = await sql(
    "update notes set title = $1, content = $2, updated_at = $3, is_published = $4 where id = $5 returning *",
    [data.title, data.content, DateTime.now(), data.is_published, id]
  );

  return NextResponse.json(noteRes.rows[0]);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = await getCurrentUser();

  const userNoteRes = await sql(
    "select * from notes where id = $1 and user_id = $2",
    [id, user.id]
  );

  if (userNoteRes.rowCount === 0) {
    return NextResponse.json(
      {
        message: "Note not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(userNoteRes.rows[0]);
}
