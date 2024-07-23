import { SignUp, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex-col items-center justify-center px-4 lg:flex">
        <div className="space-y-4 pt-16 text-center">
          <h1 className="text-3xl font-bold text-[#2E2A47]">Welcome Back</h1>
          <p className="text-base text-[#7E83A0]">
            Login or Create account to get back to your dashboard!
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center">
          <ClerkLoaded>
            <Link
              className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
              href="/sign-in"
            >
              SignIn as Guest
            </Link>
            <p className="mb-2 text-gray-600">(or)</p>
            <SignUp path="/sign-up" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="hidden h-full items-center justify-center bg-blue-600 lg:flex">
        <Image src="/logo.svg" height={100} width={100} alt="logo" />
      </div>
    </div>
  );
};

export default SignUpPage;
