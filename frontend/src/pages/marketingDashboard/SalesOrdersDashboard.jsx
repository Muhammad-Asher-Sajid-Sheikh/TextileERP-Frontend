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
    getAllPOs,
    getSalesContractsByPo,
    getBomsByOrderId,
} from "../../services/marketingApi";

import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";
import BomManagementModal
    from "../../components/common/marketing/BomManagementModal";

import "../../styles/marketing/partyService/dashboard.css";
import "../../styles/marketing/salesOrder/salesOrderDetailsModal.css";


/* ============================================================
   SALES ORDER COLUMNS
============================================================ */

const salesOrderColumns = [
    {
        key: "atxIonNumber",
        label: "ATX / ION",
    },

    {
        key: "salesContract",
        label: "Sales Contract",
        render: (row) =>
            row?.salesContract?.salesContractNumber ||
            "-",
    },

    {
        key: "orderToken",
        label: "Order Token",
        render: (row) =>
            row?.orderToken?.orderNumber ||
            row?.orderTokenId ||
            "-",
    },

    {
        key: "contractOrderedQty",
        label: "Contract Qty",
        render: (row) =>
            row?.contractOrderedQty ??
            "-",
    },

    {
        key: "minusTolerancePct",
        label: "- Tol. %",
        render: (row) =>
            row?.minusTolerancePct !== null &&
                row?.minusTolerancePct !== undefined
                ? `${row.minusTolerancePct}%`
                : "-",
    },

    {
        key: "plusTolerancePct",
        label: "+ Tol. %",
        render: (row) =>
            row?.plusTolerancePct !== null &&
                row?.plusTolerancePct !== undefined
                ? `${row.plusTolerancePct}%`
                : "-",
    },

    {
        key: "managementShipmentTargetQty",
        label: "Shipment Target",
        render: (row) =>
            row?.managementShipmentTargetQty ??
            "-",
    },

    {
        key: "productionAllowanceQty",
        label: "Production Allowance",
        render: (row) =>
            row?.productionAllowanceQty ??
            "-",
    },

    {
        key: "bomProductionBasisQty",
        label: "BOM Basis Qty",
        render: (row) =>
            row?.bomProductionBasisQty ??
            "-",
    },

    {
        key: "isBulkProductionBlocked",
        label: "Bulk Production",
        render: (row) =>
            row?.isBulkProductionBlocked
                ? "BLOCKED"
                : "RELEASED",
    },

    {
        key: "createdAt",
        label: "Created At",
        render: (row) =>
            row?.createdAt
                ? new Date(
                    row.createdAt
                ).toLocaleDateString()
                : "-",
    },
];


/* ============================================================
   ACTIVATION FIELDS

   Order Token:
   - temporarily entered manually as UUID
   - must exist in database
   - must not already be linked to another Sales Order

   Sales Contract:
   - label shows salesContractNumber
   - value submitted is the real Sales Contract UUID

   ATX / ION:
   - not shown
   - backend generates it

   Bulk Production:
   - not shown
   - always sent as BLOCKED
============================================================ */

const activationFields = [
    {
        name: "contractId",
        label: "Sales Contract",
        type: "select",
        required: true,
    },

    {
        name: "orderTokenId",
        label: "Order Token UUID",
        type: "text",
        placeholder: "Paste Order Token UUID from database",
        required: true,
    },

    {
        name: "contractOrderedQty",
        label: "Contract Ordered Qty",
        type: "number",
        required: true,
    },

    {
        name: "minusTolerancePct",
        label: "Minus Tolerance %",
        type: "number",
        required: true,
    },

    {
        name: "plusTolerancePct",
        label: "Plus Tolerance %",
        type: "number",
        required: true,
    },

    {
        name: "managementShipmentTargetQty",
        label: "Management Shipment Target Qty",
        type: "number",
        required: true,
    },

    {
        name: "productionAllowanceQty",
        label: "Production Allowance Qty",
        type: "number",
        required: true,
    },

    {
        name: "bomProductionBasisQty",
        label: "BOM Production Basis Qty",
        type: "number",
        required: true,
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

    const [salesContracts, setSalesContracts] =
        useState([]);

    const [selectedSalesOrder, setSelectedSalesOrder] =
        useState(null);

    const [selectedBomOrder, setSelectedBomOrder] =
        useState(null);

    // const [bomList, setBomList] =
    //     useState([]);

    const [showBomManagement, setShowBomManagement] =
        useState(false);

    // const [bomLoading, setBomLoading] =
    //     useState(false);

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [contractsLoading, setContractsLoading] =
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
                error?.response?.data?.message ||
                "Failed to load sales orders."
            );

            setSalesOrders([]);

        } finally {

            setLoading(false);

        }
    };


    /* ========================================================
       LOAD SALES CONTRACTS

       Existing endpoints only:

       1. getAllPOs()
       2. getSalesContractsByPo(poId)

       No new endpoints are required.
    ======================================================== */

    const loadSalesContracts = async () => {

        try {

            setContractsLoading(true);

            const poResponse =
                await getAllPOs();

            const pos =
                poResponse?.data || [];

            if (!pos.length) {

                setSalesContracts([]);

                return;
            }

            const contractResponses =
                await Promise.all(
                    pos
                        .filter((po) => po?.id)
                        .map(async (po) => {

                            try {

                                const response =
                                    await getSalesContractsByPo(
                                        po.id
                                    );

                                return (
                                    response?.data || []
                                ).map((contract) => ({

                                    ...contract,

                                    poId: po.id,

                                    customerPoNumber:
                                        po.customerPoNumber,

                                }));

                            } catch (error) {

                                console.error(
                                    `Failed to load sales contracts for PO ${po.id}:`,
                                    error
                                );

                                return [];
                            }
                        })
                );

            const allContracts =
                contractResponses.flat();

            /*
             * Remove duplicate contracts
             * using Sales Contract UUID.
             */
            const uniqueContracts =
                Array.from(
                    new Map(
                        allContracts.map(
                            (contract) => [
                                contract.id,
                                contract,
                            ]
                        )
                    ).values()
                );

            setSalesContracts(
                uniqueContracts
            );

        } catch (error) {

            console.error(
                "Failed to load sales contracts:",
                error
            );

            toast.error(
                "Failed to load sales contracts."
            );

            setSalesContracts([]);

        } finally {

            setContractsLoading(false);

        }
    };


    /* ========================================================
       INITIAL LOAD
    ======================================================== */

    useEffect(() => {

        loadSalesOrders();
        loadSalesContracts();

    }, []);


    /* ========================================================
       SALES CONTRACT OPTIONS

       Display:
       SC number + PO number

       Submit:
       Sales Contract UUID
    ======================================================== */

    const salesContractOptions =
        useMemo(() => {

            return salesContracts
                .filter(
                    (contract) =>
                        contract?.id &&
                        contract?.salesContractNumber
                )
                .map((contract) => ({

                    value: contract.id,

                    label:
                        `${contract.salesContractNumber}` +
                        (
                            contract.customerPoNumber
                                ? ` - PO ${contract.customerPoNumber}`
                                : ""
                        ),

                }));

        }, [salesContracts]);


    /* ========================================================
       CURRENT FORM FIELDS

       Add mode:
       - Sales Contract
       - Order Token UUID
       - quantities

       Edit mode:
       - quantities only
    ======================================================== */

    const currentFields =
        useMemo(() => {

            if (formMode === "edit") {

                return quantityFields;
            }

            return activationFields.map(
                (field) => {

                    if (
                        field.name === "contractId"
                    ) {

                        return {
                            ...field,
                            options:
                                salesContractOptions,
                        };
                    }

                    return field;
                }
            );

        }, [
            formMode,
            salesContractOptions,
        ]);


    /* ========================================================
       SEARCH
    ======================================================== */

    const filteredData =
        useMemo(() => {

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
                        order
                            ?.salesContract
                            ?.salesContractNumber ||
                        "";

                    const searchableValues = [

                        order?.atxIonNumber,

                        order?.contractId,

                        contractNumber,

                        order?.contractOrderedQty,

                        order?.managementShipmentTargetQty,

                        order?.productionAllowanceQty,

                        order?.bomProductionBasisQty,

                        order?.isBulkProductionBlocked
                            ? "blocked"
                            : "released",

                    ];

                    return searchableValues.some(
                        (value) =>
                            String(value ?? "")
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
       OPEN ACTIVATION MODAL
    ======================================================== */

    const openActivateModal = () => {

        if (!salesContracts.length) {

            toast.warning(
                "No sales contracts are available."
            );

            return;
        }

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
                response?.data ||
                item;

            setSelectedSalesOrder(data);

            setShowDetails(true);

        } catch (error) {

            console.error(
                "Failed to load sales order:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
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
   BOM MANAGEMENT
======================================================== */

    const handleBom = (item) => {

        if (!item?.id) {
            toast.error(
                "Sales order ID is missing."
            );
            return;
        }

        console.log(
            "OPEN BOM MANAGEMENT:",
            item
        );

        setSelectedBomOrder(item);

        setShowBomManagement(true);
    };


    /* ========================================================
       SUBMIT
    ======================================================== */

    const handleSubmit = async (formData) => {

        try {

            setSaving(true);


            /* ==================================================
               ACTIVATE SALES ORDER
            ================================================== */

            if (formMode === "add") {

                /*
                 * Sales Contract:
                 * formData.contractId is the real
                 * SalesContractPayment UUID.
                 *
                 * Order Token:
                 * formData.orderTokenId is temporarily
                 * entered manually as an existing
                 * OrderToken UUID.
                 */

                const payload = {

                    contractId:
                        formData.contractId,

                    orderTokenId:
                        formData.orderTokenId,

                    contractOrderedQty:
                        Number(
                            formData.contractOrderedQty
                        ),

                    minusTolerancePct:
                        Number(
                            formData.minusTolerancePct
                        ),

                    plusTolerancePct:
                        Number(
                            formData.plusTolerancePct
                        ),

                    managementShipmentTargetQty:
                        Number(
                            formData.managementShipmentTargetQty
                        ),

                    productionAllowanceQty:
                        Number(
                            formData.productionAllowanceQty
                        ),

                    bomProductionBasisQty:
                        Number(
                            formData.bomProductionBasisQty
                        ),

                    /*
                     * Bulk production must remain
                     * blocked during activation.
                     */
                    isBulkProductionBlocked:
                        true,
                };


                console.log(
                    "ACTIVATE SALES ORDER PAYLOAD:",
                    payload
                );


                await activateSalesOrder(
                    payload
                );


                toast.success(
                    "Sales Order activated successfully."
                );


                await loadSalesOrders();


                setShowFormModal(false);

                setSelectedItem(null);

                setSelectedSalesOrder(null);

                return;
            }


            /* ==================================================
               EDIT QUANTITIES
            ================================================== */

            if (formMode === "edit") {

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
                    formData.managementShipmentTargetQty !== ""
                ) {

                    payload.managementShipmentTargetQty =
                        Number(
                            formData.managementShipmentTargetQty
                        );
                }


                if (
                    formData.productionAllowanceQty !==
                    undefined &&
                    formData.productionAllowanceQty !== ""
                ) {

                    payload.productionAllowanceQty =
                        Number(
                            formData.productionAllowanceQty
                        );
                }


                if (
                    formData.bomProductionBasisQty !==
                    undefined &&
                    formData.bomProductionBasisQty !== ""
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
       CLOSE FORM MODAL
    ======================================================== */

    const closeModal = () => {

        if (saving) {

            return;
        }

        setShowFormModal(false);

        setSelectedItem(null);

        setSelectedSalesOrder(null);

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
       RENDER
    ======================================================== */

    return (
        <div className="dashboard-container">

            {/* ==================================================
               HEADER
            ================================================== */}

            <div className="sales-order-details-header">

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
                    disabled={
                        loading ||
                        contractsLoading
                    }
                >
                    Activate Sales Order
                </button>

            </div>


            {/* ==================================================
               SEARCH
            ================================================== */}

            <div className="selection-bar">

                <div className="selection-group">

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
                        placeholder="Search ATX/ION, sales contract, quantity..."
                    />

                </div>

            </div>


            {/* ==================================================
               CONTRACT LOADING
            ================================================== */}

            {contractsLoading && (
                <div className="loading-state">
                    Loading sales contracts...
                </div>
            )}


            {/* ==================================================
               SALES ORDER LOADING
            ================================================== */}

            {loading && (
                <div className="loading-state">
                    Loading sales orders...
                </div>
            )}


            {/* ==================================================
               TABLE
            ================================================== */}

            {!loading &&
                filteredData.length > 0 && (

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
                        onBom={
                            handleBom
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

                        {salesContracts.length > 0 && (

                            <button
                                className="primary-btn"
                                onClick={
                                    openActivateModal
                                }
                            >
                                Activate First Sales Order
                            </button>
                        )}

                    </div>
                )}


            {/* ==================================================
               ACTIVATE / EDIT MODAL
            ================================================== */}

            <CrudFormModal

                title={
                    formMode === "edit"
                        ? "Sales Order Quantities"
                        : "Sales Order"
                }

                fields={
                    currentFields
                }

                isOpen={
                    showFormModal
                }

                mode={
                    formMode
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
                        className="sales-order-details-overlay"
                        onClick={closeDetails}
                    >

                        <div
                            className="sales-order-details-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="sales-order-details-header">

                                <div>

                                    <h2>
                                        Sales Order Details
                                    </h2>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .atxIonNumber ||
                                            "-"
                                        }
                                    </p>

                                </div>


                                <button
                                    className="sales-order-details-close-btn"
                                    onClick={
                                        closeDetails
                                    }
                                >
                                    Close
                                </button>

                            </div>


                            <div className="sales-order-details-grid">

                                <div className="sales-order-detail-item">

                                    <strong>
                                        ATX / ION
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .atxIonNumber ||
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

                                    <strong>
                                        Sales Contract
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                ?.salesContract
                                                ?.salesContractNumber ||
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

                                    <strong>
                                        Contract Ordered Qty
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .contractOrderedQty ??
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

                                    <strong>
                                        Minus Tolerance
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .minusTolerancePct ??
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

                                    <strong>
                                        Plus Tolerance
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .plusTolerancePct ??
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item"> 

                                    <strong>
                                        Management Shipment Target
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .managementShipmentTargetQty ??
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

                                    <strong>
                                        Production Allowance
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .productionAllowanceQty ??
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

                                    <strong>
                                        BOM Production Basis
                                    </strong>

                                    <p>
                                        {
                                            selectedSalesOrder
                                                .bomProductionBasisQty ??
                                            "-"
                                        }
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

                                    <strong>
                                        Bulk Production
                                    </strong>

                                    <p
                                        className={
                                            selectedSalesOrder.isBulkProductionBlocked
                                                ? "sales-order-status-blocked"
                                                : "sales-order-status-released"
                                        }
                                    >
                                        {selectedSalesOrder.isBulkProductionBlocked
                                            ? "BLOCKED"
                                            : "RELEASED"}
                                    </p>

                                </div>


                                <div className="sales-order-detail-item">

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


                                <div className="sales-order-detail-item">

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

            <BomManagementModal
                isOpen={
                    showBomManagement
                }
                salesOrder={
                    selectedBomOrder
                }
                onClose={() => {
                    setShowBomManagement(false);
                    setSelectedBomOrder(null);
                }}
            />
        </div>
    );
};


export default SalesOrdersDashboard;