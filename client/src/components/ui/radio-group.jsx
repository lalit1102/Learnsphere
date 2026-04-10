import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * RadioGroup: A high-fidelity, accessible input component for single-option selection.
 * Orchestrates a set of mutually exclusive choices with premium visual feedback.
 */
function RadioGroup({
  className,
  ...props
}) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3 font-geist", className)}
      {...props}
    />
  );
}

/**
 * RadioGroupItem: An individual radio button component within a group.
 * Features advanced transition logic and high-contrast indicators.
 */
function RadioGroupItem({
  className,
  ...props
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer group/radio relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-input transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-2.5">
        <CircleIcon className="fill-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem }
