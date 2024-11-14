"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Avvvatars from "avvvatars-react";
import { SearchBar } from "./search-box";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

function FilmetryxLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="120" viewBox="0 0 130.51 24.238">
      <text xmlSpace="preserve" x="-26.765" y="348.928" fill="#ffffff" strokeWidth="2.072" fontFamily="Satoshi" fontSize="24.86" fontWeight="900" transform="translate(45.505 -330.66)">
        <tspan x="-26.765" y="348.928" fontFamily="Manrope" fontWeight="bold">
          Filmetryx
        </tspan>
      </text>
      <path
        fill="#82c4ff"
        d="M.003 12.16c.058-.1.323-.456 4.866-6.544C6.366 3.61 7.713 1.8 7.862 1.595 8.236 1.08 8.773.594 9.19.392c.736-.355.943-.375 3.942-.376 1.55 0 2.819.02 2.819.044 0 .055-1.119 1.566-6.373 8.614-1.087 1.458-2.056 2.685-2.23 2.822a5 5 0 0 1-.807.479l-.502.237-3.046.022c-2.486.018-3.037.005-2.991-.074"
      ></path>
      <path
        fill="#82c4ff"
        d="M7.661 17.26c-.002-2.514.028-4.41.074-4.735.203-1.44 1.32-2.612 2.725-2.861.51-.09 6.043-.134 6.043-.048 0 .035-.262.416-.583.847a3144 3144 0 0 0-6.666 9c-1.063 1.445-1.485 1.99-1.537 1.99-.03 0-.054-1.887-.056-4.193"
      ></path>
    </svg>
  );
}

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
    toast.success("Logout Successfully", {
      position: "bottom-center",
    });
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8">
            <Avvvatars value={session?.user?.name || ""} style="shape" size={32} />
          </div>
          <span className="font-medium">{session?.user?.name}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const LoginButton = () => (
    <Link href="/login">
      <Button variant="outline">
        <UserCircle className="mr-2 h-4 w-4" />
        Login with TMDB
      </Button>
    </Link>
  );

  if (status === "loading") {
    return (
      <nav className={`sticky top-0 bg-[#0D0A12]/90 backdrop-blur-sm z-20 py-3`}>
        <div className="container">
          <div className="mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <Link href="/">
                <FilmetryxLogo />
              </Link>
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar />
            </div>
            <div className="hidden sm:flex items-center gap-6">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`sticky top-0 bg-[#0D0A12]/90 backdrop-blur-sm z-20 py-3 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="container">
        <div className="mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link href="/">
              <FilmetryxLogo />
            </Link>
            <div className="sm:hidden">{session ? <UserMenu /> : <LoginButton />}</div>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <SearchBar />
          </div>

          <div className="hidden sm:flex items-center gap-6">{session ? <UserMenu /> : <LoginButton />}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
