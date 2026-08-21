import React, { useState } from "react";
import { logQualityTest } from "../../../services/productionApi";
import "../../../styles/production/productionForms.css";

const QualityTestForm = ({
    wetProcessingLogId = "",
    onSuccess,
    onClose,
}) => {

    const [formData, setFormData] = useState({
        wetProcessingLogId,
        testType: "COLOR_FASTNESS",
        result: "PASSED",
        testedBy: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await logQualityTest(formData);

            if (response.success) {

                alert(response.data.message);

                onSuccess();

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to log quality test."
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

                    <label>Wet Processing Log ID</label>

                    <input
                        type="text"
                        name="wetProcessingLogId"
                        value={formData.wetProcessingLogId}
                        onChange={handleChange}

                    />

                </div>

                <div className="form-group">

                    <label>Test Type</label>

                    <select
                        name="testType"
                        value={formData.testType}
                        onChange={handleChange}
                    >
                        <option value="COLOR_FASTNESS">
                            Color Fastness
                        </option>

                        <option value="SHRINKING">
                            Shrinking
                        </option>

                        <option value="GASOLINE_SMELL">
                            Gasoline Smell
                        </option>
                    </select>

                </div>

                <div className="form-group">

                    <label>Result</label>

                    <select
                        name="result"
                        value={formData.result}
                        onChange={handleChange}
                    >
                        <option value="PASSED">
                            Passed
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>
                    </select>

                </div>

                <div className="form-group">

                    <label>Tested By</label>

                    <input
                        type="text"
                        name="testedBy"
                        value={formData.testedBy}
                        onChange={handleChange}
                        placeholder="Lab Technician"
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
                    {loading
                        ? "Saving..."
                        : "Log Quality Test"}
                </button>

            </div>

        </form>

    );

};

export default QualityTestForm;