import React, { useState } from "react";
import { dispatchToWeaving } from "../../../services/productionApi";
import "../../../styles/production/productionForms.css";

const WeavingDispatchForm = ({
    orderTokenId = "",
    onSuccess,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        orderTokenId,
        vendorId: "",
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

            const response = await dispatchToWeaving(formData);

            alert(response.message || "Yarn dispatched successfully.");

            onSuccess?.(response);
            onClose?.();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to dispatch yarn."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="production-form" onSubmit={handleSubmit}>
            <h2>Dispatch to Weaving Vendor</h2>

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
                <label>Vendor ID</label>

                <input
                    type="text"
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                    required
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
                    {loading ? "Dispatching..." : "Dispatch"}
                </button>
            </div>
        </form>
    );
};

export default WeavingDispatchForm; 