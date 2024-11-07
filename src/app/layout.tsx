import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import AuthContextProvider from "@/context/authContext";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
    title: "BookBot",
    description: "BookBot: AI-Powered Insights for Books, Notes, and Learning",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthContextProvider>
                <body className={`${poppins.className} antialiased`}>
                    <main>
                        <Navbar />
                        {children}
                    </main>
                    <Toaster />
                </body>
            </AuthContextProvider>
        </html>
    );
}
