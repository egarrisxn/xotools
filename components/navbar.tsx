import { DateDisplay } from "@/components/date-display";
import { TimeDisplay } from "@/components/time-display";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex w-full flex-row items-center justify-between p-4">
      <div className="flex items-center text-2xl leading-none font-black tracking-tighter">
        xotools
      </div>
      <div className="flex items-center gap-4">
        <TimeDisplay />
        <DateDisplay />
        <ThemeToggle />
      </div>
    </nav>
  );
}
