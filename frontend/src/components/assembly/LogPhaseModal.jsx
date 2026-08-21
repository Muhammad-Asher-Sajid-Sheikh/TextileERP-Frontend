import { useEffect, useState } from "react";
import "../../styles/assembly/modal.css";

import { ASSEMBLY_PHASES } from "../../constants/assemblyPhases";

const LogPhaseModal = ({
    open,
    onClose,
    jobCard,
    onSubmit,
    loading = false,
}) => {

    const [formData, setFormData] = useState({
        phase: "",
        piecesProcessed: "",
        startedAt: "",
    });

    useEffect(() => {
        if (open) {
            setFormData({
                phase: "",
                piecesProcessed: "",
                startedAt: "",
            });
        }
    }, [open]);

    if (!open || !jobCard) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            jobCardId: jobCard.jobCardId,
            phase: formData.phase,
            piecesProcessed: Number(formData.piecesProcessed),
        };

        if (formData.startedAt) {
            payload.startedAt = new Date(formData.startedAt).toISOString();
        }

        onSubmit(payload);
    };

    return (
        <div className="assembly-modal-overlay">

            <div className="assembly-modal">

                <div className="assembly-modal-header">
                    <h2>Log Assembly Phase</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Phase</label>

                        <select
                            name="phase"
                            value={formData.phase}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Phase</option>

                            {ASSEMBLY_PHASES.map((phase) => (
                                <option
                                    key={phase.value}
                                    value={phase.value}
                                >
                                    {phase.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Pieces Processed</label>

                        <input
                            type="number"
                            name="piecesProcessed"
                            min="1"
                            value={formData.piecesProcessed}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Started At (Optional)</label>

                        <input
                            type="datetime-local"
                            name="startedAt"
                            value={formData.startedAt}
                            onChange={handleChange}
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
                            {loading ? "Saving..." : "Log Phase"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default LogPhaseModal;