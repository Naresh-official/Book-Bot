import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/userModel";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                dbConnect();
                const user: IUser | null = await User.findOne({
                    email: credentials.email,
                }).select("+password");
                if (!user) {
                    throw new Error("User not found");
                }
                if (!(await user.matchPassword(credentials.password))) {
                    throw new Error("Email and password do not match");
                }
                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    dbConnect();
                    const exitstUser: IUser | null = await User.findOne({
                        email: user.email,
                    });
                    if (!exitstUser) {
                        await User.create({
                            email: user.email,
                            name: user.name,
                            loggedInWithGoogle: true,
                        });
                    }
                } catch (error: any) {
                    console.error("Error during sign-in:", error);
                    return false;
                }
            }
            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
};
