"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-lg"
            >
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500 transition-all" />
            ) : (
                <Moon className="h-4 w-4 text-indigo-600 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
