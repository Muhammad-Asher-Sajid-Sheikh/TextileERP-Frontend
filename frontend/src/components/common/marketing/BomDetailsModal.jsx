import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getOrderBomById,
    addYarnDetailToBom,
    updateYarnDetail,
} from "../../../services/marketingApi";

import "../../../styles/marketing/salesOrder/bomDetailsModal.css";

const FUNCTIONAL_ROLE_OPTIONS = [
    {
        value: "WARP",
        label: "Warp",
    },
    {
        value: "WEFT",
        label: "Weft",
    },
    {
        value: "PILE",
        label: "Pile",
    },
    {
        value: "GROUND",
        label: "Ground",
    },
    {
        value: "BINDER",
        label: "Binder",
    },
    {
        value: "BORDER",
        label: "Border",
    },
];

const EMPTY_FORM = {
    functionalRole: "",
    yarnSpec: "",
    estimatedRatioPct: "",
    firstBatchActualRatioPct: "",
    revisedTotalReqKg: "",
    revisedBalanceToProcureKg: "",
};

const BomDetailsModal = ({
    isOpen,
    bom,
    onClose,
}) => {

    const [bomDetails, setBomDetails] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [showYarnForm, setShowYarnForm] =
        useState(false);

    const [editingYarn, setEditingYarn] =
        useState(null);

    const [formData, setFormData] =
        useState(EMPTY_FORM);


    /* =========================================================
       LOAD BOM DETAILS
    ========================================================= */

    const loadBomDetails = async () => {

        if (!bom?.id) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await getOrderBomById(
                    bom.id
                );

            console.log(
                "BOM DETAILS RESPONSE:",
                response
            );

            setBomDetails(
                response?.data || null
            );

        } catch (error) {

            console.error(
                "Failed to load BOM details:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to load BOM details."
            );

            setBomDetails(null);

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       LOAD WHEN OPENED
    ========================================================= */

    useEffect(() => {

        if (!isOpen || !bom?.id) {
            return;
        }

        setBomDetails(null);

        setShowYarnForm(false);

        setEditingYarn(null);

        setFormData({
            ...EMPTY_FORM,
        });

        loadBomDetails();

    }, [
        isOpen,
        bom?.id,
    ]);


    /* =========================================================
       FORM CHANGE
    ========================================================= */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    /* =========================================================
       OPEN ADD FORM
    ========================================================= */

    const handleAddYarn = () => {

        setEditingYarn(null);

        setFormData({
            ...EMPTY_FORM,
        });

        setShowYarnForm(true);
    };


    /* =========================================================
       OPEN EDIT FORM
    ========================================================= */

    const handleEditYarn = (yarn) => {

        setEditingYarn(yarn);

        setFormData({
            functionalRole:
                yarn.functionalRole || "",

            yarnSpec:
                yarn.yarnSpec || "",

            estimatedRatioPct:
                yarn.estimatedRatioPct ??
                "",

            firstBatchActualRatioPct:
                yarn.firstBatchActualRatioPct ??
                "",

            revisedTotalReqKg:
                yarn.revisedTotalReqKg ??
                "",

            revisedBalanceToProcureKg:
                yarn.revisedBalanceToProcureKg ??
                "",
        });

        setShowYarnForm(true);
    };


    /* =========================================================
       CLOSE YARN FORM
    ========================================================= */

    const handleCancelYarn = () => {

        if (saving) {
            return;
        }

        setShowYarnForm(false);

        setEditingYarn(null);

        setFormData({
            ...EMPTY_FORM,
        });
    };


    const isValidNonNegativeNumber = (value) => {
        if (value === "" || value === null || value === undefined) {
            return false;
        }

        const number = Number(value);

        return Number.isFinite(number) && number >= 0;
    };
    /* =========================================================
       SUBMIT YARN
    ========================================================= */

    const handleSubmitYarn = async (event) => {

        event.preventDefault();

        if (!bomDetails?.id) {
            toast.error("BOM ID is missing.");
            return;
        }

        if (!formData.functionalRole) {
            toast.error("Please select functional role.");
            return;
        }

        if (!formData.yarnSpec.trim()) {
            toast.error("Please enter yarn specification.");
            return;
        }

        /* ============================================
           ESTIMATED RATIO
        ============================================ */

        if (
            !isValidNonNegativeNumber(
                formData.estimatedRatioPct
            )
        ) {
            toast.error(
                "Estimated ratio must be a valid non-negative number."
            );
            return;
        }

        if (
            Number(formData.estimatedRatioPct) > 100
        ) {
            toast.error(
                "Estimated ratio cannot be greater than 100%."
            );
            return;
        }


        /* ============================================
           FIRST BATCH ACTUAL RATIO
        ============================================ */

        if (
            formData.firstBatchActualRatioPct !== "" &&
            (
                !isValidNonNegativeNumber(
                    formData.firstBatchActualRatioPct
                ) ||
                Number(
                    formData.firstBatchActualRatioPct
                ) > 100
            )
        ) {
            toast.error(
                "First batch actual ratio must be between 0 and 100%."
            );
            return;
        }


        /* ============================================
           REQUIRED KG
        ============================================ */

        if (
            !isValidNonNegativeNumber(
                formData.revisedTotalReqKg
            )
        ) {
            toast.error(
                "Revised total required Kg must be a valid non-negative number."
            );
            return;
        }


        /* ============================================
           BALANCE KG
        ============================================ */

        if (
            !isValidNonNegativeNumber(
                formData.revisedBalanceToProcureKg
            )
        ) {
            toast.error(
                "Revised balance to procure Kg must be a valid non-negative number."
            );
            return;
        }


        try {

            setSaving(true);

            const payload = {
                functionalRole:
                    formData.functionalRole,

                yarnSpec:
                    formData.yarnSpec.trim(),

                estimatedRatioPct:
                    Number(
                        formData.estimatedRatioPct
                    ),

                firstBatchActualRatioPct:
                    formData.firstBatchActualRatioPct === ""
                        ? null
                        : Number(
                            formData.firstBatchActualRatioPct
                        ),

                revisedTotalReqKg:
                    Number(
                        formData.revisedTotalReqKg
                    ),

                revisedBalanceToProcureKg:
                    Number(
                        formData.revisedBalanceToProcureKg
                    ),
            };


            console.log(
                editingYarn
                    ? "UPDATE YARN PAYLOAD:"
                    : "ADD YARN PAYLOAD:",
                payload
            );


            if (editingYarn?.id) {

                await updateYarnDetail(
                    editingYarn.id,
                    payload
                );

                toast.success(
                    "Yarn detail updated successfully."
                );

            } else {

                await addYarnDetailToBom(
                    bomDetails.id,
                    payload
                );

                toast.success(
                    "Yarn detail added successfully."
                );
            }


            setShowYarnForm(false);

            setEditingYarn(null);

            setFormData({
                ...EMPTY_FORM,
            });

            await loadBomDetails();

        } catch (error) {

            console.error(
                "Failed to save yarn detail:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to save yarn detail."
            );

        } finally {

            setSaving(false);
        }
    };


    /* =========================================================
       FORMAT NUMBER
    ========================================================= */

    const formatNumber = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return String(value);
        }

        return number.toLocaleString(
            undefined,
            {
                maximumFractionDigits: 2,
            }
        );
    };


    /* =========================================================
       FORMAT ROLE
    ========================================================= */

    const formatRole = (role) => {

        const option =
            FUNCTIONAL_ROLE_OPTIONS.find(
                (item) =>
                    item.value === role
            );

        return option?.label || role || "-";
    };


    if (!isOpen || !bom) {
        return null;
    }


    return (
        <div
            className="bom-details-overlay"
            onClick={onClose}
        >

            <div
                className="bom-details-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="bom-details-header">

                    <div>

                        <h2>
                            BOM Version{" "}
                            {bom.bomVersion}
                        </h2>

                        <p>
                            View and manage yarn
                            details for this BOM.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="bom-details-close-btn"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Close
                    </button>

                </div>


                {loading ? (

                    <div className="bom-details-loading">
                        Loading BOM details...
                    </div>

                ) : !bomDetails ? (

                    <div className="bom-details-empty-state">
                        Unable to load BOM details.
                    </div>

                ) : (

                    <>

                        {/* =============================================
                           BOM INFORMATION
                        ============================================= */}

                        <div className="bom-details-summary">

                            <div className="bom-details-summary-item">
                                <strong>
                                    BOM Version
                                </strong>

                                <p>
                                    {bomDetails.bomVersion}
                                </p>
                            </div>


                            <div className="bom-details-summary-item">
                                <strong>
                                    ATX / ION
                                </strong>

                                <p>
                                    {
                                        bomDetails
                                            ?.order
                                            ?.atxIonNumber ||
                                        "-"
                                    }
                                </p>
                            </div>


                            <div className="bom-details-summary-item">
                                <strong>
                                    Sales Contract
                                </strong>

                                <p>
                                    {
                                        bomDetails
                                            ?.order
                                            ?.salesContract
                                            ?.salesContractNumber ||
                                        "-"
                                    }
                                </p>
                            </div>


                            <div className="bom-details-summary-item">
                                <strong>
                                    Total Revised
                                    Material Cost
                                </strong>

                                <p>
                                    {
                                        formatNumber(
                                            bomDetails
                                                .totalRevisedMaterialCost
                                        )
                                    }
                                </p>
                            </div>


                            <div className="bom-details-summary-item">
                                <strong>
                                    ECS Baseline
                                    Variance
                                </strong>

                                <p>
                                    {
                                        formatNumber(
                                            bomDetails
                                                .ecsBaselineVariance
                                        )
                                    }
                                </p>
                            </div>


                            <div className="bom-details-summary-item">
                                <strong>
                                    Yarn Details
                                </strong>

                                <p>
                                    {
                                        bomDetails
                                            ?.yarnDetails
                                            ?.length ??
                                        0
                                    }
                                </p>
                            </div>

                        </div>


                        {/* =============================================
                           YARN HEADER
                        ============================================= */}

                        <div className="bom-yarn-header">

                            <div>

                                <h3>
                                    Yarn Details
                                </h3>

                                <p>
                                    Yarn composition and
                                    procurement requirements.
                                </p>

                            </div>


                            {!showYarnForm && (
                                <button
                                    type="button"
                                    className="bom-details-primary-btn"
                                    onClick={
                                        handleAddYarn
                                    }
                                >
                                    + Add Yarn
                                </button>
                            )}

                        </div>


                        {/* =============================================
                           YARN FORM
                        ============================================= */}

                        {showYarnForm && (

                            <form
                                onSubmit={handleSubmitYarn}
                                className="bom-yarn-form"
                            >

                                <h3>
                                    {editingYarn
                                        ? "Edit Yarn Detail"
                                        : "Add Yarn Detail"}
                                </h3>


                                <div
                                    className="bom-yarn-form-grid"
                                >

                                    {/* FUNCTIONAL ROLE */}

                                    <div
                                        className="bom-yarn-form-group"
                                    >

                                        <label>
                                            Functional
                                            Role
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <select
                                            name="functionalRole"
                                            value={
                                                formData
                                                    .functionalRole
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

                                            <option value="">
                                                Select role
                                            </option>

                                            {FUNCTIONAL_ROLE_OPTIONS.map(
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

                                    </div>


                                    {/* YARN SPEC */}

                                    <div
                                        className="bom-yarn-form-group"
                                    >

                                        <label>
                                            Yarn
                                            Specification
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="yarnSpec"
                                            value={
                                                formData
                                                    .yarnSpec
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. 30/1 Cotton"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* ESTIMATED RATIO */}

                                    <div
                                        className="bom-yarn-form-group"
                                    >

                                        <label>
                                            Estimated
                                            Ratio %
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="estimatedRatioPct"
                                            value={
                                                formData
                                                    .estimatedRatioPct
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="0"
                                            step="0.01"
                                            placeholder="e.g. 40"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* FIRST BATCH ACTUAL */}

                                    <div
                                        className="bom-yarn-form-group"
                                    >

                                        <label>
                                            First Batch
                                            Actual Ratio %
                                        </label>

                                        <input
                                            type="number"
                                            name="firstBatchActualRatioPct"
                                            value={
                                                formData
                                                    .firstBatchActualRatioPct
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="0"
                                            step="0.01"
                                            placeholder="Optional"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* REVISED TOTAL KG */}

                                    <div
                                        className="bom-yarn-form-group"
                                    >

                                        <label>
                                            Revised Total
                                            Required Kg
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="revisedTotalReqKg"
                                            value={
                                                formData
                                                    .revisedTotalReqKg
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter required Kg"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* BALANCE TO PROCURE */}

                                    <div
                                        className="bom-yarn-form-group"
                                    >

                                        <label>
                                            Revised Balance
                                            to Procure Kg
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="revisedBalanceToProcureKg"
                                            value={
                                                formData
                                                    .revisedBalanceToProcureKg
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter balance Kg"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>

                                </div>


                                <div
                                    style={{
                                        display:
                                            "flex",
                                        gap:
                                            "10px",
                                        marginTop:
                                            "18px",
                                    }}
                                >

                                    <button
                                        type="submit"
                                        className="bom-details-primary-btn"
                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingYarn
                                                ? "Update Yarn"
                                                : "Add Yarn"}
                                    </button>


                                    <button
                                        type="button"
                                        className="bom-details-secondary-btn"
                                        onClick={
                                            handleCancelYarn
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        )}


                        {/* =============================================
                           EMPTY YARN STATE
                        ============================================= */}

                        {!showYarnForm &&
                            (
                                bomDetails
                                    ?.yarnDetails
                                    ?.length ?? 0
                            ) === 0 && (

                                <div className="bom-details-empty-state">

                                    <h3>
                                        No Yarn Details
                                    </h3>

                                    <p>
                                        No yarn details have
                                        been added to this BOM.
                                    </p>

                                    <button
                                        type="button"
                                        className="bom-details-primary-btn"
                                        onClick={
                                            handleAddYarn
                                        }
                                    >
                                        Add First Yarn
                                    </button>

                                </div>

                            )}


                        {/* =============================================
                           YARN TABLE
                        ============================================= */}

                        {!showYarnForm &&
                            (
                                bomDetails
                                    ?.yarnDetails
                                    ?.length ?? 0
                            ) > 0 && (

                                <div className="bom-yarn-table-wrapper">

                                    <table
                                        className="bom-yarn-table"
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    Functional
                                                    Role
                                                </th>

                                                <th>
                                                    Yarn
                                                    Specification
                                                </th>

                                                <th>
                                                    Estimated
                                                    Ratio %
                                                </th>

                                                <th>
                                                    First Batch
                                                    Actual %
                                                </th>

                                                <th>
                                                    Revised Total Required
                                                    <br />
                                                    (Kg)
                                                </th>

                                                <th>
                                                    Balance to Procure
                                                    <br />
                                                    (Kg)
                                                </th>

                                                <th>
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {bomDetails.yarnDetails.map(
                                                (yarn) => (

                                                    <tr
                                                        key={
                                                            yarn.id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                formatRole(
                                                                    yarn.functionalRole
                                                                )
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                yarn.yarnSpec ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {formatNumber(
                                                                yarn.estimatedRatioPct
                                                            )}
                                                            %
                                                        </td>


                                                        <td>
                                                            {yarn.firstBatchActualRatioPct === null ||
                                                                yarn.firstBatchActualRatioPct === undefined
                                                                ? "-"
                                                                : `${formatNumber(
                                                                    yarn.firstBatchActualRatioPct
                                                                )}%`}
                                                        </td>


                                                        <td>
                                                            {
                                                                formatNumber(
                                                                    yarn.revisedTotalReqKg
                                                                )
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                formatNumber(
                                                                    yarn.revisedBalanceToProcureKg
                                                                )
                                                            }
                                                        </td>


                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="bom-yarn-edit-btn"
                                                                onClick={() =>
                                                                    handleEditYarn(
                                                                        yarn
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                    </>

                )}

            </div>

        </div>
    );
};

export default BomDetailsModal;