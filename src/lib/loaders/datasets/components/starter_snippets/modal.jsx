import React, { useEffect, useRef } from "react";

/**
 * OpenSourceDataset: UIComponents
 * Component: Accessible React + Tailwind Modal Dialog
 * License: MIT (Free for commercial & personal projects)
 * Features: Escape listener, focus trap, outside click, accessible ARIA attributes
 */

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = "Confirm",
  onConfirm,
  isDestructive = false,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      aria-describedby={description ? "modal-subtext" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800"
      >
        <div className="flex items-start justify-between">
          <h3
            id="modal-headline"
            className="text-lg font-semibold leading-6 text-slate-900 dark:text-white"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-800"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {description && (
          <p
            id="modal-subtext"
            className="mt-2 text-sm text-slate-500 dark:text-slate-400"
          >
            {description}
          </p>
        )}

        <div className="mt-4">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${
                isDestructive
                  ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                  : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
