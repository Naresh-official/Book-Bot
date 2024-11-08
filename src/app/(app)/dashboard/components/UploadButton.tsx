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
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/store/features/loadingSlice";
import LoadingModal from "@/components/LoadingIcon";

export default function UploadButton({
    isSubscribed = false,
    setFetched,
}: {
    isSubscribed?: boolean;
    setFetched: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.loading.loading);

    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [progress, setProgress] = useState<number>(0);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.type === "application/pdf") {
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File size must be less than 10 MB");
                setFile(null);
                return;
            }
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
    const handleUpload = async () => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append("pdf", file);
                formData.append("name", file.name.split(".")[0]);
                const { data } = await axios.post(
                    "/api/file/create",
                    formData,
                    {
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                const percentCompleted = Math.round(
                                    (progressEvent.loaded * 100) /
                                        progressEvent?.total
                                );
                                setProgress(percentCompleted);
                                if (percentCompleted > 95) {
                                    dispatch(setLoading(true));
                                }
                            } else {
                                setProgress(0);
                            }
                        },
                    }
                );
                setProgress(0);
                setFile(null);
                setIsOpen(false);
                setFetched(false);
            } catch (error: any) {
                console.error("Error uploading file:", error);
                setError(
                    error.response.data ||
                        error.message ||
                        "Something went wrong"
                );
            } finally {
                dispatch(setLoading(false));
            }
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
                    <div className={`m-10 ${!loading ? "hidden" : ""}`}>
                        <LoadingModal />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) =>
                            handleFileChange(e.target.files?.[0] || null)
                        }
                        accept=".pdf"
                        disabled={loading}
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
                                className="ml-2 h-6 w-6 p-[2px] rounded-full cursor-pointer text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors duration-200"
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
                {progress > 0 && progress < 100 && (
                    <Progress value={progress} />
                )}
                {error && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="mt-4 flex justify-end space-x-2">
                    <Button
                        disabled={loading}
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || progress > 0 || loading}
                    >
                        Upload
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
