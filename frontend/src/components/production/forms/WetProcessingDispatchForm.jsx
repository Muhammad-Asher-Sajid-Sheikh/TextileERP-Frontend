import React, { useState } from "react";
import { dispatchWetProcessing } from "../../../services/productionApi";
import "../../../styles/production/productionForms.css";

const WetProcessingDispatchForm = ({ onSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        orderTokenId: "",
        inputTotalWeight: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "inputTotalWeight"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await dispatchWetProcessing(formData);

            if (response.success) {
                alert(response.data.message);

                onSuccess();
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Unable to dispatch fabric."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="production-form"
            onSubmit={handleSubmit}
        >
            <div className="form-grid">

                <div className="form-group">
                    <label>Order Token</label>

                    <input
                        type="text"
                        name="orderTokenId"
                        value={formData.orderTokenId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Input Weight (kg)</label>

                    <input
                        type="number"
                        step="0.01"
                        name="inputTotalWeight"
                        value={formData.inputTotalWeight}
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
                    {loading ? "Dispatching..." : "Dispatch"}
                </button>

            </div>
        </form>
    );
};

export default WetProcessingDispatchForm;