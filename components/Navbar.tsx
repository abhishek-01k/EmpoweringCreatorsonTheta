"use client"
import React from 'react';
import { Button } from './ui/button';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react"


const Navbar = () => {
    const { setTheme, theme } = useTheme()

    return (
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
    );
};

export default Navbar;