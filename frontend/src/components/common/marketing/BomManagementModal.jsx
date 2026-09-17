import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getBomsByOrderId,
    createOrderBom,
} from "../../../services/marketingApi";

import BomDetailsModal
    from "./BomDetailsModal";

import "../../../styles/marketing/salesOrder/bomManagementModal.css";

const BomManagementModal = ({
    isOpen,
    salesOrder,
    onClose,
}) => {

    const [boms, setBoms] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [selectedBom, setSelectedBom] =
        useState(null);

    const [formData, setFormData] = useState({
        totalRevisedMaterialCost: "",
        ecsBaselineVariance: "",
    });


    /* =========================================================
       LOAD BOMS
    ========================================================= */

    const loadBoms = async () => {

        if (!salesOrder?.id) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await getBomsByOrderId(
                    salesOrder.id
                );

            console.log(
                "BOMS RESPONSE:",
                response
            );

            setBoms(
                response?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load BOMs:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load BOMs."
            );

            setBoms([]);

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       LOAD WHEN MODAL OPENS
    ========================================================= */

    useEffect(() => {

        if (!isOpen || !salesOrder?.id) {
            return;
        }

        loadBoms();

        setShowCreateForm(false);

        setFormData({
            totalRevisedMaterialCost: "",
            ecsBaselineVariance: "",
        });

    }, [
        isOpen,
        salesOrder?.id,
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

    const isValidNonNegativeNumber = (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return false;
        }

        const number = Number(value);

        return Number.isFinite(number) && number >= 0;
    };
    /* =========================================================
       CREATE BOM
    ========================================================= */

    const handleCreateBom = async (
        event
    ) => {

        event.preventDefault();

        if (!salesOrder?.id) {
            toast.error(
                "Sales order ID is missing."
            );
            return;
        }

        if (
            !isValidNonNegativeNumber(
                formData.totalRevisedMaterialCost
            )
        ) {
            toast.error(
                "Total revised material cost must be a valid non-negative number."
            );
            return;
        }

        if (
            !isValidNonNegativeNumber(
                formData.ecsBaselineVariance
            )
        ) {
            toast.error(
                "ECS baseline variance must be a valid number."
            );
            return;
        }

        try {

            setSaving(true);

            const payload = {
                totalRevisedMaterialCost:
                    Number(
                        formData.totalRevisedMaterialCost
                    ),

                ecsBaselineVariance:
                    Number(
                        formData.ecsBaselineVariance
                    ),
            };

            console.log(
                "CREATE BOM PAYLOAD:",
                payload
            );

            const response =
                await createOrderBom(
                    salesOrder.id,
                    payload
                );

            console.log(
                "CREATE BOM RESPONSE:",
                response
            );

            toast.success(
                `BOM Version ${response?.data?.bomVersion ||
                ""
                } created successfully.`
            );

            setShowCreateForm(false);

            setFormData({
                totalRevisedMaterialCost: "",
                ecsBaselineVariance: "",
            });

            await loadBoms();

        } catch (error) {

            console.error(
                "Failed to create BOM:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to create BOM."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleOpenBom = (bom) => {

        if (!bom?.id) {
            toast.error(
                "BOM ID is missing."
            );
            return;
        }

        console.log(
            "OPEN BOM:",
            bom
        );

        setSelectedBom(bom);
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

        return number.toLocaleString();
    };


    if (!isOpen || !salesOrder) {
        return null;
    }


    return (
        <div
            className="bom-management-overlay"
            onClick={onClose}
        >
            <div
                className="bom-management-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="bom-management-header">

                    <div>

                        <h2>
                            BOM Management
                        </h2>

                        <p>
                            Manage BOM versions for this
                            Sales Order.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="bom-close-btn"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>


                {/* =================================================
                   SALES ORDER SUMMARY
                ================================================= */}

                <div className="bom-order-summary">

                    <div className="bom-summary-item">
                        <span className="bom-summary-label">
                            ATX / ION
                        </span>

                        <p className="bom-summary-value">
                            {salesOrder.atxIonNumber || "-"}
                        </p>
                    </div>


                    <div>
                        <strong>
                            Sales Contract
                        </strong>

                        <p>
                            {
                                salesOrder
                                    ?.salesContract
                                    ?.salesContractNumber ||
                                salesOrder.contractId ||
                                "-"
                            }
                        </p>
                    </div>


                    <div>
                        <strong>
                            Contract Qty
                        </strong>

                        <p>
                            {
                                salesOrder.contractOrderedQty ??
                                "-"
                            }
                        </p>
                    </div>


                    <div>
                        <strong>
                            BOM Versions
                        </strong>

                        <p>
                            {boms.length}
                        </p>
                    </div>

                </div>


                {/* =================================================
   BOM SECTION HEADER
================================================= */}

                <div className="bom-section-header">
                    <div>

                        <h3>
                            BOM Versions
                        </h3>

                        <p>
                            Latest BOM versions are shown first.
                        </p>

                    </div>

                    {!showCreateForm && (
                        <button
                            type="button"
                            className="bom-primary-btn"
                            onClick={() =>
                                setShowCreateForm(true)
                            }
                        >
                            + Create BOM
                        </button>
                    )}

                </div>


                {/* =================================================
                   CREATE BOM FORM
                ================================================= */}

                {showCreateForm && (

                    <form
                        onSubmit={
                            handleCreateBom
                        }
                        style={{
                            border:
                                "1px solid #e2e8f0",
                            borderRadius:
                                "10px",
                            padding:
                                "20px",
                            marginBottom:
                                "20px",
                        }}
                    >

                        <h3>
                            Create New BOM
                        </h3>

                        <p
                            style={{
                                marginBottom:
                                    "18px",
                            }}
                        >
                            BOM version will be assigned
                            automatically.
                        </p>


                        <div
                            className="form-grid"
                        >

                            <div
                                className="form-group"
                            >

                                <label>
                                    Total Revised
                                    Material Cost
                                    <span>
                                        *
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    name="totalRevisedMaterialCost"
                                    value={
                                        formData
                                            .totalRevisedMaterialCost
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter total revised material cost"
                                    disabled={
                                        saving
                                    }
                                />

                            </div>


                            <div
                                className="form-group"
                            >

                                <label>
                                    ECS Baseline
                                    Variance
                                    <span>
                                        *
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    name="ecsBaselineVariance"
                                    value={
                                        formData
                                            .ecsBaselineVariance
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    step="0.01"
                                    placeholder="Enter ECS baseline variance"
                                    disabled={
                                        saving
                                    }
                                />

                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "18px",
                            }}
                        >

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Creating..."
                                    : "Create BOM"}
                            </button>

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() =>
                                    setShowCreateForm(
                                        false
                                    )
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                )}


                {/* =================================================
                   LOADING
                ================================================= */}

                {loading && (

                    <div className="loading-state">
                        Loading BOM versions...
                    </div>

                )}


                {/* =================================================
                   EMPTY
                ================================================= */}

                {!loading &&
                    boms.length === 0 &&
                    !showCreateForm && (

                        <div className="empty-state">

                            <h3>
                                No BOM Created
                            </h3>

                            <p>
                                This Sales Order does not
                                have a BOM yet.
                            </p>

                            <button
                                type="button"
                                className="primary-btn"
                                onClick={() =>
                                    setShowCreateForm(
                                        true
                                    )
                                }
                            >
                                Create First BOM
                            </button>

                        </div>

                    )}


                {/* =================================================
                   BOM LIST
                ================================================= */}

                {!loading &&
                    boms.length > 0 && (

                        <div
                            style={{
                                display: "flex",
                                flexDirection:
                                    "column",
                                gap: "12px",
                            }}
                        >

                            {boms.map((bom) => (

                                <div
                                    key={bom.id}
                                    className="bom-card"
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            marginBottom:
                                                "14px",
                                        }}
                                    >

                                        <div>

                                            <h3>
                                                BOM Version{" "}
                                                {
                                                    bom.bomVersion
                                                }
                                            </h3>

                                            <p>
                                                Created:{" "}
                                                {bom.createdAt
                                                    ? new Date(
                                                        bom.createdAt
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </p>

                                        </div>

                                    </div>


                                    <div
                                        className="details-grid"
                                    >

                                        <div>
                                            <strong>
                                                Total Revised
                                                Material Cost
                                            </strong>

                                            <p>
                                                {
                                                    formatNumber(
                                                        bom.totalRevisedMaterialCost
                                                    )
                                                }
                                            </p>
                                        </div>


                                        <div>
                                            <strong>
                                                ECS Baseline
                                                Variance
                                            </strong>

                                            <p>
                                                {
                                                    formatNumber(
                                                        bom.ecsBaselineVariance
                                                    )
                                                }
                                            </p>
                                        </div>


                                        <div>
                                            <strong>
                                                Yarn Details
                                            </strong>

                                            <p>
                                                {
                                                    bom
                                                        ?.yarnDetails
                                                        ?.length ??
                                                    0
                                                }
                                            </p>
                                        </div>

                                    </div>


                                    <div
                                        style={{
                                            marginTop:
                                                "16px",
                                        }}
                                    >

                                        <button
                                            type="button"
                                            className="secondary-btn"
                                            onClick={() =>
                                                handleOpenBom(bom)
                                            }
                                            title="Yarn detail management will be added in the next step."
                                        >
                                            Open BOM
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </div>
            <BomDetailsModal
                isOpen={
                    Boolean(selectedBom)
                }
                bom={
                    selectedBom
                }
                onClose={() =>
                    setSelectedBom(null)
                }
            />
        </div>
    );
};

export default BomManagementModal;