import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
        "w-full border-none font-normal text-white outline-none transition hover:bg-white/20 hover:text-white lg:w-auto",
        isActive ? "bg-white/10" : "bg-transparent",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
