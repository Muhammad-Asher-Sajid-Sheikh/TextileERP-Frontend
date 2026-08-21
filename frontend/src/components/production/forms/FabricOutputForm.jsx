import React, { useState } from "react";
import { logFabricOutput } from "../../../services/productionApi";
import "../../../styles/production/productionForms.css";

const FabricOutputForm = ({
    orderTokenId = "",
    onSuccess,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        orderTokenId,
        rollPieceCount: "",
        totalMassWeight: "",
        fabricDensityGsm: "",
        totalLength: "",
        poYieldTargetWeight: "",
        returnedAt: new Date().toISOString().slice(0, 16),
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                ...formData,
                rollPieceCount: Number(formData.rollPieceCount),
                totalMassWeight: Number(formData.totalMassWeight),
                fabricDensityGsm: Number(formData.fabricDensityGsm),
                totalLength: Number(formData.totalLength),
                poYieldTargetWeight: Number(formData.poYieldTargetWeight),
                returnedAt: new Date(formData.returnedAt).toISOString(),
            };

            const response = await logFabricOutput(payload);

            alert(response.message || "Fabric output logged successfully.");

            onSuccess?.(response);
            onClose?.();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to log fabric output."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="production-form" onSubmit={handleSubmit}>
            <h2>Log Fabric Output</h2>

            <div className="form-grid">

                <div className="form-group">
                    <label>Order Token</label>

                    <input
                        type="text"
                        name="orderTokenId"
                        value={formData.orderTokenId}
                        onChange={handleChange}
                        required
                        readOnly={!!orderTokenId}
                    />
                </div>

                <div className="form-group">
                    <label>Roll Piece Count</label>

                    <input
                        type="number"
                        name="rollPieceCount"
                        value={formData.rollPieceCount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Total Weight (KG)</label>

                    <input
                        type="number"
                        step="0.01"
                        name="totalMassWeight"
                        value={formData.totalMassWeight}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Fabric GSM</label>

                    <input
                        type="number"
                        name="fabricDensityGsm"
                        value={formData.fabricDensityGsm}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Total Length</label>

                    <input
                        type="number"
                        step="0.01"
                        name="totalLength"
                        value={formData.totalLength}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>PO Yield Target Weight</label>

                    <input
                        type="number"
                        step="0.01"
                        name="poYieldTargetWeight"
                        value={formData.poYieldTargetWeight}
                        onChange={handleChange}
                        required
                    />
                </div>

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

            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="secondary-btn"
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="primary-btn"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Log Fabric Output"}
                </button>
            </div>
        </form>
    );
};

export default FabricOutputForm;