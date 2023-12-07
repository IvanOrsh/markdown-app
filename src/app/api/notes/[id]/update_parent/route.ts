import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/app/lib/server/auth";
import { sql } from "@/app/lib/server/db";

const UpdateParentSchema = z.object({
  parent_id: z.string().uuid(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  const { id } = params;
  const body = await request.json();
  const validateFields = UpdateParentSchema.safeParse(body);

  if (!validateFields.success) {
    return NextResponse.json(
      {
        errors: validateFields.error.flatten().fieldErrors,
        message: "update parent bad request",
      },
      {
        status: 400,
      }
    );
  }

  const res = await sql(
    "select * from notes where user_id = $1 and id in ($2, $3)",
    [user.id, id, validateFields.data.parent_id]
  );

  if (res.rowCount !== 2) {
    return NextResponse.json(
      {
        message: "unauthorized",
      },
      {
        status: 400,
      }
    );
  }

  await sql("update notes set parent_id = $1 where id = $2", [
    validateFields.data.parent_id,
    id,
  ]);

  return NextResponse.json({
    message: "update parent success",
  });
}
