import { useEffect, useState } from "react";
import "../../styles/assembly/modal.css";

const initialState = {
    workerId: "",
    workerName: "",
    basePieceRate: "",
};

const CreateJobCardModal = ({
    isOpen,
    onClose,
    onSubmit,
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData);
        console.log("Selected order:", selectedOrder);

        onSubmit({
            orderTokenId: selectedOrder,
            workerId: formData.workerId.trim(),
            workerName: formData.workerName.trim(),
            basePieceRate: Number(formData.basePieceRate),
        });
    };

    return (
        <div className="assembly-modal-overlay">
            <div className="assembly-modal">

                <div className="assembly-modal-header">
                    <h2>Create Job Card</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Worker ID</label>

                        <input
                            type="text"
                            name="workerId"
                            value={formData.workerId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Worker Name</label>

                        <input
                            type="text"
                            name="workerName"
                            value={formData.workerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Base Piece Rate</label>

                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="basePieceRate"
                            value={formData.basePieceRate}
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
                            {loading ? "Creating..." : "Create Job Card"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default CreateJobCardModal;