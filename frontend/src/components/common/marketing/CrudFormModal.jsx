import React, { useEffect, useState } from "react";
import "../../../styles/marketing/partyService/modal.css";

const createInitialState = (fields) => {
    const state = {};

    fields.forEach((field) => {
        state[field.name] =
            field.type === "checkbox"
                ? false
                : "";
    });

    return state;
};

const CrudFormModal = ({
    title,
    fields,
    isOpen,
    mode = "add",
    initialData = null,
    loading = false,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState(() =>
        createInitialState(fields)
    );
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "edit" && initialData) {
            const data = createInitialState(fields);

            fields.forEach((field) => {
                data[field.name] =
                    initialData?.[field.name] ??
                    data[field.name];
            });

            setFormData(data);
        } else {
            setFormData(createInitialState(fields));
        }

        setErrors({});
    }, [isOpen, mode, initialData, fields]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const validateForm = () => {
        const validationErrors = {};

        fields.forEach((field) => {
            if (
                field.required &&
                !formData[field.name]
            ) {
                validationErrors[field.name] =
                    `${field.label} is required.`;
            }

            if (
                field.type === "email" &&
                formData[field.name]
            ) {
                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(formData[field.name])) {
                    validationErrors[field.name] =
                        "Invalid email address.";
                }
            }
        });

        

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload = { ...formData };

        fields.forEach((field) => {
            if (
                field.type === "date" &&
                payload[field.name]
            ) {
                payload[field.name] = new Date(
                    payload[field.name]
                ).toISOString();
            }
        });

        onSubmit(payload);
    };

    if (!isOpen) return null;

    const renderField = (field) => {
        switch (field.type) {

            case "textarea":
                return (
                    <textarea
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ""}
                        disabled={loading}
                        rows={4}
                    />
                );

            case "select":
                return (
                    <select
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                        disabled={loading}
                    >
                        <option value="">
                            {field.placeholder || `Select ${field.label}`}
                        </option>

                        {(field.options || []).map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            default:
                return (
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ""}
                        disabled={loading}
                    />
                );
        }
    };

        return (
        <div
            className="modal-overlay"
            onClick={loading ? undefined : onClose}
        >
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>
                        {mode === "add"
                        ? `Add ${title}`
                        : `Edit ${title}`}
                    </h2>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">

                        <div className="form-grid">

                                {fields
                                .filter(field => field.type !== "checkbox")
                                .map((field) => (
                                    <div className="form-group" key={field.name}>
                                        <label>
                                            {field.label}
                                            {field.required && " *"}
                                        </label>
                                        {renderField(field)}
                                        {errors[field.name] && (
                                            <span className="form-error">
                                                {errors[field.name]}
                                            </span>
                                        )}
                                    </div>
                                ))}

                            

                        </div>

                                {fields
                                .filter(field => field.type === "checkbox")
                                .map((field) => (

                                    <div className="checkbox-section">

                                        <h3>Party Roles</h3>

                                        <div className="checkbox-grid">
                                    
                                    <label className="checkbox-item" key={field.name}>
                                        <input
                                            type="checkbox"
                                            name={field.name}
                                            checked={formData[field.name]}
                                            onChange={handleCheckboxChange}
                                            disabled={loading}
                                        />
                                        <span>{field.label}</span>
                                    </label>

                                        </div>

                                    </div>
                                ))}

                    </div>

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                            disabled={loading}
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
                                : mode === "add"
                                ? `Create ${title}`
                                : `Update ${title}`}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default CrudFormModal;