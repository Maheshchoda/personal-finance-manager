import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center gap-x-2 lg:flex">
        <Image src="/logo.svg" height={28} width={28} alt="logo" />
        <p className="text-2xl font-semibold text-white">Finance</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
