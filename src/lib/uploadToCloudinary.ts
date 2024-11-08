import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "naresh-cloud",
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

interface CloudinaryResult {
    public_id: string;
    bytes: number;
    url: string;
    secure_url: string;
}

export default async function uploadToCloudinary(fileBuffer: Buffer) {
    try {
        const result = await new Promise((resolve) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: "auto", folder: "BookBot" },
                    (error, result) => {
                        if (error) {
                            console.error(
                                "Error uploading file to Cloudinary:",
                                error
                            );
                            resolve(null);
                        } else {
                            resolve(result);
                        }
                    }
                )
                .end(fileBuffer);
        });
        return result as CloudinaryResult;
    } catch (error: any) {
        console.error("Error uploading file to Cloudinary:", error.message);
        return null;
    }
}
