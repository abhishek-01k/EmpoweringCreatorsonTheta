"use client"
import React from 'react';
import { Button } from './ui/button';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react"
import Link from 'next/link';
import { cn } from '@/lib/utils';


const Navbar = () => {
    const { setTheme, theme } = useTheme()

    const siteconfig = {
        name: "Next.js",
        description:
            "Beautifully designed components built with Radix UI and Tailwind CSS.",
        mainNav: [
            {
                title: "Home",
                href: "/",
            },
        ],
        links: {
            twitter: "https://twitter.com/shadcn",
            github: "https://github.com/shadcn/ui",
            docs: "https://ui.shadcn.com",
        },
    }

    const items = [
        {
            title: "Home",
            href: "/",
        }, {
            title: 'Video List',
            href: "/listvideos"
        }
    ];

    return (
        <div className='flex justify-between pb-8'>

            <div className="flex gap-6 md:gap-10">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="inline-block font-bold">VideoCut</span>
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
                                            "flex items-center text-sm font-medium text-muted-foreground",
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                )
                        )}
                    </nav>
                ) : null}
            </div>


            <div className='flex justify-end'>
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