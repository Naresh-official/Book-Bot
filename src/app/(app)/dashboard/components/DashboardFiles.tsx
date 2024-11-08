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
import Link from "next/link";

export default function DashboardFiles({
    files,
    fetched,
}: {
    files: IFile[];
    fetched: boolean;
}) {
    const loading = useSelector((state: any) => state.loading.loading);
    const getTimeDiff = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        if (years > 0) {
            return `${years} ${years > 1 ? "years" : "year"} ago`;
        }
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        if (months > 0) {
            return `${months} ${months > 1 ? "months" : "month"} ago`;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0) {
            return `${days} ${days > 1 ? "days" : "day"} ago`;
        }
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        if (hours > 0) {
            return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
        }
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        if (minutes > 0) {
            return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
        }
        const seconds = Math.floor((diff / 1000) % 60);
        return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
    };

    return (
        <>
            {files && files.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {files.map((file: IFile) => (
                        <Link key={file._id} href={`/file/${file._id}`}>
                            <Card className="border-2 shadow-md md:hover:scale-[1.005] md:hover:shadow-xl transition-shadow duration-200">
                                <CardHeader>
                                    <CardTitle>{file.name}</CardTitle>
                                    <CardDescription>
                                        {getTimeDiff(new Date(file.createdAt))}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
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
