"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

import { sql } from "@/app/lib/server/db";
import config from "@/app/lib/server/config";

const SignUpSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export type SignUpFormState = {
  errors?: {
    username?: string[];
    password?: string[];
    confirmPassword?: string[];
  };

  message?: string | null;
};

export async function signup(prevState: SignUpFormState, formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Sign error",
    };
  }

  const username = formData.get("username");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    return {
      errors: {
        confirmPassword: ["Password and Confirm Password must match"],
      },
      message: "Sign up error",
    };
  }

  const userRes = await sql("select * from users where username = $1", [
    username,
  ]);

  // user already exists
  if (userRes.rowCount && userRes.rowCount > 0) {
    return {
      errors: {
        username: ["Username already exists"],
      },
      message: "Sign up error",
    };
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password?.toString()!, saltRounds);

  const insertRes = await sql(
    "insert into users (username, password) values ($1, $2) returning *",
    [username, hash]
  );

  // happy - generate JWT & cookie
  if (insertRes.rowCount === 1) {
    const user = insertRes.rows[0];
    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("2w")
      .sign(new TextEncoder().encode(config.JWT_SECRET));

    // set expiration on the cookie
    const oneDay = 24 * 60 * 60 * 1000;
    const twoWeeks = 14 * oneDay;

    cookies().set("token", token, {
      sameSite: "strict",
      httpOnly: true,
      secure: true,
      expires: Date.now() + twoWeeks,
    });

    redirect("/dashboard");
  }

  // totally unexpected
  return {
    message: "Unexpected error",
  };
}
