import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const SignInPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col justify-center items-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome Back</h1>
          <p className="text-base text-[#7E83A0]">
            Login or Create account to get back to your dashboard!
          </p>
        </div>
        <div className="flex justify-center items-center mt-8">
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-blue-600 hidden lg:flex justify-center items-center">
        <Image src="/logo.svg" height={100} width={100} alt="logo" />
      </div>
    </div>
  );
};

export default SignInPage;
