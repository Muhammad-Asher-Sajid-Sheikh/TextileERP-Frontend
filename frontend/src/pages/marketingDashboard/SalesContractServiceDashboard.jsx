import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { toast } from "react-toastify";

import {
    getAllPOs,
    getAllParties,

    getSalesContractsByPo,
    createSalesContract,
    getSalesContractById,
    updateSalesContractPaymentClearance,
    updateSalesContractSignedCopy,
} from "../../services/marketingApi";

import CrudToolbar from "../../components/common/marketing/CrudToolbar";
import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";

import ViewPartyDrawer from "../../components/marketing/partyService/ViewPartyDrawer";

import "../../styles/marketing/partyService/dashboard.css";


/* ============================================================
   DUMMY USERS
   ============================================================

   Replace this later with getAllUsers() when the API is available.
============================================================ */

const DUMMY_USERS = [
            {
                id: "bb051c54-65a0-47c9-a84b-bbd77385e8b8",
                name: "Ahmed Khan",
                email: "ahmed@example.com",
            },
            {
                id: "81314047-5463-422c-b80c-1a0f021d2155",
                name: "Marketing",
                email: "marketing@example.com",
            },
            {
                id: "213353fc-f808-43a5-9df0-b4747000285e",
                name: "Sara Ahmed",
                email: "sara@example.com",
            }
        ]


/* ============================================================
   SALES CONTRACT COLUMNS
============================================================ */

const salesContractColumns = [
    {
        key: "salesContractNumber",
        label: "Sales Contract",
    },
    {
        key: "paymentMethod",
        label: "Payment Method",
    },
    {
        key: "paymentStatus",
        label: "Payment Status",
    },
    {
        key: "signedScReceived",
        label: "Signed SC",
    },
    {
        key: "legalBuyer",
        label: "Legal Buyer",
        render: (value, row) =>
            row?.legalBuyer?.legalName ||
            row?.legalBuyer?.name ||
            row?.legalBuyerPartyId ||
            "-",
    },
    {
        key: "paymentRemitter",
        label: "Payment Remitter",
        render: (value, row) =>
            row?.paymentRemitter?.legalName ||
            row?.paymentRemitter?.name ||
            row?.paymentRemitterPartyId ||
            "-",
    },
    {
        key: "createdAt",
        label: "Created At",
        render: (value) =>
            value
                ? new Date(value).toLocaleDateString()
                : "-",
    },
];


/* ============================================================
   SALES CONTRACT FORM FIELDS
============================================================ */

const salesContractFields = [
    {
        name: "legalBuyerPartyId",
        label: "Legal Buyer",
        type: "select",
        required: true,
        placeholder: "Select legal buyer",
        options: [],
        render: (row) =>
        row.legalBuyer?.legalName ||
        row.legalBuyer?.name ||
        "-"
    },

    {
        name: "paymentRemitterPartyId",
        label: "Payment Remitter",
        type: "select",
        required: true,
        placeholder: "Select payment remitter",
        options: [],
        render: (row) =>
        row.paymentRemitter?.legalName ||
        row.paymentRemitter?.name ||
        "-"
    },

    {
        name: "paymentMethod",
        label: "Payment Method",
        type: "select",
        required: true,
        placeholder: "Select payment method",
        options: [
            {
                value: "LC",
                label: "Letter of Credit (LC)",
            },
            {
                value: "TT",
                label: "Telegraphic Transfer (TT)",
            },
            {
                value: "CAD",
                label: "Cash Against Documents (CAD)",
            },
        ],
    },

    {
        name: "salesContractNumber",
        label: "Sales Contract Number",
        type: "text",
        required: false,
        placeholder: "Leave empty to auto-generate",
    },

    {
        name: "paymentStatus",
        label: "Payment Status",
        type: "select",
        required: false,
        placeholder: "Select payment status",
        options: [
            {
                value: "PAYMENT_EXPECTED",
                label: "Payment Expected",
            },
            {
                value: "ADVANCE_RECEIVED",
                label: "Advance Received",
            },
            {
                value: "LC_OPENED",
                label: "LC Opened",
            },
            {
                value: "CREDIT_APPROVED",
                label: "Credit Approved",
            },
            {
                value: "BLOCKED",
                label: "Blocked",
            },
        ],
    },

    {
        name: "signedScReceived",
        label: "Signed SC Received",
        type: "checkbox",
        required: false,
    },

    {
        name: "verifiedByAccountsId",
        label: "Verified By Accounts",
        type: "select",
        required: false,
        placeholder: "Select accounts verifier",
        options: [],
    },
];


/* ============================================================
   PAYMENT CLEARANCE FIELDS
============================================================ */

const paymentClearanceFields = [
    {
        name: "paymentStatus",
        label: "Payment Status",
        type: "select",
        required: true,
        placeholder: "Select payment status",
        options: [
            {
                value: "PAYMENT_EXPECTED",
                label: "Payment Expected",
            },
            {
                value: "ADVANCE_RECEIVED",
                label: "Advance Received",
            },
            {
                value: "LC_OPENED",
                label: "LC Opened",
            },
            {
                value: "CREDIT_APPROVED",
                label: "Credit Approved",
            },
            {
                value: "BLOCKED",
                label: "Blocked",
            },
        ],
    },

    {
        name: "verifiedByAccountsId",
        label: "Verified By Accounts",
        type: "select",
        required: false,
        placeholder: "Select accounts verifier",
        options: [],
    },
];


/* ============================================================
   SIGNED COPY FIELDS
============================================================ */

const signedCopyFields = [
    {
        name: "signedScReceived",
        label: "Signed SC Received",
        type: "checkbox",
        required: true,
    },
];


/* ============================================================
   DASHBOARD
============================================================ */

const SalesContractServiceDashboard = () => {

    /* --------------------------------------------------------
       PURCHASE ORDERS
    -------------------------------------------------------- */

    const [purchaseOrders, setPurchaseOrders] =
        useState([]);

    const [selectedPOId, setSelectedPOId] =
        useState("");


    /* --------------------------------------------------------
       PARTIES
    -------------------------------------------------------- */

    const [parties, setParties] =
        useState([]);


    /* --------------------------------------------------------
       SALES CONTRACTS
    -------------------------------------------------------- */

    const [salesContracts, setSalesContracts] =
        useState([]);

    const [selectedSalesContract, setSelectedSalesContract] =
        useState(null);


    /* --------------------------------------------------------
       USERS
    -------------------------------------------------------- */

    const [users] =
        useState(DUMMY_USERS);


    /* --------------------------------------------------------
       UI STATE
    -------------------------------------------------------- */

    const [activeAction, setActiveAction] =
        useState("view");

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [showDrawer, setShowDrawer] =
        useState(false);

    const [formMode, setFormMode] =
        useState("add");


    /* ========================================================
       PO OPTIONS
    ======================================================== */

    const poOptions = useMemo(() => {

        return purchaseOrders.map((po) => {

            const poNumber =
                po.customerPoNumber ||
                po.poNumber ||
                po.number ||
                po.id;

            const revision =
                po.poRevision
                    ? ` - Rev ${po.poRevision}`
                    : "";

            return {
                value: po.id,
                label: `${poNumber}${revision}`,
            };

        });

    }, [purchaseOrders]);


    /* ========================================================
       PARTY OPTIONS
    ======================================================== */

    const partyOptions = useMemo(() => {

        return parties.map((party) => {

            const partyName =
                party.legalName ||
                party.name ||
                party.companyName ||
                party.displayName ||
                party.id;

            return {
                value: party.id,
                label: partyName,
            };

        });

    }, [parties]);


    /* ========================================================
       USER OPTIONS
    ======================================================== */

    const userOptions = useMemo(() => {

        return users.map((user) => {

            const userName =
                user.name ||
                user.fullName ||
                user.email ||
                user.id;

            return {
                value: user.id,
                label: `${userName}${
                    user.email
                        ? ` - ${user.email}`
                        : ""
                }`,
            };

        });

    }, [users]);


    /* ========================================================
       FORM FIELDS WITH DYNAMIC OPTIONS
    ======================================================== */

    const dynamicSalesContractFields =
        useMemo(() => {

            return salesContractFields.map(
                (field) => {

                    if (
                        field.name ===
                        "legalBuyerPartyId"
                    ) {
                        return {
                            ...field,
                            options: partyOptions,
                        };
                    }

                    if (
                        field.name ===
                        "paymentRemitterPartyId"
                    ) {
                        return {
                            ...field,
                            options: partyOptions,
                        };
                    }

                    if (
                        field.name ===
                        "verifiedByAccountsId"
                    ) {
                        return {
                            ...field,
                            options: userOptions,
                        };
                    }

                    return field;

                }
            );

        }, [
            partyOptions,
            userOptions,
        ]);


    const dynamicPaymentClearanceFields =
        useMemo(() => {

            return paymentClearanceFields.map(
                (field) => {

                    if (
                        field.name ===
                        "verifiedByAccountsId"
                    ) {
                        return {
                            ...field,
                            options: userOptions,
                        };
                    }

                    return field;

                }
            );

        }, [
            userOptions,
        ]);


    /* ========================================================
       LOAD PURCHASE ORDERS
    ======================================================== */

    const loadPurchaseOrders =
        async () => {

            try {

                setLoading(true);

                const response =
                    await getAllPOs();

                setPurchaseOrders(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load POs:",
                    error
                );

                toast.error(
                    "Failed to load purchase orders."
                );

            } finally {

                setLoading(false);

            }

        };


    /* ========================================================
       LOAD PARTIES
    ======================================================== */

    const loadParties =
        async () => {

            try {

                const response =
                    await getAllParties();

                setParties(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load parties:",
                    error
                );

                toast.error(
                    "Failed to load parties."
                );

            }

        };


    /* ========================================================
       LOAD SALES CONTRACTS
    ======================================================== */

    const loadSalesContracts =
        async (poId) => {

            if (!poId) {

                setSalesContracts([]);
                setSelectedSalesContract(null);

                return;

            }

            try {

                setLoading(true);

                const response =
                    await getSalesContractsByPo(
                        poId
                    );

                const data =
                    response?.data || [];

                setSalesContracts(data);

                setSelectedSalesContract(
                    (previous) => {

                        if (!previous) {
                            return null;
                        }

                        const stillExists =
                            data.some(
                                (contract) =>
                                    contract.id ===
                                    previous.id
                            );

                        return stillExists
                            ? previous
                            : null;

                    }
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
                setSelectedSalesContract(null);

            } finally {

                setLoading(false);

            }

        };


    /* ========================================================
       INITIAL LOAD
    ======================================================== */

    useEffect(() => {

        loadPurchaseOrders();
        loadParties();

    }, []);


    /* ========================================================
       PO CHANGE
    ======================================================== */

    useEffect(() => {

        setSelectedSalesContract(null);
        setSalesContracts([]);

        if (!selectedPOId) {
            return;
        }

        loadSalesContracts(
            selectedPOId
        );

    }, [selectedPOId]);


    /* ========================================================
       SEARCH
    ======================================================== */

    const filteredData =
        useMemo(() => {

            if (!searchTerm.trim()) {
                return salesContracts;
            }

            const keyword =
                searchTerm
                    .toLowerCase()
                    .trim();

            return salesContracts.filter(
                (contract) => {

                    const legalBuyer =
                        contract
                            ?.legalBuyer
                            ?.legalName ||
                        contract
                            ?.legalBuyer
                            ?.name ||
                        "";

                    const paymentRemitter =
                        contract
                            ?.paymentRemitter
                            ?.legalName ||
                        contract
                            ?.paymentRemitter
                            ?.name ||
                        "";

                    const searchableValues = [
                        contract.salesContractNumber,
                        contract.paymentMethod,
                        contract.paymentStatus,
                        contract.legalBuyerPartyId,
                        contract.paymentRemitterPartyId,
                        legalBuyer,
                        paymentRemitter,
                    ];

                    return searchableValues.some(
                        (value) =>
                            String(
                                value ?? ""
                            )
                                .toLowerCase()
                                .includes(
                                    keyword
                                )
                    );

                }
            );

        }, [
            salesContracts,
            searchTerm,
        ]);


    /* ========================================================
       OPEN ADD MODAL
    ======================================================== */

    const openAddModal =
        () => {

            if (!selectedPOId) {

                toast.warning(
                    "Please select a purchase order first."
                );

                return;
            }

            setSelectedItem(null);
            setFormMode("add");
            setActiveAction("create");
            setShowFormModal(true);

        };


    /* ========================================================
       VIEW SALES CONTRACT
    ======================================================== */

    const handleView =
        async (item) => {

            try {

                setLoading(true);

                const response =
                    await getSalesContractById(
                        item.id
                    );

                const data =
                    response?.data || item;

                setSelectedSalesContract(data);
                setSelectedItem(data);
                setShowDrawer(true);

            } catch (error) {

                console.error(
                    "Failed to load sales contract:",
                    error
                );

                toast.error(
                    "Failed to load sales contract."
                );

            } finally {

                setLoading(false);

            }

        };


    /* ========================================================
       EDIT SALES CONTRACT
    ======================================================== */

    const handleEdit =
        (item) => {

            setSelectedSalesContract(item);
            setSelectedItem(item);

            setFormMode("edit");
            setActiveAction("edit");

            setShowFormModal(true);

        };


    /* ========================================================
       DELETE
       
       There is no delete API for sales contracts.
    ======================================================== */

    const handleDelete =
        () => {

            toast.info(
                "Delete is not available for sales contracts."
            );

        };


    /* ========================================================
       PAYMENT CLEARANCE
    ======================================================== */

    const openPaymentClearance =
        (item) => {

            setSelectedSalesContract(item);
            setSelectedItem(item);

            setFormMode("paymentClearance");
            setActiveAction(
                "paymentClearance"
            );

            setShowFormModal(true);

        };


    /* ========================================================
       SIGNED COPY
    ======================================================== */

    const openSignedCopy =
        (item) => {

            setSelectedSalesContract(item);
            setSelectedItem(item);

            setFormMode("signedCopy");
            setActiveAction(
                "signedCopy"
            );

            setShowFormModal(true);

        };


    /* ========================================================
       FORM SUBMIT
    ======================================================== */

    const handleSubmit =
        async (formData) => {

            if (!selectedPOId) {

                toast.error(
                    "Please select a purchase order."
                );

                return;

            }

            try {

                setSaving(true);


                /* ------------------------------------------------
                   CREATE
                ------------------------------------------------ */

                if (
                    formMode === "add"
                ) {

                    const payload = {
                        legalBuyerPartyId:
                            formData.legalBuyerPartyId,

                        paymentRemitterPartyId:
                            formData.paymentRemitterPartyId,

                        paymentMethod:
                            formData.paymentMethod,

                        ...(formData.salesContractNumber
                            ? {
                                salesContractNumber:
                                    formData.salesContractNumber,
                            }
                            : {}),

                        ...(formData.paymentStatus
                            ? {
                                paymentStatus:
                                    formData.paymentStatus,
                            }
                            : {}),

                        signedScReceived:
                            Boolean(
                                formData.signedScReceived
                            ),

                        ...(formData.verifiedByAccountsId
                            ? {
                                verifiedByAccountsId:
                                    formData.verifiedByAccountsId,
                            }
                            : {}),
                    };


                    await createSalesContract(
                        selectedPOId,
                        payload
                    );


                    toast.success(
                        "Sales contract created successfully."
                    );

                }


                /* ------------------------------------------------
                   EDIT
                   
                   There is no generic PATCH route.
                   Therefore we use the two available
                   specialized update APIs.
                ------------------------------------------------ */

                else if (
                    formMode === "edit"
                ) {

                    const contractId =
                        selectedSalesContract?.id;

                    if (!contractId) {

                        toast.error(
                            "Sales contract ID is missing."
                        );

                        return;

                    }


                    let updatedSomething =
                        false;


                    if (
                        formData.paymentStatus
                    ) {

                        await updateSalesContractPaymentClearance(
                            contractId,
                            {
                                paymentStatus:
                                    formData.paymentStatus,

                                ...(formData.verifiedByAccountsId
                                    ? {
                                        verifiedByAccountsId:
                                            formData.verifiedByAccountsId,
                                    }
                                    : {}),
                            }
                        );

                        updatedSomething =
                            true;

                    }


                    if (
                        typeof formData.signedScReceived ===
                        "boolean"
                    ) {

                        await updateSalesContractSignedCopy(
                            contractId,
                            {
                                signedScReceived:
                                    Boolean(
                                        formData.signedScReceived
                                    ),
                            }
                        );

                        updatedSomething =
                            true;

                    }


                    if (!updatedSomething) {

                        toast.info(
                            "No update was required."
                        );

                    } else {

                        toast.success(
                            "Sales contract updated successfully."
                        );

                    }

                }


                /* ------------------------------------------------
                   PAYMENT CLEARANCE
                ------------------------------------------------ */

                else if (
                    formMode ===
                    "paymentClearance"
                ) {

                    const contractId =
                        selectedSalesContract?.id;

                    if (!contractId) {

                        toast.error(
                            "Sales contract ID is missing."
                        );

                        return;

                    }


                    await updateSalesContractPaymentClearance(
                        contractId,
                        {
                            paymentStatus:
                                formData.paymentStatus,

                            ...(formData.verifiedByAccountsId
                                ? {
                                    verifiedByAccountsId:
                                        formData.verifiedByAccountsId,
                                }
                                : {}),
                        }
                    );


                    toast.success(
                        "Payment clearance updated successfully."
                    );

                }


                /* ------------------------------------------------
                   SIGNED COPY
                ------------------------------------------------ */

                else if (
                    formMode ===
                    "signedCopy"
                ) {

                    const contractId =
                        selectedSalesContract?.id;

                    if (!contractId) {

                        toast.error(
                            "Sales contract ID is missing."
                        );

                        return;

                    }


                    await updateSalesContractSignedCopy(
                        contractId,
                        {
                            signedScReceived:
                                Boolean(
                                    formData.signedScReceived
                                ),
                        }
                    );


                    toast.success(
                        "Signed copy status updated successfully."
                    );

                }


                setShowFormModal(false);

                setSelectedItem(null);


                await loadSalesContracts(
                    selectedPOId
                );

            } catch (error) {

                console.error(
                    "Sales contract operation failed:",
                    error
                );

                const message =
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Operation failed.";

                toast.error(message);

            } finally {

                setSaving(false);

            }

        };


    /* ========================================================
       CLOSE MODAL
    ======================================================== */

    const closeModal =
        () => {

            setShowFormModal(false);
            setSelectedItem(null);
            setFormMode("add");

        };


    /* ========================================================
       CLOSE DRAWER
    ======================================================== */

    const closeDrawer =
        () => {

            setShowDrawer(false);
            setSelectedSalesContract(null);

        };


    /* ========================================================
       CURRENT FORM
    ======================================================== */

    const currentFields =
        formMode === "paymentClearance"
            ? dynamicPaymentClearanceFields
            : formMode === "signedCopy"
            ? signedCopyFields
            : dynamicSalesContractFields;


    const currentTitle =
        formMode === "add"
            ? "Create Sales Contract"
            : formMode === "paymentClearance"
            ? "Payment Clearance"
            : formMode === "signedCopy"
            ? "Signed Copy"
            : "Edit Sales Contract";


    /* ========================================================
       TABLE ACTION HANDLERS
       
       We use the standard CrudTable actions and then
       expose the specialized actions separately.
    ======================================================== */

    const actionItems =
        filteredData;


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
                        Sales Contract Service
                    </h1>

                    <p>
                        Manage sales contracts,
                        payment clearance and
                        signed contract copies
                    </p>
                </div>


                <button
                    className="primary-btn"
                    onClick={openAddModal}
                    disabled={
                        !selectedPOId ||
                        loading
                    }
                >
                    Add Sales Contract
                </button>

            </div>


            {/* ==================================================
               SELECTION BAR
            ================================================== */}

            <div className="selection-bar">

                <div className="selection-group">

                    <label>
                        Select Purchase Order
                    </label>

                    <select
                        value={selectedPOId}
                        onChange={(e) =>
                            setSelectedPOId(
                                e.target.value
                            )
                        }
                        disabled={loading}
                    >

                        <option value="">
                            Select a purchase order
                        </option>

                        {poOptions.map(
                            (po) => (
                                <option
                                    key={po.value}
                                    value={po.value}
                                >
                                    {po.label}
                                </option>
                            )
                        )}

                    </select>

                </div>


                <div className="selection-group">

                    <label>
                        Action
                    </label>

                    <select
                        value={activeAction}
                        onChange={(e) => {

                            const value =
                                e.target.value;

                            setActiveAction(value);


                            if (
                                value ===
                                "create"
                            ) {

                                openAddModal();

                            }

                        }}
                        disabled={
                            !selectedPOId
                        }
                    >

                        <option value="view">
                            View Sales Contracts
                        </option>

                        <option value="create">
                            Create Sales Contract
                        </option>

                    </select>

                </div>

            </div>


            {/* ==================================================
               NO PO SELECTED
            ================================================== */}

            {!selectedPOId && (

                <div className="empty-state">

                    <h3>
                        Select a Purchase Order
                    </h3>

                    <p>
                        Select a purchase order
                        above to view and manage
                        its sales contracts.
                    </p>

                </div>

            )}


            {/* ==================================================
               LOADING
            ================================================== */}

            {selectedPOId &&
                loading && (

                    <div className="loading-state">
                        Loading sales contracts...
                    </div>

                )}


            {/* ==================================================
               CONTRACT TABLE
            ================================================== */}

            {selectedPOId &&
                !loading && (

                    <>

                        {actionItems.length > 0 ? (

                            <CrudTable
                                columns={
                                    salesContractColumns
                                }
                                data={
                                    actionItems
                                }
                                onView={
                                    handleView
                                }
                                onEdit={
                                    handleEdit
                                }
                                onDelete={
                                    handleDelete
                                }
                            />

                        ) : (

                            <div className="empty-state">

                                <h3>
                                    No Sales Contracts Found
                                </h3>

                                <p>
                                    This purchase order
                                    does not have any
                                    sales contracts yet.
                                </p>

                                <button
                                    className="primary-btn"
                                    onClick={
                                        openAddModal
                                    }
                                >
                                    Create Sales Contract
                                </button>

                            </div>

                        )}

                    </>

                )}


            {/* ==================================================
               EXTRA ACTIONS
               
               Payment clearance and signed-copy are
               separate APIs, so they are exposed here.
            ================================================== */}

            {selectedPOId &&
                !loading &&
                salesContracts.length > 0 && (

                    <div
                        className="selection-bar"
                        style={{
                            marginTop: "20px",
                        }}
                    >

                        <div className="selection-group">

                            <label>
                                Payment Clearance
                            </label>

                            <select
                                value=""
                                onChange={(e) => {

                                    const contractId =
                                        e.target.value;

                                    if (
                                        !contractId
                                    ) {
                                        return;
                                    }

                                    const contract =
                                        salesContracts.find(
                                            (item) =>
                                                item.id ===
                                                contractId
                                        );

                                    if (
                                        contract
                                    ) {
                                        openPaymentClearance(
                                            contract
                                        );
                                    }

                                }}
                            >

                                <option value="">
                                    Select sales contract
                                </option>

                                {salesContracts.map(
                                    (contract) => (

                                        <option
                                            key={
                                                contract.id
                                            }
                                            value={
                                                contract.id
                                            }
                                        >
                                            {
                                                contract.salesContractNumber
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="selection-group">

                            <label>
                                Signed Copy
                            </label>

                            <select
                                value=""
                                onChange={(e) => {

                                    const contractId =
                                        e.target.value;

                                    if (
                                        !contractId
                                    ) {
                                        return;
                                    }

                                    const contract =
                                        salesContracts.find(
                                            (item) =>
                                                item.id ===
                                                contractId
                                        );

                                    if (
                                        contract
                                    ) {
                                        openSignedCopy(
                                            contract
                                        );
                                    }

                                }}
                            >

                                <option value="">
                                    Select sales contract
                                </option>

                                {salesContracts.map(
                                    (contract) => (

                                        <option
                                            key={
                                                contract.id
                                            }
                                            value={
                                                contract.id
                                            }
                                        >
                                            {
                                                contract.salesContractNumber
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>

                )}


            {/* ==================================================
               SEARCH
               
               Kept here in case CrudToolbar is not handling
               search internally in your current implementation.
            ================================================== */}

            {/*selectedPOId &&
                !loading &&
                salesContracts.length > 0 && (

                    <CrudToolbar
                        searchTerm={
                            searchTerm
                        }
                        onSearchChange={
                            setSearchTerm
                        }
                    />

                )*/}


            {/* ==================================================
               FORM MODAL
            ================================================== */}

            <CrudFormModal
                title={currentTitle}
                fields={currentFields}
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
                    selectedSalesContract
                }
                loading={saving}
                onClose={
                    closeModal
                }
                onSubmit={
                    handleSubmit
                }
            />


            {/* ==================================================
               DRAWER
               
               Keeping your existing drawer so the dashboard
               remains compatible with the current project.
            ================================================== */}

            <ViewPartyDrawer
                isOpen={
                    showDrawer
                }
                party={
                    selectedSalesContract
                }
                onClose={
                    closeDrawer
                }
            />

        </div>
    );
};


export default SalesContractServiceDashboard;