import { cn } from "../lib/utils";

export function Layout({ children, className }) {
    return (
        <div className={cn("min-h-screen w-full flex justify-center bg-transparent", className)}>
            <div className="w-full max-w-md h-full min-h-screen flex flex-col relative px-6 py-8">
                {children}
            </div>
        </div>
    );
}
