import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { toast } from "react-toastify";

import {
    getAllInquiries,

    getSamplesByInquiryId,
    createSample,
    getSampleById,
    updateSample,
    approveSampleDispatch,

    addSampleLedgerCost,
    getSampleLedgerCosts,

    getAllUsers,
} from "../../services/marketingApi";

import CrudToolbar from "../../components/common/marketing/CrudToolbar";
import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";

import "../../styles/marketing/partyService/dashboard.css";


/* ============================================================
   SAMPLE COLUMNS
============================================================ */

const sampleColumns = [
    {
        key: "sampleType",
        label: "Sample Type",
    },
    {
        key: "pricingPosition",
        label: "Pricing Position",
    },
    {
        key: "counterSampleBinLocation",
        label: "Bin Location",
    },
    {
        key: "isPhotoSampleDisclaimerSigned",
        label: "Photo Disclaimer",
    },
    {
        key: "customerOutcome",
        label: "Customer Outcome",
    },
    {
        key: "courierTrackingNo",
        label: "Tracking No.",
    },
    {
        key: "createdAt",
        label: "Created At",
    },
];


/* ============================================================
   LEDGER COST COLUMNS
============================================================ */

const ledgerCostColumns = [
    {
        key: "cashOutlayPaid",
        label: "Cash Outlay Paid",
    },
    {
        key: "actualCostConsumed",
        label: "Actual Cost Consumed",
    },
    {
        key: "unbilledLiability",
        label: "Unbilled Liability",
    },
    {
        key: "recoveryStatus",
        label: "Recovery Status",
    },
    {
        key: "createdAt",
        label: "Created At",
    },
];


/* ============================================================
   SAMPLE FORM FIELDS
============================================================ */

// const sampleFields = [
//     {
//         name: "sampleType",
//         label: "Sample Type",
//         type: "select",
//         required: true,
//         placeholder: "Select sample type",
//         options: [
//             {
//                 value: "DEVELOPMENT",
//                 label: "Development",
//             },
//             {
//                 value: "PROTO",
//                 label: "Proto",
//             },
//             {
//                 value: "FIT",
//                 label: "Fit",
//             },
//             {
//                 value: "PHOTO",
//                 label: "Photo",
//             },
//             {
//                 value: "COUNTER",
//                 label: "Counter",
//             },
//             {
//                 value: "PRE_PRODUCTION",
//                 label: "Pre Production",
//             },
//         ],
//     },

//     {
//         name: "pricingPosition",
//         label: "Pricing Position",
//         type: "select",
//         required: true,
//         placeholder: "Select pricing position",
//         options: [
//             {
//                 value: "PAID_BY_CUSTOMER",
//                 label: "Paid by Customer",
//             },
//             {
//                 value: "FREE_OF_COST",
//                 label: "Free of Cost",
//             },
//             {
//                 value: "REIMBURSABLE_ON_ORDER",
//                 label: "Reimbursable on Order",
//             },
//         ],
//     },

//     {
//         name: "counterSampleBinLocation",
//         label: "Counter Sample Bin Location",
//         type: "text",
//         required: true,
//         placeholder: "e.g. BIN-A-42",
//     },

//     {
//         name: "isPhotoSampleDisclaimerSigned",
//         label: "Photo Sample Disclaimer Signed",
//         type: "checkbox",
//         required: false,
//     },

//     {
//         name: "dispatchApproverId",
//         label: "Dispatch Approver ID",
//         type: "text",
//         required: false,
//         placeholder: "Optional user ID",
//     },

//     {
//         name: "courierTrackingNo",
//         label: "Courier Tracking No.",
//         type: "text",
//         required: false,
//         placeholder: "e.g. DHL-123456789",
//     },

//     {
//         name: "customerOutcome",
//         label: "Customer Outcome",
//         type: "select",
//         required: false,
//         placeholder: "Select customer outcome",
//         options: [
//             {
//                 value: "RESPONSE_PENDING",
//                 label: "Response Pending",
//             },
//             {
//                 value: "APPROVED",
//                 label: "Approved",
//             },
//             {
//                 value: "REJECTED",
//                 label: "Rejected",
//             },
//             {
//                 value: "REVISION_REQUESTED",
//                 label: "Revision Requested",
//             },
//         ],
//     },
// ];


/* ============================================================
   DISPATCH APPROVAL FIELDS
============================================================ */

// const dispatchApprovalFields = [
//     {
//         name: "dispatchApproverId",
//         label: "Dispatch Approver ID",
//         type: "text",
//         required: true,
//         placeholder: "Enter user ID",
//     },

//     {
//         name: "courierTrackingNo",
//         label: "Courier Tracking No.",
//         type: "text",
//         required: false,
//         placeholder: "Optional tracking number",
//     },
// ];


/* ============================================================
   LEDGER COST FORM FIELDS
============================================================ */

const ledgerCostFields = [
    {
        name: "cashOutlayPaid",
        label: "Cash Outlay Paid",
        type: "number",
        required: true,
        placeholder: "Enter cash outlay paid",
    },

    {
        name: "actualCostConsumed",
        label: "Actual Cost Consumed",
        type: "number",
        required: true,
        placeholder: "Enter actual cost consumed",
    },

    {
        name: "unbilledLiability",
        label: "Unbilled Liability",
        type: "number",
        required: true,
        placeholder: "Enter unbilled liability",
    },

    {
        name: "recoveryStatus",
        label: "Recovery Status",
        type: "select",
        required: false,
        placeholder: "Select recovery status",
        options: [
            {
                value: "BBTI_EXPENSE",
                label: "BBTI Expense",
            },
            {
                value: "BILLED_TO_CUSTOMER",
                label: "Billed to Customer",
            },
            {
                value: "RECOVERED",
                label: "Recovered",
            },
        ],
    },
];

/* ============================================================
   AUTO GENERATED SAMPLE VALUES
============================================================ */

const generateRandomNumber = (length = 4) => {
    return Math.floor(
        Math.random() * Math.pow(10, length)
    )
        .toString()
        .padStart(length, "0");
};


const generateBinLocation = () => {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `BIN-${year}${month}${day}-${generateRandomNumber(4)}`;
};


const generateTrackingNumber = () => {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `TRK-${year}${month}${day}-${generateRandomNumber(6)}`;
};

/* ============================================================
   COMPONENT
============================================================ */

const SampleServiceDashboard = () => {

    /* --------------------------------------------------------
       INQUIRIES
    -------------------------------------------------------- */

    const [inquiries, setInquiries] = useState([]);

    const [selectedInquiryId, setSelectedInquiryId] =
        useState("");


    /* --------------------------------------------------------
   USERS
-------------------------------------------------------- */

    const [users, setUsers] = useState([]);


    /* --------------------------------------------------------
       SAMPLES
    -------------------------------------------------------- */

    const [samples, setSamples] = useState([]);

    const [selectedSample, setSelectedSample] =
        useState(null);


    /* --------------------------------------------------------
       LEDGER COSTS
    -------------------------------------------------------- */

    const [ledgerCosts, setLedgerCosts] =
        useState([]);



    /* --------------------------------------------------------
       ACTIVE VIEW
       
       sample
       ledgerCost
    -------------------------------------------------------- */

    const [activeType, setActiveType] =
        useState("sample");


    /* --------------------------------------------------------
       ACTION
    -------------------------------------------------------- */

    const [selectedAction, setSelectedAction] =
        useState("");


    /* --------------------------------------------------------
       UI STATE
    -------------------------------------------------------- */

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

    const [formMode, setFormMode] =
        useState("add");

    const [modalType, setModalType] =
        useState("sample");


    /* ========================================================
       INQUIRY OPTIONS
    ======================================================== */

    const inquiryOptions = useMemo(() => {

        return inquiries.map((inquiry) => {

            const customerName =
                inquiry.customer?.legalName ||
                inquiry.customer?.name ||
                inquiry.customerId ||
                "";

            return {
                value: inquiry.id,

                label:
                    `${inquiry.icnNumber || "No ICN"}`
                    +
                    (
                        customerName
                            ? ` - ${customerName}`
                            : ""
                    ),
            };
        });

    }, [inquiries]);

    /* ========================================================
   USER OPTIONS
======================================================== */

    const userOptions = useMemo(() => {

        return users.map((user) => {

            const name =
                user.name ||
                user.username ||
                "Unnamed User";

            const email =
                user.email ||
                "";

            return {
                value: user.id,

                label:
                    email
                        ? `${name} - ${email}`
                        : name,
            };

        });

    }, [users]);


    /* ========================================================
   DYNAMIC SAMPLE FORM FIELDS
======================================================== */

    const activeSampleFields = [
        {
            name: "sampleType",
            label: "Sample Type",
            type: "select",
            required: true,
            placeholder: "Select sample type",
            options: [
                {
                    value: "DEVELOPMENT",
                    label: "Development",
                },
                {
                    value: "PROTO",
                    label: "Proto",
                },
                {
                    value: "FIT",
                    label: "Fit",
                },
                {
                    value: "PHOTO",
                    label: "Photo",
                },
                {
                    value: "COUNTER",
                    label: "Counter",
                },
                {
                    value: "PRE_PRODUCTION",
                    label: "Pre Production",
                },
            ],
        },

        {
            name: "pricingPosition",
            label: "Pricing Position",
            type: "select",
            required: true,
            placeholder: "Select pricing position",
            options: [
                {
                    value: "PAID_BY_CUSTOMER",
                    label: "Paid by Customer",
                },
                {
                    value: "FREE_OF_COST",
                    label: "Free of Cost",
                },
                {
                    value: "REIMBURSABLE_ON_ORDER",
                    label: "Reimbursable on Order",
                },
            ],
        },

        {
            name: "counterSampleBinLocation",
            label: "Counter Sample Bin Location",
            type: "text",
            required: true,
            placeholder: "Auto-generated, editable",
        },

        {
            name: "isPhotoSampleDisclaimerSigned",
            label: "Photo Sample Disclaimer Signed",
            type: "checkbox",
            required: false,
        },

        {
            name: "dispatchApproverId",
            label: "Dispatch Approver",
            type: "select",
            required: false,
            placeholder: "Select dispatch approver",
            options: userOptions,
        },

        {
            name: "courierTrackingNo",
            label: "Courier Tracking No.",
            type: "text",
            required: false,
            placeholder: "Auto-generated, editable",
        },

        {
            name: "customerOutcome",
            label: "Customer Outcome",
            type: "select",
            required: false,
            placeholder: "Select customer outcome",
            options: [
                {
                    value: "RESPONSE_PENDING",
                    label: "Response Pending",
                },
                {
                    value: "APPROVED",
                    label: "Approved",
                },
                {
                    value: "REJECTED",
                    label: "Rejected",
                },
                {
                    value: "REVISION_REQUESTED",
                    label: "Revision Requested",
                },
            ],
        },
    ];

    /* ========================================================
   DYNAMIC DISPATCH APPROVAL FIELDS
======================================================== */

    const activeDispatchApprovalFields = [
        {
            name: "dispatchApproverId",
            label: "Dispatch Approver",
            type: "select",
            required: true,
            placeholder: "Select dispatch approver",
            options: userOptions,
        },

        {
            name: "courierTrackingNo",
            label: "Courier Tracking No.",
            type: "text",
            required: false,
            placeholder: "Auto-generated, editable",
        },
    ];

    /* ========================================================
   LOAD USERS
======================================================== */

    const loadUsers = async () => {

        try {

            const response =
                await getAllUsers();

            const data =
                response?.data || [];

            setUsers(data);

        } catch (error) {

            console.error(
                "Failed to load users:",
                error
            );

            toast.error(
                "Failed to load users."
            );

            setUsers([]);
        }
    };
    /* ========================================================
       LOAD INQUIRIES
    ======================================================== */

    const loadInquiries = async () => {

        try {

            setLoading(true);

            const response =
                await getAllInquiries();

            const data =
                response?.data || [];

            setInquiries(data);

        } catch (error) {

            console.error(
                "Failed to load inquiries:",
                error
            );

            toast.error(
                "Failed to load inquiries."
            );

        } finally {

            setLoading(false);

        }
    };


    /* ========================================================
       LOAD SAMPLES
    ======================================================== */

    const loadSamples = async (
        inquiryId
    ) => {

        if (!inquiryId) {

            setSamples([]);
            setSelectedSample(null);
            setLedgerCosts([]);

            return;
        }

        try {

            setLoading(true);

            const response =
                await getSamplesByInquiryId(
                    inquiryId
                );

            const data =
                response?.data || [];

            setSamples(data);

            setSelectedSample(null);
            setLedgerCosts([]);

        } catch (error) {

            console.error(
                "Failed to load samples:",
                error
            );

            toast.error(
                "Failed to load samples."
            );

            setSamples([]);
            setSelectedSample(null);
            setLedgerCosts([]);

        } finally {

            setLoading(false);

        }
    };


    /* ========================================================
       LOAD LEDGER COSTS
    ======================================================== */

    const loadLedgerCosts = async (
        sampleId
    ) => {

        if (!sampleId) {

            setLedgerCosts([]);

            return;
        }

        try {

            setLoading(true);

            const response =
                await getSampleLedgerCosts(
                    sampleId
                );

            setLedgerCosts(
                response?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load ledger costs:",
                error
            );

            toast.error(
                "Failed to load ledger costs."
            );

            setLedgerCosts([]);

        } finally {

            setLoading(false);

        }
    };


    /* ========================================================
       INITIAL LOAD
    ======================================================== */

    useEffect(() => {

        loadInquiries();
        loadUsers();

    }, []);


    /* ========================================================
       INQUIRY CHANGE
    ======================================================== */

    const handleInquiryChange = (
        event
    ) => {

        const inquiryId =
            event.target.value;

        setSelectedInquiryId(
            inquiryId
        );

        setSelectedAction("");

        setActiveType("sample");

        setSamples([]);

        setSelectedSample(null);

        setLedgerCosts([]);

        if (inquiryId) {

            loadSamples(
                inquiryId
            );
        }
    };


    /* ========================================================
       ACTION CHANGE
    ======================================================== */

    const handleActionChange = async (
        event
    ) => {

        const action =
            event.target.value;

        setSelectedAction(
            action
        );

        if (
            action === "viewSamples"
        ) {

            setActiveType("sample");

            setSelectedSample(null);

            setLedgerCosts([]);

            if (selectedInquiryId) {

                await loadSamples(
                    selectedInquiryId
                );
            }

            return;
        }


        if (
            action === "viewLedgerCosts"
        ) {

            if (!selectedSample) {

                toast.warning(
                    "Please select a sample first."
                );

                return;
            }

            setActiveType(
                "ledgerCost"
            );

            await loadLedgerCosts(
                selectedSample.id
            );

            return;
        }


        if (
            action === "createSample"
        ) {

            openAddSampleModal();

            return;
        }


        if (
            action === "addLedgerCost"
        ) {

            if (!selectedSample) {

                toast.warning(
                    "Please select a sample first."
                );

                return;
            }

            openAddLedgerCostModal();

            return;
        }


        if (
            action === "dispatchApproval"
        ) {

            if (!selectedSample) {

                toast.warning(
                    "Please select a sample first."
                );

                return;
            }

            openDispatchApprovalModal();

        }
    };


    /* ========================================================
       OPEN ADD SAMPLE
    ======================================================== */

    const openAddSampleModal = () => {

        if (!selectedInquiryId) {

            toast.warning(
                "Please select an inquiry first."
            );

            return;
        }

        setModalType("sample");

        setFormMode("add");

        setSelectedItem({

            counterSampleBinLocation:
                generateBinLocation(),

            courierTrackingNo:
                generateTrackingNumber(),

        });

        setShowFormModal(true);
    };


    /* ========================================================
       OPEN EDIT SAMPLE
    ======================================================== */

    const handleEdit = async (
        sample
    ) => {

        try {

            setSaving(true);

            const response =
                await getSampleById(
                    sample.id
                );

            const data =
                response?.data ||
                sample;

            setSelectedItem(data);

            setModalType("sample");

            setFormMode("edit");

            setShowFormModal(true);

        } catch (error) {

            console.error(
                "Failed to load sample:",
                error
            );

            toast.error(
                "Failed to load sample."
            );

        } finally {

            setSaving(false);

        }
    };


    /* ========================================================
       VIEW SAMPLE
    ======================================================== */

    const handleView = async (
        sample
    ) => {

        try {

            setSaving(true);

            const response =
                await getSampleById(
                    sample.id
                );

            const data =
                response?.data ||
                sample;

            setSelectedSample(
                data
            );

            /*
             * Switch to sample view.
             */

            setActiveType(
                "sample"
            );

            /*
             * For the reusable dashboard,
             * use the form modal as the
             * detailed view.
             */

            setSelectedItem(
                data
            );

            setModalType(
                "sample"
            );

            setFormMode(
                "view"
            );

            setShowFormModal(
                true
            );

        } catch (error) {

            console.error(
                "Failed to load sample:",
                error
            );

            toast.error(
                "Failed to load sample."
            );

        } finally {

            setSaving(false);

        }
    };


    /* ========================================================
       DELETE
       
       No DELETE API was provided for samples.
       Therefore we intentionally do nothing.
    ======================================================== */

    const handleDelete = () => {

        toast.info(
            "Delete operation is not available for samples."
        );
    };


    /* ========================================================
       SELECT SAMPLE FOR CHILD ACTIONS
    ======================================================== */

    const handleSampleSelect = (
        sample
    ) => {

        setSelectedSample(
            sample
        );

        setActiveType(
            "sample"
        );

        /*
         * Once a sample is selected,
         * ledger actions become available.
         */

        setSelectedAction("");
    };


    /* ========================================================
       OPEN DISPATCH APPROVAL
    ======================================================== */

    const openDispatchApprovalModal = () => {

        if (!selectedSample) {

            toast.warning(
                "Please select a sample first."
            );

            return;
        }

        setModalType("dispatch");

        setFormMode("add");

        setSelectedItem({

            dispatchApproverId:
                "",

            courierTrackingNo:
                selectedSample.courierTrackingNo ||
                generateTrackingNumber(),

        });

        setShowFormModal(true);
    };


    /* ========================================================
       OPEN LEDGER COST MODAL
    ======================================================== */

    const openAddLedgerCostModal = () => {

        if (!selectedSample) {

            toast.warning(
                "Please select a sample first."
            );

            return;
        }

        setModalType(
            "ledger"
        );

        setFormMode(
            "add"
        );

        setSelectedItem(
            null
        );

        setShowFormModal(
            true
        );
    };


    /* ========================================================
       FORM SUBMIT
    ======================================================== */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setSaving(true);


            /* ------------------------------------------------
               CREATE SAMPLE
            ------------------------------------------------ */

            if (
                modalType === "sample" &&
                formMode === "add"
            ) {

                if (!selectedInquiryId) {

                    toast.error(
                        "Please select an inquiry first."
                    );

                    return;
                }

                await createSample(
                    selectedInquiryId,
                    formData
                );

                toast.success(
                    "Sample created successfully."
                );

                setShowFormModal(
                    false
                );

                await loadSamples(
                    selectedInquiryId
                );

                return;
            }


            /* ------------------------------------------------
               UPDATE SAMPLE
            ------------------------------------------------ */

            if (
                modalType === "sample" &&
                formMode === "edit"
            ) {

                if (!selectedItem?.id) {

                    toast.error(
                        "Sample ID is missing."
                    );

                    return;
                }

                await updateSample(
                    selectedItem.id,
                    formData
                );

                toast.success(
                    "Sample updated successfully."
                );

                setShowFormModal(
                    false
                );

                await loadSamples(
                    selectedInquiryId
                );

                return;
            }


            /* ------------------------------------------------
               DISPATCH APPROVAL
            ------------------------------------------------ */

            if (
                modalType === "dispatch"
            ) {

                if (!selectedSample?.id) {

                    toast.error(
                        "Please select a sample first."
                    );

                    return;
                }

                await approveSampleDispatch(
                    selectedSample.id,
                    formData
                );

                toast.success(
                    "Dispatch approval completed successfully."
                );

                setShowFormModal(
                    false
                );

                /*
                 * Refresh samples so the
                 * dispatch information appears.
                 */

                await loadSamples(
                    selectedInquiryId
                );

                /*
                 * Refresh selected sample.
                 */

                try {

                    const response =
                        await getSampleById(
                            selectedSample.id
                        );

                    setSelectedSample(
                        response?.data ||
                        selectedSample
                    );

                } catch {
                    // Ignore refresh error.
                }

                return;
            }


            /* ------------------------------------------------
               ADD LEDGER COST
            ------------------------------------------------ */

            if (
                modalType === "ledger"
            ) {

                if (!selectedSample?.id) {

                    toast.error(
                        "Please select a sample first."
                    );

                    return;
                }

                await addSampleLedgerCost(
                    selectedSample.id,
                    formData
                );

                toast.success(
                    "Ledger cost added successfully."
                );

                setShowFormModal(
                    false
                );

                setActiveType(
                    "ledgerCost"
                );

                await loadLedgerCosts(
                    selectedSample.id
                );

                return;
            }

        } catch (error) {

            console.error(
                "Form submission failed:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Operation failed."
            );

        } finally {

            setSaving(false);

        }
    };


    /* ========================================================
       CLOSE MODAL
    ======================================================== */

    const closeModal = () => {

        setShowFormModal(
            false
        );

        setSelectedItem(
            null
        );

        setModalType(
            "sample"
        );

        setFormMode(
            "add"
        );
    };


    /* ========================================================
       TABLE DATA
    ======================================================== */

    const tableData =
        activeType === "sample"
            ? samples
            : ledgerCosts;


    /* ========================================================
       TABLE COLUMNS
    ======================================================== */

    const columns =
        activeType === "sample"
            ? sampleColumns
            : ledgerCostColumns;


    /* ========================================================
       SEARCH
    ======================================================== */

    const filteredData =
        useMemo(() => {

            if (
                !searchTerm.trim()
            ) {

                return tableData;
            }

            const keyword =
                searchTerm
                    .toLowerCase()
                    .trim();


            return tableData.filter(
                (item) => {

                    const searchableValues = [

                        item.sampleType,

                        item.pricingPosition,

                        item.counterSampleBinLocation,

                        item.customerOutcome,

                        item.courierTrackingNo,

                        item.recoveryStatus,

                        item.cashOutlayPaid,

                        item.actualCostConsumed,

                        item.unbilledLiability,

                        item.createdAt,

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
            tableData,
            searchTerm,
        ]);


    /* ========================================================
       FORM CONFIGURATION
    ======================================================== */

    const activeFormFields =
        modalType === "sample"
            ? activeSampleFields
            : modalType === "dispatch"
                ? activeDispatchApprovalFields
                : ledgerCostFields;


    const activeFormTitle =
        modalType === "sample"
            ? "Sample"
            : modalType === "dispatch"
                ? "Dispatch Approval"
                : "Ledger Cost";


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
                        Sample Service
                    </h1>

                    <p>
                        Manage samples, dispatch approvals
                        and sample ledger costs
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={
                        activeType === "sample"
                            ? openAddSampleModal
                            : openAddLedgerCostModal
                    }
                    disabled={
                        !selectedInquiryId ||
                        (
                            activeType ===
                            "ledgerCost" &&
                            !selectedSample
                        )
                    }
                >

                    {activeType === "sample"
                        ? "Add Sample"
                        : "Add Ledger Cost"
                    }

                </button>

            </div>


            {/* ==================================================
                SELECTION BAR
            ================================================== */}

            <div className="selection-bar">


                {/* ----------------------------------------------
                    INQUIRY
                ---------------------------------------------- */}

                <div className="selection-group">

                    <label>
                        Select Inquiry
                    </label>

                    <select
                        value={
                            selectedInquiryId
                        }
                        onChange={
                            handleInquiryChange
                        }
                    >

                        <option value="">
                            Select an inquiry
                        </option>

                        {inquiryOptions.map(
                            (inquiry) => (

                                <option
                                    key={
                                        inquiry.value
                                    }
                                    value={
                                        inquiry.value
                                    }
                                >
                                    {
                                        inquiry.label
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* ----------------------------------------------
                    ACTION
                ---------------------------------------------- */}

                <div className="selection-group">

                    <label>
                        Action
                    </label>

                    <select
                        value={
                            selectedAction
                        }
                        onChange={
                            handleActionChange
                        }
                        disabled={
                            !selectedInquiryId
                        }
                    >

                        <option value="">
                            Select action
                        </option>

                        <option value="viewSamples">
                            View Samples
                        </option>

                        <option value="createSample">
                            Create Sample
                        </option>

                        <option value="dispatchApproval">
                            Dispatch Approval
                        </option>

                        <option value="viewLedgerCosts">
                            View Ledger Costs
                        </option>

                        <option value="addLedgerCost">
                            Add Ledger Cost
                        </option>

                    </select>

                </div>


                {/* ----------------------------------------------
                    SELECT SAMPLE
                ---------------------------------------------- */}

                <div className="selection-group">

                    <label>
                        Select Sample
                    </label>

                    <select
                        value={
                            selectedSample?.id ||
                            ""
                        }
                        onChange={
                            (event) => {

                                const sample =
                                    samples.find(
                                        (item) =>
                                            item.id ===
                                            event.target.value
                                    );

                                handleSampleSelect(
                                    sample ||
                                    null
                                );
                            }
                        }
                        disabled={
                            !selectedInquiryId ||
                            samples.length === 0
                        }
                    >

                        <option value="">
                            Select a sample
                        </option>

                        {samples.map(
                            (sample) => (

                                <option
                                    key={
                                        sample.id
                                    }
                                    value={
                                        sample.id
                                    }
                                >

                                    {
                                        sample.sampleType
                                    }

                                    {" - "}

                                    {
                                        sample.counterSampleBinLocation ||
                                        "No Bin"
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* ==================================================
                SELECTED SAMPLE INFO
            ================================================== */}

            {selectedSample &&
                activeType === "ledgerCost" && (

                    <div className="selection-bar">

                        <div className="selection-group">

                            <label>
                                Selected Sample
                            </label>

                            <div>
                                {
                                    selectedSample.sampleType
                                }
                            </div>

                        </div>


                        <div className="selection-group">

                            <label>
                                Pricing Position
                            </label>

                            <div>
                                {
                                    selectedSample.pricingPosition
                                }
                            </div>

                        </div>


                        <div className="selection-group">

                            <label>
                                Customer Outcome
                            </label>

                            <div>
                                {
                                    selectedSample.customerOutcome
                                }
                            </div>

                        </div>

                    </div>
                )
            }


            {/* ==================================================
                NO INQUIRY
            ================================================== */}

            {!selectedInquiryId && (

                <div className="empty-state">

                    <h3>
                        Select an Inquiry
                    </h3>

                    <p>
                        Select an inquiry above to view
                        and manage its samples.
                    </p>

                </div>

            )}


            {/* ==================================================
                LOADING
            ================================================== */}

            {selectedInquiryId &&
                loading && (

                    <div className="loading-state">

                        Loading
                        {" "}
                        {
                            activeType === "sample"
                                ? "samples"
                                : "ledger costs"
                        }
                        ...

                    </div>
                )
            }


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            {selectedInquiryId &&
                !loading && (

                    <>

                        {/* --------------------------------------
                            VIEW HEADER
                        -------------------------------------- */}

                        <div
                            className="dashboard-header"
                            style={{
                                marginTop: "20px",
                            }}
                        >

                            <div>

                                <h2>
                                    {
                                        activeType ===
                                            "sample"
                                            ? "Samples"
                                            : "Ledger Costs"
                                    }
                                </h2>

                                <p>

                                    {
                                        activeType ===
                                            "sample"
                                            ? `${samples.length} sample(s) found`
                                            : `${ledgerCosts.length} ledger cost record(s) found`
                                    }

                                </p>

                            </div>


                            {/* Search */}

                            <div
                                className="search-container"
                            >

                                <input
                                    type="text"
                                    value={
                                        searchTerm
                                    }
                                    onChange={
                                        (event) =>
                                            setSearchTerm(
                                                event.target.value
                                            )
                                    }
                                    placeholder={
                                        activeType ===
                                            "sample"
                                            ? "Search samples..."
                                            : "Search ledger costs..."
                                    }
                                />

                            </div>

                        </div>


                        {/* --------------------------------------
                            SAMPLE TABLE
                        -------------------------------------- */}

                        {activeType ===
                            "sample" && (

                                <>

                                    <CrudTable
                                        columns={
                                            columns
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
                                        onDelete={
                                            handleDelete
                                        }
                                    />


                                    {samples.length ===
                                        0 && (

                                            <div
                                                className="empty-state"
                                            >

                                                <h3>
                                                    No Samples Found
                                                </h3>

                                                <p>
                                                    This inquiry does not
                                                    have any samples yet.
                                                </p>

                                                <button
                                                    className="primary-btn"
                                                    onClick={
                                                        openAddSampleModal
                                                    }
                                                >
                                                    Create Sample
                                                </button>

                                            </div>
                                        )}

                                </>
                            )}


                        {/* --------------------------------------
                            LEDGER COST TABLE
                        -------------------------------------- */}

                        {activeType ===
                            "ledgerCost" && (

                                <>

                                    {!selectedSample && (

                                        <div
                                            className="empty-state"
                                        >

                                            <h3>
                                                Select a Sample
                                            </h3>

                                            <p>
                                                Select a sample above
                                                to view its ledger costs.
                                            </p>

                                        </div>
                                    )}


                                    {selectedSample && (

                                        <>

                                            <CrudTable
                                                columns={
                                                    ledgerCostColumns
                                                }
                                                data={
                                                    filteredData
                                                }
                                                onView={
                                                    () => { }
                                                }
                                                onEdit={
                                                    () => { }
                                                }
                                                onDelete={
                                                    () => { }
                                                }
                                            />


                                            {ledgerCosts.length ===
                                                0 && (

                                                    <div
                                                        className="empty-state"
                                                    >

                                                        <h3>
                                                            No Ledger Costs Found
                                                        </h3>

                                                        <p>
                                                            This sample does not
                                                            have any ledger costs.
                                                        </p>

                                                        <button
                                                            className="primary-btn"
                                                            onClick={
                                                                openAddLedgerCostModal
                                                            }
                                                        >
                                                            Add Ledger Cost
                                                        </button>

                                                    </div>
                                                )}

                                        </>
                                    )}

                                </>
                            )}

                    </>
                )
            }


            {/* ==================================================
                FORM MODAL
            ================================================== */}

            <CrudFormModal
                title={
                    activeFormTitle
                }

                fields={
                    activeFormFields
                }

                isOpen={
                    showFormModal
                }

                mode={
                    formMode
                }

                initialData={
                    selectedItem
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


        </div>
    );
};


export default SampleServiceDashboard;