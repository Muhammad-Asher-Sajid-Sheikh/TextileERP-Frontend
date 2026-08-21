import { useState } from "react";
import { initializeTechPack } from "../../services/techPackApi";
import "../../styles/merchandise/techPackForm.css";
import { toast } from "react-toastify";

const initialState = {
    orderTokenId: "",
    designName: "",
    seasonCode: "",
    totalTargetQuantity: "",
};

function TechPackForm({ onSuccess }) {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "totalTargetQuantity"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await initializeTechPack(formData);

            toast.success(
                response?.data?.message ||
                "Instruction created successfully."
            );

            setFormData(initialState);

            // Close modal after a short delay so user can see success
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                }
            }, 800);

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to create instruction."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="techpack-form">

            <div className="form-header">
                <h2>Initialize Tech Pack</h2>
                <p>Create a new instruction by initializing a Tech Pack.</p>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Order Token ID</label>
                    <input
                        type="text"
                        name="orderTokenId"
                        value={formData.orderTokenId}
                        onChange={handleChange}
                        placeholder="Enter Order Token ID"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Design Name</label>
                    <input
                        type="text"
                        name="designName"
                        value={formData.designName}
                        onChange={handleChange}
                        placeholder="e.g. Blue Towels 02"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Season Code</label>
                    <input
                        type="text"
                        name="seasonCode"
                        value={formData.seasonCode}
                        onChange={handleChange}
                        placeholder="e.g. 2025"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Total Target Quantity</label>
                    <input
                        type="number"
                        name="totalTargetQuantity"
                        value={formData.totalTargetQuantity}
                        onChange={handleChange}
                        placeholder="Enter Quantity"
                        required
                    />
                </div>

                <button
                    className="submit-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Tech Pack"}
                </button>

                

            </form>

        </div>
    );
}

export default TechPackForm;