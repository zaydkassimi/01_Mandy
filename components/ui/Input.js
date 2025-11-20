import React from "react";

export default function Input(props) {
  return (
    <input
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-300"
      {...props}
    />
  );
}


