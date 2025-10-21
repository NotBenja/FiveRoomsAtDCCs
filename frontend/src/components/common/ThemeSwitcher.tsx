// 'use client'; // uncomment this line if you're using Next.js App Directory Setup

// components/ThemeSwitcher.tsx
import { useTheme } from "@heroui/use-theme";
import { Button } from "@heroui/react";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div>
            The current theme is: {theme}
            <Button onPress={() => setTheme('light')}>Light Mode</Button>
            <Button onPress={() => setTheme('dark')}>Dark Mode</Button>
        </div>
    )
};