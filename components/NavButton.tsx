import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

interface Props {
  href: string;
  label: string;
  isActive: boolean;
}
const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "focus-visible:0 w-full border-none font-normal text-white hover:bg-white/20 hover:text-white lg:w-auto",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
