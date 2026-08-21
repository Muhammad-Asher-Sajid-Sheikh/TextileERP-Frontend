import React, { useState } from "react";
import { completeWetProcessing } from "../../../services/productionApi";
import "../../../styles/production/productionForms.css";

const WetProcessingCompleteForm = ({
    orderTokenId = "",
    onSuccess,
    onClose,
}) => {

    const [formData, setFormData] = useState({
        orderTokenId,
        outputTotalWeight: "",
        returnedAt: "",
        returnedFrom: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "outputTotalWeight"
                    ? Number(value)
                    : value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const payload = {
                orderTokenId: formData.orderTokenId,
                outputTotalWeight: formData.outputTotalWeight,
            };

            if (formData.returnedAt)
                payload.returnedAt = formData.returnedAt;

            if (formData.returnedFrom.trim())
                payload.returnedFrom =
                    formData.returnedFrom;

            const response =
                await completeWetProcessing(payload);

            if (response.success) {

                alert(response.data.message);

                onSuccess();

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                    "Unable to complete wet processing."
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
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>Output Weight (kg)</label>

                    <input
                        type="number"
                        step="0.01"
                        name="outputTotalWeight"
                        value={formData.outputTotalWeight}
                        onChange={handleChange}
                        required
                    />

                </div>

            </div>

            <h3>Additional Information (Optional)</h3>

            <div className="form-grid">

                <div className="form-group">

                    <label>Returned At</label>

                    <input
                        type="datetime-local"
                        name="returnedAt"
                        value={formData.returnedAt}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Returned From</label>

                    <input
                        type="text"
                        name="returnedFrom"
                        value={formData.returnedFrom}
                        onChange={handleChange}
                        placeholder="e.g. Al-Noor Dyehouse"
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
                    {loading
                        ? "Completing..."
                        : "Complete Wet Processing"}
                </button>

            </div>

        </form>

    );
};

export default WetProcessingCompleteForm;