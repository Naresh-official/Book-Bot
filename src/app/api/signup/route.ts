import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        dbConnect();
        const existingUser: IUser | null = await User.findOne({ email });
        if (existingUser) {
            return new NextResponse("User already exists", { status: 400 });
        }
        const user: IUser | null = await User.create({ name, email, password });
        if (!user) {
            return new NextResponse("Error creating user", { status: 500 });
        }
        const displayUser = user?.toObject();
        delete displayUser.password;
        delete displayUser.__v;
        return NextResponse.json(displayUser, { status: 201 });
    } catch (error: any) {
        console.error("Error during sign-up:", error);
        return new NextResponse("Error during sign-up", { status: 500 });
    }
}
