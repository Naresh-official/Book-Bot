import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";

function Navbar() {
    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href="/" className="flex z-40 font-semibold">
                        <span>Bookbot</span>
                    </Link>
                    <div className="hidden sm:flex items-center space-x-4">
                        <>
                            <Link
                                href="/pricing"
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "default",
                                })}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="login"
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "default",
                                })}
                            >
                                Login
                            </Link>
                            <Link
                                href="signup"
                                className={buttonVariants({
                                    variant: "default",
                                    size: "default",
                                })}
                            >
                                Get Started{" "}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
}

export default Navbar;
