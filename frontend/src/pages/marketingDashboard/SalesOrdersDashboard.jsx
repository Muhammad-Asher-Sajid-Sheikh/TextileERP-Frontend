import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { toast } from "react-toastify";

import {
    getAllSalesOrders,
    activateSalesOrder,
    getSalesOrderById,
    updateSalesOrderQuantities,
} from "../../services/marketingApi";

import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";

import "../../styles/marketing/partyService/dashboard.css";


/* ============================================================
   SALES ORDER COLUMNS
============================================================ */

const salesOrderColumns = [
    {
        key: "atxIonNumber",
        label: "ATX/ION",
    },

    {
        key: "contractOrderedQty",
        label: "Contract Qty",
        render: (value) =>
            value !== null &&
            value !== undefined
                ? value
                : "-",
    },

    {
        key: "minusTolerancePct",
        label: "- Tol. %",
        render: (value) =>
            value !== null &&
            value !== undefined
                ? `${value}%`
                : "-",
    },

    {
        key: "plusTolerancePct",
        label: "+ Tol. %",
        render: (value) =>
            value !== null &&
            value !== undefined
                ? `${value}%`
                : "-",
    },

    {
        key: "managementShipmentTargetQty",
        label: "Shipment Target",
        render: (value) =>
            value !== null &&
            value !== undefined
                ? value
                : "-",
    },

    {
        key: "productionAllowanceQty",
        label: "Production Allowance",
        render: (value) =>
            value !== null &&
            value !== undefined
                ? value
                : "-",
    },

    {
        key: "bomProductionBasisQty",
        label: "BOM Basis Qty",
        render: (value) =>
            value !== null &&
            value !== undefined
                ? value
                : "-",
    },

    {
        key: "isBulkProductionBlocked",
        label: "Bulk Production",
        render: (value) =>
            value
                ? "BLOCKED"
                : "RELEASED",
    },

    {
        key: "salesContract",
        label: "Sales Contract",
        render: (value, row) =>
            row?.salesContract
                ?.salesContractNumber ||
            row?.salesContract?.id ||
            "-",
    },

    {
        key: "createdAt",
        label: "Created At",
        render: (value) =>
            value
                ? new Date(
                      value
                  ).toLocaleDateString()
                : "-",
    },
];


/* ============================================================
   ACTIVATE SALES ORDER FIELDS
============================================================ */

const activateFields = [
    {
        name: "contractId",
        label: "Sales Contract ID",
        type: "text",
        required: true,
        placeholder: "Enter sales contract ID",
    },

    {
        name: "orderTokenId",
        label: "Order Token ID",
        type: "text",
        required: true,
        placeholder: "Enter order token ID",
    },

    {
        name: "atxIonNumber",
        label: "ATX / ION Number",
        type: "text",
        required: false,
        placeholder: "Leave empty to auto-generate",
    },

    {
        name: "contractOrderedQty",
        label: "Contract Ordered Qty",
        type: "number",
        required: true,
        placeholder: "Enter ordered quantity",
    },

    {
        name: "minusTolerancePct",
        label: "Minus Tolerance %",
        type: "number",
        required: false,
        placeholder: "Enter minus tolerance",
    },

    {
        name: "plusTolerancePct",
        label: "Plus Tolerance %",
        type: "number",
        required: false,
        placeholder: "Enter plus tolerance",
    },

    {
        name: "managementShipmentTargetQty",
        label: "Management Shipment Target Qty",
        type: "number",
        required: false,
        placeholder: "Enter shipment target",
    },

    {
        name: "productionAllowanceQty",
        label: "Production Allowance Qty",
        type: "number",
        required: false,
        placeholder: "Enter production allowance",
    },

    {
        name: "bomProductionBasisQty",
        label: "BOM Production Basis Qty",
        type: "number",
        required: false,
        placeholder: "Enter BOM production basis",
    },

    {
        name: "isBulkProductionBlocked",
        label: "Block Bulk Production",
        type: "checkbox",
        required: false,
    },
];


/* ============================================================
   QUANTITY EDIT FIELDS
============================================================ */

const quantityFields = [
    {
        name: "contractOrderedQty",
        label: "Contract Ordered Qty",
        type: "number",
        required: false,
    },

    {
        name: "minusTolerancePct",
        label: "Minus Tolerance %",
        type: "number",
        required: false,
    },

    {
        name: "plusTolerancePct",
        label: "Plus Tolerance %",
        type: "number",
        required: false,
    },

    {
        name: "managementShipmentTargetQty",
        label: "Management Shipment Target Qty",
        type: "number",
        required: false,
    },

    {
        name: "productionAllowanceQty",
        label: "Production Allowance Qty",
        type: "number",
        required: false,
    },

    {
        name: "bomProductionBasisQty",
        label: "BOM Production Basis Qty",
        type: "number",
        required: false,
    },
];


/* ============================================================
   DASHBOARD
============================================================ */

const SalesOrdersDashboard = () => {

    const [salesOrders, setSalesOrders] =
        useState([]);

    const [selectedSalesOrder, setSelectedSalesOrder] =
        useState(null);

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [showDetails, setShowDetails] =
        useState(false);

    const [formMode, setFormMode] =
        useState("add");


    /* ========================================================
       LOAD SALES ORDERS
    ======================================================== */

    const loadSalesOrders = async () => {

        try {

            setLoading(true);

            const response =
                await getAllSalesOrders();

            console.log(
                "SALES ORDERS RESPONSE:",
                response
            );

            setSalesOrders(
                response?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load sales orders:",
                error
            );

            toast.error(
                "Failed to load sales orders."
            );

            setSalesOrders([]);

        } finally {

            setLoading(false);

        }

    };


    /* ========================================================
       INITIAL LOAD
    ======================================================== */

    useEffect(() => {

        loadSalesOrders();

    }, []);


    /* ========================================================
       SEARCH
    ======================================================== */

    const filteredData = useMemo(() => {

        if (!searchTerm.trim()) {
            return salesOrders;
        }

        const keyword =
            searchTerm
                .toLowerCase()
                .trim();

        return salesOrders.filter(
            (order) => {

                const contractNumber =
                    order?.salesContract
                        ?.salesContractNumber ||
                    "";

                const orderToken =
                    order?.orderToken?.id ||
                    order?.orderTokenId ||
                    "";

                const searchableValues = [
                    order?.atxIonNumber,
                    order?.contractId,
                    order?.orderTokenId,
                    contractNumber,
                    order?.contractOrderedQty,
                    order?.isBulkProductionBlocked
                        ? "blocked"
                        : "released",
                ];

                return searchableValues.some(
                    (value) =>
                        String(
                            value ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)
                );

            }
        );

    }, [
        salesOrders,
        searchTerm,
    ]);


    /* ========================================================
       ACTIVATE SALES ORDER
    ======================================================== */

    const openActivateModal = () => {

        setSelectedItem(null);

        setSelectedSalesOrder(null);

        setFormMode("add");

        setShowFormModal(true);

    };


    /* ========================================================
       VIEW
    ======================================================== */

    const handleView = async (item) => {

        try {

            setLoading(true);

            const response =
                await getSalesOrderById(
                    item.id
                );

            const data =
                response?.data || item;

            setSelectedSalesOrder(data);

            setShowDetails(true);

        } catch (error) {

            console.error(
                "Failed to load sales order:",
                error
            );

            toast.error(
                "Failed to load sales order."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ========================================================
       EDIT QUANTITIES
    ======================================================== */

    const handleEdit = (item) => {

        setSelectedSalesOrder(item);

        setSelectedItem(item);

        setFormMode("edit");

        setShowFormModal(true);

    };


    /* ========================================================
       SUBMIT
    ======================================================== */

    const handleSubmit = async (formData) => {

        try {

            setSaving(true);


            /* ================================================
               ACTIVATE
            ================================================ */

            if (formMode === "add") {

                const payload = {
                    contractId:
                        formData.contractId,

                    orderTokenId:
                        formData.orderTokenId,

                    ...(formData.atxIonNumber
                        ? {
                            atxIonNumber:
                                formData.atxIonNumber,
                        }
                        : {}),

                    contractOrderedQty:
                        Number(
                            formData.contractOrderedQty
                        ),

                    ...(formData.minusTolerancePct !==
                    undefined &&
                    formData.minusTolerancePct !== ""
                        ? {
                            minusTolerancePct:
                                Number(
                                    formData.minusTolerancePct
                                ),
                        }
                        : {}),

                    ...(formData.plusTolerancePct !==
                    undefined &&
                    formData.plusTolerancePct !== ""
                        ? {
                            plusTolerancePct:
                                Number(
                                    formData.plusTolerancePct
                                ),
                        }
                        : {}),

                    ...(formData.managementShipmentTargetQty !==
                    undefined &&
                    formData.managementShipmentTargetQty !==
                    ""
                        ? {
                            managementShipmentTargetQty:
                                Number(
                                    formData.managementShipmentTargetQty
                                ),
                        }
                        : {}),

                    ...(formData.productionAllowanceQty !==
                    undefined &&
                    formData.productionAllowanceQty !==
                    ""
                        ? {
                            productionAllowanceQty:
                                Number(
                                    formData.productionAllowanceQty
                                ),
                        }
                        : {}),

                    ...(formData.bomProductionBasisQty !==
                    undefined &&
                    formData.bomProductionBasisQty !==
                    ""
                        ? {
                            bomProductionBasisQty:
                                Number(
                                    formData.bomProductionBasisQty
                                ),
                        }
                        : {}),

                    isBulkProductionBlocked:
                        formData.isBulkProductionBlocked ??
                        true,
                };


                await activateSalesOrder(
                    payload
                );


                toast.success(
                    "Sales order activated successfully."
                );

            }


            /* ================================================
               EDIT QUANTITIES
            ================================================ */

            else if (formMode === "edit") {

                const orderId =
                    selectedSalesOrder?.id;

                if (!orderId) {

                    toast.error(
                        "Sales order ID is missing."
                    );

                    return;

                }


                const payload = {};


                if (
                    formData.contractOrderedQty !==
                    undefined &&
                    formData.contractOrderedQty !== ""
                ) {
                    payload.contractOrderedQty =
                        Number(
                            formData.contractOrderedQty
                        );
                }


                if (
                    formData.minusTolerancePct !==
                    undefined &&
                    formData.minusTolerancePct !== ""
                ) {
                    payload.minusTolerancePct =
                        Number(
                            formData.minusTolerancePct
                        );
                }


                if (
                    formData.plusTolerancePct !==
                    undefined &&
                    formData.plusTolerancePct !== ""
                ) {
                    payload.plusTolerancePct =
                        Number(
                            formData.plusTolerancePct
                        );
                }


                if (
                    formData.managementShipmentTargetQty !==
                    undefined &&
                    formData.managementShipmentTargetQty !==
                    ""
                ) {
                    payload.managementShipmentTargetQty =
                        Number(
                            formData.managementShipmentTargetQty
                        );
                }


                if (
                    formData.productionAllowanceQty !==
                    undefined &&
                    formData.productionAllowanceQty !==
                    ""
                ) {
                    payload.productionAllowanceQty =
                        Number(
                            formData.productionAllowanceQty
                        );
                }


                if (
                    formData.bomProductionBasisQty !==
                    undefined &&
                    formData.bomProductionBasisQty !==
                    ""
                ) {
                    payload.bomProductionBasisQty =
                        Number(
                            formData.bomProductionBasisQty
                        );
                }


                await updateSalesOrderQuantities(
                    orderId,
                    payload
                );


                toast.success(
                    "Sales order quantities updated successfully."
                );

            }


            setShowFormModal(false);

            setSelectedItem(null);

            setSelectedSalesOrder(null);

            await loadSalesOrders();

        } catch (error) {

            console.error(
                "Sales order operation failed:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Sales order operation failed.";

            toast.error(message);

        } finally {

            setSaving(false);

        }

    };


    /* ========================================================
       CLOSE MODAL
    ======================================================== */

    const closeModal = () => {

        setShowFormModal(false);

        setSelectedItem(null);

        setFormMode("add");

    };


    /* ========================================================
       CLOSE DETAILS
    ======================================================== */

    const closeDetails = () => {

        setShowDetails(false);

        setSelectedSalesOrder(null);

    };


    /* ========================================================
       CURRENT FORM
    ======================================================== */

    const currentFields =
        formMode === "edit"
            ? quantityFields
            : activateFields;


    const currentTitle =
        formMode === "edit"
            ? "Edit Sales Order Quantities"
            : "Activate Sales Order";


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <div className="dashboard-container">

            {/* ==================================================
               HEADER
            ================================================== */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Sales Orders
                    </h1>

                    <p>
                        Manage activated sales
                        orders, quantities and
                        production readiness.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={
                        openActivateModal
                    }
                    disabled={loading}
                >
                    Activate Sales Order
                </button>

            </div>


            {/* ==================================================
               SEARCH
            ================================================== */}

            <div
                className="selection-bar"
            >

                <div
                    className="selection-group"
                >

                    <label>
                        Search Sales Orders
                    </label>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        placeholder="Search ATX/ION, contract, order token..."
                    />

                </div>

            </div>


            {/* ==================================================
               LOADING
            ================================================== */}

            {loading && (

                <div className="loading-state">
                    Loading sales orders...
                </div>

            )}


            {/* ==================================================
               TABLE
            ================================================== */}

            {!loading && filteredData.length > 0 && (

                <CrudTable
                    columns={
                        salesOrderColumns
                    }
                    data={
                        filteredData
                    }
                    onView={
                        handleView
                    }
                    onEdit={
                        handleEdit
                    }
                />

            )}


            {/* ==================================================
               EMPTY STATE
            ================================================== */}

            {!loading &&
                filteredData.length === 0 && (

                    <div className="empty-state">

                        <h3>
                            No Sales Orders Found
                        </h3>

                        <p>
                            There are currently no
                            activated sales orders.
                        </p>

                        <button
                            className="primary-btn"
                            onClick={
                                openActivateModal
                            }
                        >
                            Activate First Sales Order
                        </button>

                    </div>

                )}


            {/* ==================================================
               ACTIVATE / EDIT MODAL
            ================================================== */}

            <CrudFormModal
                title={
                    currentTitle
                }
                fields={
                    currentFields
                }
                isOpen={
                    showFormModal
                }
                mode={
                    formMode === "add"
                        ? "add"
                        : "edit"
                }
                initialData={
                    selectedItem ||
                    selectedSalesOrder
                }
                loading={
                    saving
                }
                onClose={
                    closeModal
                }
                onSubmit={
                    handleSubmit
                }
            />


            {/* ==================================================
               DETAILS
            ================================================== */}

            {showDetails &&
                selectedSalesOrder && (

                    <div
                        className="modal-overlay"
                        onClick={
                            closeDetails
                        }
                    >

                        <div
                            className="modal-content"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div
                                className="dashboard-header"
                            >

                                <div>

                                    <h2>
                                        Sales Order Details
                                    </h2>

                                    <p>
                                        {
                                            selectedSalesOrder.atxIonNumber
                                        }
                                    </p>

                                </div>

                                <button
                                    className="secondary-btn"
                                    onClick={
                                        closeDetails
                                    }
                                >
                                    Close
                                </button>

                            </div>


                            <div className="details-grid">

                                <div>
                                    <strong>
                                        ATX / ION
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder.atxIonNumber ||
                                            "-"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        Sales Contract
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                ?.salesContract
                                                ?.salesContractNumber ||
                                            selectedSalesOrder.contractId ||
                                            "-"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        Order Token
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder.orderTokenId ||
                                            "-"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        Contract Ordered Qty
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder.contractOrderedQty ??
                                            "-"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        Management Shipment Target
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder.managementShipmentTargetQty ??
                                            "-"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        Production Allowance
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder.productionAllowanceQty ??
                                            "-"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        BOM Production Basis
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder.bomProductionBasisQty ??
                                            "-"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        Bulk Production
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .isBulkProductionBlocked
                                            ? "BLOCKED"
                                            : "RELEASED"
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        BOM Count
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                ?.boms
                                                ?.length ??
                                            0
                                        }
                                    </p>
                                </div>


                                <div>
                                    <strong>
                                        Gate Control
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                ?.gateControls
                                                ?.length
                                                ? "Available"
                                                : "Not Created"
                                        }
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                )}

        </div>

    );

};


export default SalesOrdersDashboard;