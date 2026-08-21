import { useEffect, useState } from "react";
import "../../styles/surfaceDecorations/modal.css";

const initialState = {
    quantityReturned: "",
    returnedAt: "",
    specAuditBy: "",
    specAuditNotes: "",
};

const CompleteDecorationModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedProcess,
    selectedOrder,
    loading = false,
}) => {
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isPrinting = selectedProcess === "PRINTING";

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let payload;

        if (isPrinting) {
            payload = {
                orderTokenId: selectedOrder,
                rollsReturned: Number(formData.quantityReturned),
                specAuditBy: formData.specAuditBy.trim(),
                specAuditNotes: formData.specAuditNotes.trim(),
            };
        } else {
            payload = {
                orderTokenId: selectedOrder,
                piecesReturned: Number(formData.quantityReturned),
                returnedAt: new Date(formData.returnedAt).toISOString(),
            };
        }

        console.log("Complete Payload:", payload);

        onSubmit(payload);
    };

    return (
        <div className="assembly-modal-overlay">
            <div className="assembly-modal">

                <div className="assembly-modal-header">
                    <h2>
                        {isPrinting
                            ? "Complete Printing"
                            : "Complete Embroidery"}
                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>
                            {isPrinting
                                ? "Rolls Returned"
                                : "Pieces Returned"}
                        </label>

                        <input
                            type="number"
                            min="0"
                            name="quantityReturned"
                            value={formData.quantityReturned}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isPrinting && (
                        <div className="form-group">
                            <label>Returned At</label>

                            <input
                                type="datetime-local"
                                name="returnedAt"
                                value={formData.returnedAt}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {isPrinting && (
                        <>
                            <div className="form-group">
                                <label>Specification Audited By</label>

                                <input
                                    type="text"
                                    name="specAuditBy"
                                    value={formData.specAuditBy}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Audit Notes</label>

                                <textarea
                                    rows="4"
                                    name="specAuditNotes"
                                    value={formData.specAuditNotes}
                                    onChange={handleChange}
                                    placeholder="Enter audit notes..."
                                />
                            </div>
                        </>
                    )}

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Completing..."
                                : "Complete"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default CompleteDecorationModal;