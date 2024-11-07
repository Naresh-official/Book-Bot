import dbConnect from "@/lib/dbConnect";
import File, { IFile } from "@/models/fileModel";
import User, { IUser } from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        dbConnect();
        const { name } = await request.json();
        const session = await getServerSession();
        const user: IUser | null = await User.findOne({
            email: session?.user?.email,
        });
        const file: IFile | null = await File.create({
            ownerId: user?._id,
            name,
            path: "",
            key: "123",
        });
        return NextResponse.json(file, { status: 201 });
    } catch (error: any) {
        console.error("Error during file upload:", error.message);
        return new NextResponse("Error during file upload", { status: 500 });
    }
}
