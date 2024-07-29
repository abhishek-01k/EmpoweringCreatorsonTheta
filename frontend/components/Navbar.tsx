"use client";
import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ThetaMainnet } from "@/constants/Chains/ThetaMainnet";
import { sepolia } from "thirdweb/chains";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { setTheme, theme } = useTheme();
  const items = [
    {
      title: "Video List",
      href: "/listvideos",
    },
    {
      title: "Upload",
      href: "/upload",
    },
  ];

  const client = createThirdwebClient({
    clientId: "f71177f93907409fbad88c670442fbb8",
  });

  return (
    <div className="flex justify-between p-8">
      <div className="flex gap-6 md:gap-10">
        <Link href="/" className="flex items-center space-x-2">
          <h2 className="text-4xl font-semibold tracking-tight">VideoCut</h2>
        </Link>
        {items?.length ? (
          <nav className="flex gap-6">
            {items?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </nav>
        ) : null}
      </div>

      <div className="flex justify-end gap-8 items-center">
        <div>
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
            chain={ThetaTestnet}
            chains={[ThetaMainnet, ThetaTestnet, sepolia]}
          />
        </div>

        <div>
          <Link href="/profile">
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
          <Moon className="hidden h-5 w-5 dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
