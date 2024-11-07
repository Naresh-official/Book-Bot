"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Upload, FileIcon } from "lucide-react";

export default function UploadButton({
    isSubscribed = false,
}: {
    isSubscribed?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError("Please select a valid PDF file.");
        }
        // Reset file input to allow re-selection of the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    };

    const handleUpload = () => {
        if (file) {
            // Implement your upload logic here
            console.log("Uploading file:", file.name);
            // Reset the state after upload
            setFile(null);
            setIsOpen(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => {
                if (!v) {
                    setIsOpen(v);
                    setFile(null);
                    setError(null);
                }
            }}
        >
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Upload PDF</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Upload PDF</DialogTitle>
                <div
                    className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    aria-label="Click or drag and drop to upload a PDF file"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) =>
                            handleFileChange(e.target.files?.[0] || null)
                        }
                        accept=".pdf"
                        className="hidden"
                        aria-hidden="true"
                    />
                    {file ? (
                        <div className="flex items-center justify-center space-x-10">
                            <FileIcon className="h-8 w-8 text-blue-500" />
                            <span className="text-sm font-medium">
                                {file.name}
                            </span>
                            <X
                                className="ml-2 h-6 w-6 p-[2px] rounded-full cursor-pointer text-gray-400 hover:bg-red-100 hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setError(null);
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                                Click to select or drag and drop a PDF file here
                            </p>
                        </>
                    )}
                </div>
                {error && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!file}>
                        Upload
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
