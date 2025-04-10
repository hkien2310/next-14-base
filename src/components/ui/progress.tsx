import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    text?: string | React.ReactNode;
    total?: number;
  }
>(({ text, className, value, total, ...props }, ref) => {
  const [progress, setProgress] = React.useState(0);

  //* If total defined -> please put raw value + raw total to props
  React.useEffect(() => {
    if (total) {
      const timer = setTimeout(
        () => setProgress(((value || 0) / total) * 100),
        200
      );

      return () => clearTimeout(timer);
    }
  }, [total, value]);

  const quickCalcProgress = ((value || 0) / (total || 0)) * 100;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="ease relative h-full w-full flex-1 bg-primary transition-all duration-1000"
        style={{
          transform: `translateX(-${100 - (total ? progress : value || 0)}%)`,
        }}
      >
        {text && (
          <span
            className={cn(
              "absolute  right-[6px] top-[50%] z-20 translate-y-[-50%] text-[12px] font-normal text-white",
              quickCalcProgress < 20 && "right-[-38px] text-black"
            )}
          >
            {text}
          </span>
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
