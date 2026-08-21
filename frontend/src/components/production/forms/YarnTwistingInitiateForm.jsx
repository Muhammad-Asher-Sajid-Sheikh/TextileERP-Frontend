import React, { useState } from "react";
import { initiateYarnTwisting } from "../../../services/productionApi";
import "../../../styles/production/productionForms.css";

const YarnTwistingInitiateForm = ({ onSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        orderTokenId: "",
        twistingVendorId: "",
        dispatchDetails: "",
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

            const response = await initiateYarnTwisting(formData);

            alert(response.message || "Yarn twisting initiated successfully.");

            onSuccess?.(response);
            onClose?.();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to initiate yarn twisting."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="production-form" onSubmit={handleSubmit}>
            <h2>Start Yarn Twisting</h2>

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
                <label>Twisting Vendor ID</label>
                <input
                    type="text"
                    name="twistingVendorId"
                    value={formData.twistingVendorId}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Dispatch Details</label>
                <textarea
                    name="dispatchDetails"
                    rows="4"
                    value={formData.dispatchDetails}
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
                    {loading ? "Starting..." : "Start Yarn Twisting"}
                </button>
            </div>
        </form>
    );
};

export default YarnTwistingInitiateForm;