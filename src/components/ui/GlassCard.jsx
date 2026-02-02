import { cn } from "../../lib/utils";

export function GlassCard({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
