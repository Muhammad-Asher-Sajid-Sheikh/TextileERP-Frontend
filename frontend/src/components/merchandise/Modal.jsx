import "../../styles/merchandise/modal.css";

export default function Modal({
    children,
    onClose,
}) {

    return (
        <div className="modal-overlay">

            <div className="modal">

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}

            </div>

        </div>
    );
}