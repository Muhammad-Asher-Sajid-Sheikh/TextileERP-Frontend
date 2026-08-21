import React, { useState } from "react";
import { completeYarnTwisting } from "../../../services/productionApi";
import "../../../styles/production/productionForms.css";

const YarnTwistingCompleteForm = ({
    orderTokenId = "",
    onSuccess,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        orderTokenId,
        twistingCompletedAt: new Date().toISOString().slice(0, 16),
        notes: "",
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
                twistingCompletedAt: new Date(
                    formData.twistingCompletedAt
                ).toISOString(),
            };

            const response = await completeYarnTwisting(payload);

            alert(response.message || "Yarn twisting completed.");

            onSuccess?.(response);
            onClose?.();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to complete yarn twisting."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="production-form" onSubmit={handleSubmit}>
            <h2>Complete Yarn Twisting</h2>

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
                <label>Completed At</label>

                <input
                    type="datetime-local"
                    name="twistingCompletedAt"
                    value={formData.twistingCompletedAt}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Notes</label>

                <textarea
                    name="notes"
                    rows="5"
                    value={formData.notes}
                    onChange={handleChange}
                />
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
                    {loading ? "Completing..." : "Complete Twisting"}
                </button>
            </div>
        </form>
    );
};

export default YarnTwistingCompleteForm;