import { useEffect, useState } from "react";
import "../../styles/surfaceDecorations/modal.css";

const initialState = {
    vendorId: "",
    quantity: "",
};

const DispatchDecorationModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedOrder,
    selectedProcess,
    loading = false,
}) => {

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        console.log("FormData: ", formData);
        e.preventDefault();
        console.log("selectedProcess:", selectedProcess);
        const payload = {
            orderTokenId: selectedOrder,
            vendorId: formData.vendorId.trim(),
        };

        if (selectedProcess === "PRINTING") {
            payload.rollsSent = Number(formData.quantity);
        } else {
            payload.piecesSent = Number(formData.quantity);
        }

        onSubmit(payload);
    };

    return (
        <div className="assembly-modal-overlay">
            <div className="assembly-modal">

                <div className="assembly-modal-header">
                    <h2>
                        {selectedProcess === "PRINTING"
                            ? "Dispatch Printing"
                            : "Dispatch Embroidery"}
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
                        <label>Vendor ID</label>

                        <input
                            type="text"
                            name="vendorId"
                            value={formData.vendorId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            {selectedProcess === "PRINTING"
                                ? "Rolls Sent"
                                : "Pieces Sent"}
                        </label>

                        <input
                            type="number"
                            min="1"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                            {loading ? "Dispatching..." : "Dispatch"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default DispatchDecorationModal;