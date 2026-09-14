import { Button } from "@/components/ui/button";
import { Sun, Moon, Info } from "lucide-react";
import { useEffect } from "react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  onHowToPlay: () => void;
}

export function Header({ darkMode, setDarkMode, onHowToPlay }: HeaderProps) {
  // Handle theme change and persistence
  useEffect(() => {
    // Apply theme class to document element
    document.documentElement.classList.toggle("dark", darkMode);

    // Save preference to localStorage
    localStorage.setItem("memory-theme", darkMode ? "dark" : "light");

    // For better SSR support, you might want to add this as well:
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  // Initialize theme from localStorage or user preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("memory-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Use saved theme if exists, otherwise use system preference
    const initialTheme = savedTheme ? savedTheme === "dark" : prefersDark;

    setDarkMode(initialTheme);
  }, [setDarkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="md:container sticky top-0 z-50 px-4 w-full">
      <div className="flex items-center justify-between mt-3 p-3 bg-background/50 backdrop-blur-lg border rounded-md w-full">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="size-8" />
          <h1 className="text-xl sm:text-3xl font-medium">Recall <span className="text-yellow-400">Card</span></h1>
        </a>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHowToPlay}
            aria-label="How to play"
            className="p-4 md:p-6 rounded-md hover:bg-accent"
          >
            <Info className="size-4 sm:size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className="p-4 md:p-6 rounded-md hover:bg-accent"
          >
            {darkMode ? (
              <Sun className="size-4 sm:size-5" />
            ) : (
              <Moon className="size-4 sm:size-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
