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
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/store/features/loadingSlice";

export default function SignupPage() {
    const { toast } = useToast();
    const router = useRouter();
    const loading = useSelector((state: any) => state.loading.loading);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            dispatch(setLoading(true));
            const { data } = await axios.post("/api/signup", formData);
            toast({
                title: "Success",
                description: "Account created successfully, please login",
                variant: "success",
            });
            setTimeout(() => {
                dispatch(setLoading(false));
                router.push("/login");
            }, 500);
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
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-background">
            <Card className="w-[450px] border-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="signup" onSubmit={handleSignup}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label
                                    htmlFor="name"
                                    className="text-foreground"
                                >
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    autoFocus
                                    disabled={loading}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                    className="border-border"
                                />
                            </div>
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
                                    disabled={loading}
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    required
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
                                    placeholder="Create a password"
                                    className="border-border"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        form="signup"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground disabled:pointer-events-none disabled:opacity-50 hover:bg-[hsl(221.2,83.2%,43.3%)]"
                    >
                        Sign Up
                    </Button>
                    <Button
                        onClick={() =>
                            signIn("google", { callbackUrl: "/dashboard" })
                        }
                        disabled={loading}
                        variant="outline"
                        className="w-full border-border text-foreground"
                    >
                        <FcGoogle />
                        Continue with Google
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        {!loading && (
                            <Link
                                href="/login"
                                className="text-primary hover:underline"
                            >
                                Log in
                            </Link>
                        )}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
