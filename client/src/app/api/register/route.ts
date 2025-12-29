import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, pin, captchaToken, ...userData } = body;

    const captchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const captchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captchaToken}`,
      { method: "POST" }
    );
    const captchaData = await captchaRes.json();

    if (!captchaData.success || captchaData.score < 0.5) {
      return NextResponse.json({ message: "Підозра на бота" }, { status: 403 });
    }

    await connectToDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Користувач з таким E-mail вже існує" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pin, salt);

    const newUser = new User({
        ...userData,
        email,
        passwordHash,
        role: "user",
    });

    await newUser.save();

    return NextResponse.json({message: "Реєстрація успішна"}, {status: 201});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
