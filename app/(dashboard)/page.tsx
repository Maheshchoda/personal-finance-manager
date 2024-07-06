"use client";

import { Button } from "@/components/ui/button";
import useSheet from "@/components/hooks/useSheet";

export default function Home() {
  const { onOpen } = useSheet();
  return <Button onClick={onOpen}>New Account</Button>;
}
