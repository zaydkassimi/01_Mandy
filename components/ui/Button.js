import React from "react";
import clsx from "clsx";

export default function Button({ as: Component = "button", children, variant = "default", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none";
  const variants = {
    default: "bg-brand-500 text-white px-4 py-2 hover:brightness-95",
    secondary: "bg-gray-100 text-gray-800 px-3 py-2",
    ghost: "bg-transparent text-gray-700 px-2 py-1"
  };
  const cls = clsx(base, variants[variant] || variants.default, className);
  return (
    <Component className={cls} {...props}>
      {children}
    </Component>
  );
}


