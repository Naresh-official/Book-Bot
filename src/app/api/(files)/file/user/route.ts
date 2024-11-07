import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User, { IUser } from "@/models/userModel";
import File, { IFile } from "@/models/fileModel";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
    try {
        dbConnect();
        const session = await getServerSession();
        const user: IUser | null = await User.findOne({
            email: session?.user?.email,
        });
        const files: IFile[] | null = await File.find({ ownerId: user?._id });
        if (files.length === 0) {
            return new NextResponse("No files found", { status: 404 });
        }
        return NextResponse.json(files, { status: 200 });
    } catch (error: any) {
        console.error("Error during file upload:", error.message);
        return new NextResponse("Error during file upload", { status: 500 });
    }
}
