import { useEffect } from "react";
import "../../styles/common/detailsDrawer.css";

export default function DetailsDrawer({
    open,
    title,
    onClose,
    children,
}) {

    // Close on ESC key
    useEffect(() => {

        const handleKeyDown = (event) => {

            if (event.key === "Escape") {
                onClose();
            }

        };

        if (open) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [open, onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`drawer-overlay ${open ? "show" : ""}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                className={`details-drawer ${open ? "open" : ""}`}
            >
                <div className="drawer-header">

                    <h2>{title}</h2>

                    <button
                        className="drawer-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="drawer-content">

                    {children}

                </div>

            </aside>
        </>
    );
}