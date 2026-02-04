import React, { useEffect, useRef } from "react";

//Do I need to use the selectors?
function getFocusableElements(containerElement) {
  if (!containerElement) return [];
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(containerElement.querySelectorAll(selectors.join(",")));
}

/**
 * Purpose: Accessible modal overlay.
 * Functionality: Focus trap, ESC to close, backdrop click to close.
 */
function Modal({ isOpen, title, onClose, children }) {
  const dialogRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElementRef.current = document.activeElement;

    const focusableElements = getFocusableElements(dialogRef.current);
    const elementToFocus = focusableElements[0] || dialogRef.current;
    elementToFocus?.focus?.();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = getFocusableElements(dialogRef.current);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastActiveElementRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
