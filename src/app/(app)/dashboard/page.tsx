"use client";

import { useDispatch, useSelector } from "react-redux";
import DashboardFiles from "./components/DashboardFiles";
import UploadButton from "./components/UploadButton";
import { useEffect, useState } from "react";
import { IFile } from "@/models/fileModel";
import { setLoading } from "@/store/features/loadingSlice";
import axios from "axios";

function dashboardPage() {
    const dispatch = useDispatch();

    const [files, setFiles] = useState<IFile[]>([]);
    const [fetched, setFetched] = useState(false);
    useEffect(() => {
        async function getUserFiles() {
            dispatch(setLoading(true));
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
        if (!fetched) getUserFiles();
    }, [files.length, fetched]);
    return (
        <main className="mx-auto max-w-7xl md:p-10 p-5">
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl text-gray-900">
                    My Files
                </h1>
                <UploadButton isSubscribed={true} setFetched={setFetched} />
            </div>
            <DashboardFiles files={files} fetched={fetched} />
        </main>
    );
}

export default dashboardPage;
