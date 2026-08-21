import { useEffect, useState } from "react";
import "../../styles/surfaceDecorations/modal.css";

const CreateDecorationModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedProcess,
    selectedOrder,
    loading = false,
}) => {

    const initialState = {
        totalPiecesCut: "",
        preStitchBy: "",
    };

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

        if (selectedProcess === "PRINTING") {
            onSubmit({
                orderTokenId: selectedOrder,
            });
            return;
        }

        onSubmit({
            orderTokenId: selectedOrder,
            totalPiecesCut: Number(formData.totalPiecesCut),
            preStitchBy: formData.preStitchBy.trim(),
        });
    };

    return (
        <div className="assembly-modal-overlay">

            <div className="assembly-modal">

                <div className="assembly-modal-header">

                    <h2>
                        {selectedProcess === "PRINTING"
                            ? "Start Printing"
                            : "Initiate Embroidery"}
                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    {selectedProcess === "EMBROIDERY" && (
                        <>

                            <div className="form-group">

                                <label>Total Pieces Cut</label>

                                <input
                                    type="number"
                                    name="totalPiecesCut"
                                    value={formData.totalPiecesCut}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Pre-Stitch By</label>

                                <input
                                    type="text"
                                    name="preStitchBy"
                                    value={formData.preStitchBy}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </>
                    )}

                    {selectedProcess === "PRINTING" && (
                        <div className="info-box">
                            This will initiate the printing workflow for the selected production order.
                        </div>
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
                                ? "Saving..."
                                : selectedProcess === "PRINTING"
                                    ? "Start Printing"
                                    : "Initiate Embroidery"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateDecorationModal;