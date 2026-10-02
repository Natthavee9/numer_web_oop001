import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default: "btn-primary",
  outline: "btn-outline",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  destructive: "btn-error",
  link: "btn-link",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "",
  xs: "btn-xs",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-square",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn("btn", variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}

export { Button };
