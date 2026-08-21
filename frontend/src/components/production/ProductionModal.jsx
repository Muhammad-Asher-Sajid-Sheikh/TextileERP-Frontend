import React from "react";
import "../../styles/production/productionModal.css";

const ProductionModal = ({
    isOpen,
    title,
    children,
    onClose,
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("production-modal-overlay")) {
            onClose();
        }
    };

    return (
        <div
            className="production-modal-overlay"
            onClick={handleOverlayClick}
        >
            <div className="production-modal">

                <div className="production-modal-header">

                    <h2>{title}</h2>

                    <button
                        className="production-modal-close"
                        onClick={onClose}
                    >
                        &times;
                    </button>

                </div>

                <div className="production-modal-body">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default ProductionModal;