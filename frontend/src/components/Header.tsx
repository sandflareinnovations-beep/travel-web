"use client";

import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Flyinco"
                        className="h-8 w-auto object-contain"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
