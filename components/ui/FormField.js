import React from "react";

export default function FormField({ label, htmlFor, children, hint }) {
  return (
    <div className="grid gap-2">
      {label && <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">{label}</label>}
      <div>{children}</div>
      {hint && <div className="text-sm text-gray-500">{hint}</div>}
    </div>
  );
}


