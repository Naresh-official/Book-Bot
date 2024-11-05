"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { redirect } from "next/navigation";

function dashboardPage() {
    const { data: session, status } = useSession();

    if (status !== "loading" && !session) {
        return redirect("/api/auth/signin");
    }
    return <div>{session?.user?.name}</div>;
}

export default dashboardPage;
