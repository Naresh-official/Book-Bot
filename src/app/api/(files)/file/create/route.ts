import dbConnect from "@/lib/dbConnect";
import uploadToCloudinary from "@/lib/uploadToCloudinary";
import File, { IFile } from "@/models/fileModel";
import User, { IUser } from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession();
        const user: IUser | null = await User.findOne({
            email: session?.user?.email,
        });

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const pdf = formData.get("pdf") as File;
        const buffer = Buffer.from(await pdf.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer);
        if (!uploadResult) {
            return new NextResponse("Error uploading file", { status: 500 });
        }
        const file: IFile = await File.create({
            ownerId: user?._id,
            name,
            path: uploadResult.secure_url,
            key: uploadResult.public_id,
            uploadStatus: "success",
        });

        if (!file) {
            return new NextResponse("Error creating file", { status: 500 });
        }

        return NextResponse.json(file, { status: 201 });
    } catch (error: any) {
        console.error("Error during file upload:", error.message);
        return new NextResponse("Error during file upload", { status: 500 });
    }
}
