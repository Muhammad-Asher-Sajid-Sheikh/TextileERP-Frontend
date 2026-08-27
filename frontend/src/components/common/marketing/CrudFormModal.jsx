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


    /* ============================================================
       INITIALIZE FORM
    ============================================================ */

    useEffect(() => {
        if (!isOpen) return;

        const data = createInitialState(fields);

        fields.forEach((field) => {
            data[field.name] =
                initialData?.[field.name] ??
                data[field.name];
        });

        setFormData(data);
        setErrors({});
    }, [isOpen, mode, initialData, fields]);


    /* ============================================================
       INPUT CHANGE
    ============================================================ */

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


    /* ============================================================
       CHECKBOX CHANGE
    ============================================================ */

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };


    /* ============================================================
       VALIDATE FORM
    ============================================================ */

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

                if (
                    !emailRegex.test(
                        formData[field.name]
                    )
                ) {
                    validationErrors[field.name] =
                        "Invalid email address.";
                }
            }
        });

        setErrors(validationErrors);

        return (
            Object.keys(validationErrors).length === 0
        );
    };


    /* ============================================================
       SUBMIT
    ============================================================ */

    const handleSubmit = (e) => {
        e.preventDefault();

        /*
         * View mode should never submit.
         */

        if (mode === "view") {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const payload = {
            ...formData,
        };


        /*
         * Convert date fields to ISO format.
         */

        fields.forEach((field) => {

            if (
                field.type === "date" &&
                payload[field.name]
            ) {
                payload[field.name] =
                    new Date(
                        payload[field.name]
                    ).toISOString();
            }

        });


        onSubmit(payload);
    };


    /* ============================================================
       MODAL CLOSED
    ============================================================ */

    if (!isOpen) {
        return null;
    }


    /* ============================================================
       RENDER FIELD
    ============================================================ */

    const renderField = (field) => {

        switch (field.type) {

            /* ----------------------------------------------------
               TEXTAREA
            ---------------------------------------------------- */

            case "textarea":

                return (
                    <textarea
                        name={field.name}
                        value={
                            formData[field.name] ?? ""
                        }
                        onChange={
                            handleInputChange
                        }
                        placeholder={
                            field.placeholder || ""
                        }
                        disabled={
                            loading ||
                            mode === "view"
                        }
                        rows={4}
                    />
                );


            /* ----------------------------------------------------
               SELECT
            ---------------------------------------------------- */

            case "select":

                return (
                    <select
                        name={field.name}
                        value={
                            formData[field.name] ?? ""
                        }
                        onChange={
                            handleInputChange
                        }
                        disabled={
                            loading ||
                            mode === "view"
                        }
                    >

                        <option value="">
                            {
                                field.placeholder ||
                                `Select ${field.label}`
                            }
                        </option>


                        {(field.options || []).map(
                            (option) => (

                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>

                            )
                        )}

                    </select>
                );


            /* ----------------------------------------------------
               DEFAULT INPUT
            ---------------------------------------------------- */

            default:

                return (
                    <input
                        type={field.type}
                        name={field.name}
                        value={
                            formData[field.name] ?? ""
                        }
                        onChange={
                            handleInputChange
                        }
                        placeholder={
                            field.placeholder || ""
                        }
                        disabled={
                            loading ||
                            mode === "view"
                        }
                    />
                );
        }
    };


    /* ============================================================
       MODAL TITLE
    ============================================================ */

    const modalTitle =
        mode === "add"
            ? `Add ${title}`
            : mode === "view"
                ? `View ${title}`
                : `Edit ${title}`;


    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <div
            className="modal-overlay"
            onClick={
                loading
                    ? undefined
                    : onClose
            }
        >

            <div
                className="modal-container"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="modal-header">

                    <h2>
                        {modalTitle}
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


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="modal-body">


                        {/* ==========================================
                            NORMAL FIELDS
                        ========================================== */}

                        <div className="form-grid">

                            {fields
                                .filter(
                                    (field) =>
                                        field.type !==
                                        "checkbox"
                                )
                                .map((field) => (

                                    <div
                                        className="form-group"
                                        key={field.name}
                                    >

                                        <label>
                                            {field.label}

                                            {field.required &&
                                                " *"}
                                        </label>


                                        {renderField(
                                            field
                                        )}


                                        {errors[
                                            field.name
                                        ] && (

                                            <span className="form-error">
                                                {
                                                    errors[
                                                        field.name
                                                    ]
                                                }
                                            </span>

                                        )}

                                    </div>

                                ))}

                        </div>


                        {/* ==========================================
                            CHECKBOX FIELDS
                        ========================================== */}

                        {fields
                            .filter(
                                (field) =>
                                    field.type ===
                                    "checkbox"
                            )
                            .map((field) => (

                                <div
                                    className="checkbox-section"
                                    key={field.name}
                                >

                                    <h3>
                                        Party Roles
                                    </h3>


                                    <div className="checkbox-grid">

                                        <label className="checkbox-item">

                                            <input
                                                type="checkbox"
                                                name={
                                                    field.name
                                                }
                                                checked={
                                                    !!formData[
                                                        field.name
                                                    ]
                                                }
                                                onChange={
                                                    handleCheckboxChange
                                                }
                                                disabled={
                                                    loading ||
                                                    mode ===
                                                    "view"
                                                }
                                            />


                                            <span>
                                                {
                                                    field.label
                                                }
                                            </span>

                                        </label>

                                    </div>

                                </div>

                            ))}

                    </div>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div className="modal-footer">


                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Close
                        </button>


                        {/* ==============================================
                            CREATE / UPDATE BUTTON
                            Hidden in VIEW mode
                        ============================================== */}

                        {mode !== "view" && (

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

                        )}

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CrudFormModal;