import { dbConnect } from "@/lib/dbconnection";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existUser = await User.findOne({ email });

    if (existUser) {
      return NextResponse.json(
        {
          error: "user already exist",
        },
        {
          status: 400,
        }
      );
    }

    await User.create({
      email,
      password,
    });
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 400 }
    );
  }
} 
