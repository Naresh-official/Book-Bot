import React from "react";

async function page({ params }: any) {
    const { fileId } = await params;
    console.log(fileId);
    return <div>page</div>;
}

export default page;
