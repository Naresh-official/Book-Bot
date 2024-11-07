"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            signIn("credentials", {
                ...formData,
                redirect: false,
            }).then((res) => {
                if (res?.error) {
                    toast({
                        title: "Error",
                        description: res.error,
                        variant: "destructive",
                    });
                }
                if (res?.ok && !res?.error) {
                    toast({
                        title: "Success",
                        description: "Login successful",
                        variant: "success",
                    });
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1000);
                }
            });
        } catch (error: any) {
            console.log(error);
            toast({
                title: "Error",
                description:
                    error.response.data ||
                    error.message ||
                    "Something went wrong",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-background">
            <Card className="w-[450px] border-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground">
                        Login
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="loginForm" onSubmit={handleLogin}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label
                                    htmlFor="email"
                                    className="text-foreground"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                    autoFocus
                                    placeholder="Enter your email"
                                    className="border-border"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label
                                    htmlFor="password"
                                    className="text-foreground"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                    placeholder="Enter your password"
                                    className="border-border"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        form="loginForm"
                        type="submit"
                        className="w-full bg-primary text-[hsl(210,40%,98%)] hover:bg-[hsl(221.2,83.2%,43.3%)]"
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() =>
                            signIn("google", { callbackUrl: "/dashboard" })
                        }
                        variant="outline"
                        className="w-full border-border text-foreground"
                    >
                        <FcGoogle />
                        Continue with Google
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
