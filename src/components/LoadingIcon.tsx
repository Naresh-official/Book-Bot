"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function LoadingModal() {
    const [show, setShow] = useState(false);
    const isLoading = useSelector((state: any) => state.loading.loading);

    useEffect(() => {
        if (isLoading) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [isLoading]);

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="fixed inset-0 bg-background/20 backdrop-blur-sm"
                aria-hidden="true"
            />
            <div className="relative z-50 flex items-center justify-center">
                <div className="bg-background flex flex-col items-center justify-center rounded-lg p-6 shadow-lg">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        Loading...
                    </p>
                </div>
            </div>
        </div>
    );
}
