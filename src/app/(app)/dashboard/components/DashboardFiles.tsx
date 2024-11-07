"use client";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IFile } from "@/models/fileModel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/store/features/loadingSlice";
import { Ghost } from "lucide-react";

export default function DashboardFiles() {
    const loading = useSelector((state: any) => state.loading.loading);
    const dispatch = useDispatch();

    const [files, setFiles] = useState<IFile[]>([]);
    const [fetched, setFetched] = useState(false);
    useEffect(() => {
        dispatch(setLoading(true));
        async function getUserFiles() {
            try {
                const { data } = await axios.get("/api/file/user");
                setFiles(data);
            } catch (error: any) {
                console.log(error?.message);
            } finally {
                dispatch(setLoading(false));
                setFetched(true);
            }
        }
        getUserFiles();
    }, []);
    return (
        <>
            {files && files.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {files.map((file) => (
                        <Card key={file._id} className="border-2 shadow-lg">
                            <CardHeader>
                                <CardTitle>{file.name}</CardTitle>
                                <CardDescription>Description</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : loading || !fetched ? (
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-24 w-full border-2 shadow-sm bg-zinc-200"
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-16 flex flex-col items-center gap-2">
                    <Ghost className="h-20 w-20 text-zinc-800" />
                    <h3 className="font-semibold text-2xl">
                        Pretty empty around here
                    </h3>
                    <p>Let&apos;s upload your first PDF.</p>
                </div>
            )}
        </>
    );
}
