import React from "react";

export default function Toasts({ toasts = [] }) {
  return (
    <div aria-live="polite" className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:p-6">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((t) => (
          <div key={t.id} className="max-w-sm w-full bg-white border rounded-md shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 p-3">
            <div className="flex items-start gap-3">
              <div className="text-sm font-medium">{t.type === "error" ? "Error" : "Info"}</div>
              <div className="text-sm text-gray-700">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


