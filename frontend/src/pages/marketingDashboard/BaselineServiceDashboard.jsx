import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { toast } from "react-toastify";

import {
    getAllInquiries,

    // Baseline APIs
    getBaselinesByInquiry,
    createBaseline,
    getBaselineById,

    // Feasibility Review APIs
    getFeasibilityReviewsByInquiry,
    createFeasibilityReview,
} from "../../services/marketingApi";

import CrudToolbar from "../../components/common/marketing/CrudToolbar";
import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";

import "../../styles/marketing/partyService/dashboard.css";


/* =========================================================
   BASELINE TABLE COLUMNS
========================================================= */

const baselineColumns = [
    {
        key: "versionNumber",
        label: "Version",
    },
    {
        key: "productCategory",
        label: "Product Category",
    },
    {
        key: "finishedGsmWeight",
        label: "GSM",
    },
    {
        key: "isActive",
        label: "Active",
    },
    {
        key: "createdBy",
        label: "Created By",
    },
    {
        key: "createdAt",
        label: "Created At",
    },
];


/* =========================================================
   FEASIBILITY REVIEW TABLE COLUMNS
========================================================= */

const feasibilityReviewColumns = [
    {
        key: "status",
        label: "Status",
    },
    {
        key: "processRoute",
        label: "Process Route",
    },
    {
        key: "costingMaterialBasis",
        label: "Material Basis",
    },
    {
        key: "leadTimeDays",
        label: "Lead Time",
    },
    {
        key: "technicalRisks",
        label: "Technical Risks",
    },
    {
        key: "evaluatedBy",
        label: "Evaluated By",
    },
    {
        key: "createdAt",
        label: "Created At",
    },
];


/* =========================================================
   BASELINE FORM FIELDS
========================================================= */

const baselineFields = [
    {
        name: "productCategory",
        label: "Product Category",
        type: "text",
        required: true,
        placeholder: "e.g. Terry Towels",
    },

    {
        name: "finishedGsmWeight",
        label: "Finished GSM Weight",
        type: "number",
        required: false,
        placeholder: "e.g. 500",
    },

    {
        name: "size",
        label: "Size",
        type: "text",
        required: true,
        placeholder: "e.g. Bath Towel 70x140",
    },

    {
        name: "color",
        label: "Color",
        type: "text",
        required: true,
        placeholder: "e.g. White",
    },

    {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: true,
        placeholder: "e.g. 5000",
    },

    {
        name: "testingRequirements",
        label: "Testing Requirements",
        type: "textarea",
        required: false,
        placeholder:
            "e.g. Color Fastness ISO-105, Shrinkage AATCC",
    },

    {
        name: "unclearBorderStyle",
        label: "Border Style",
        type: "text",
        required: false,
        placeholder: "e.g. Plain / Jacquard / TBD",
    },

    {
        name: "unclearEmbroideryPlacement",
        label: "Embroidery Placement",
        type: "text",
        required: false,
        placeholder: "e.g. Corner / Center / TBD",
    },

    {
        name: "createdBy",
        label: "Created By",
        type: "text",
        required: true,
        placeholder: "User name",
    },
];


/* =========================================================
   FEASIBILITY REVIEW FORM FIELDS
========================================================= */

const feasibilityReviewFields = [
    {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        placeholder: "Select feasibility status",

        options: [
            {
                value: "PENDING",
                label: "Pending",
            },
            {
                value: "FEASIBLE",
                label: "Feasible",
            },
            {
                value: "FEASIBLE_WITH_RISKS",
                label: "Feasible With Risks",
            },
            {
                value: "NOT_FEASIBLE",
                label: "Not Feasible",
            },
        ],
    },

    {
        name: "processRoute",
        label: "Process Route",
        type: "text",
        required: true,
        placeholder:
            "e.g. Yarn → Weaving → Dyeing → Assembly",
    },

    {
        name: "costingMaterialBasis",
        label: "Costing Material Basis",
        type: "text",
        required: true,
        placeholder:
            "e.g. 20/1 CD Warp + 16/1 OE Weft",
    },

    {
        name: "leadTimeDays",
        label: "Lead Time (Days)",
        type: "number",
        required: true,
        placeholder: "e.g. 45",
    },

    {
        name: "technicalRisks",
        label: "Technical Risks",
        type: "textarea",
        required: false,
        placeholder:
            "Describe any technical risks",
    },

    {
        name: "evaluatedBy",
        label: "Evaluated By",
        type: "text",
        required: true,
        placeholder: "User name",
    },
];


/* =========================================================
   DASHBOARD
========================================================= */

const InquiryServiceDashboard = () => {

    /* -----------------------------------------------------
       INQUIRIES
    ----------------------------------------------------- */

    const [inquiries, setInquiries] = useState([]);

    const [selectedInquiryId, setSelectedInquiryId] =
        useState("");

    /* -----------------------------------------------------
       BASELINES
    ----------------------------------------------------- */

    const [baselines, setBaselines] = useState([]);

    /* -----------------------------------------------------
       FEASIBILITY REVIEWS
    ----------------------------------------------------- */

    const [feasibilityReviews, setFeasibilityReviews] =
        useState([]);

    /* -----------------------------------------------------
       VIEW TYPE
       baseline / feasibility
    ----------------------------------------------------- */

    const [viewType, setViewType] =
        useState("baseline");

    /* -----------------------------------------------------
       SELECTED BASELINE

       Used when creating a feasibility review.
    ----------------------------------------------------- */

    const [selectedBaselineId, setSelectedBaselineId] =
        useState("");

    /* -----------------------------------------------------
       UI STATE
    ----------------------------------------------------- */

    const [loading, setLoading] =
        useState(false);

    const [formLoading, setFormLoading] =
        useState(false);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [showDetails, setShowDetails] =
        useState(false);

    const [formMode, setFormMode] =
        useState("add");


    /* =====================================================
       INQUIRY OPTIONS
    ===================================================== */

    const inquiryOptions = useMemo(() => {
        return inquiries.map((inquiry) => ({
            value: inquiry.id,

            label:
                `${inquiry.icnNumber || "No ICN"}`
                +
                ` - `
                +
                `${inquiry.customer?.legalName || "Unknown Customer"}`,
        }));
    }, [inquiries]);


    /* =====================================================
       BASELINE OPTIONS

       Used for the feasibility review form.
    ===================================================== */

    const baselineOptions = useMemo(() => {
        return baselines.map((baseline) => ({
            value: baseline.id,

            label:
                `Version ${baseline.versionNumber}`
                +
                ` - `
                +
                `${baseline.productCategory}`
                +
                `${baseline.isActive ? " (Active)" : ""}`,
        }));
    }, [baselines]);


    /* =====================================================
       LOAD INQUIRIES
    ===================================================== */

    const loadInquiries = async () => {

        try {

            setLoading(true);

            const response =
                await getAllInquiries();

            setInquiries(
                response.data || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load inquiries."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       LOAD BASELINES
    ===================================================== */

    const loadBaselines = async (inquiryId) => {

        if (!inquiryId) {

            setBaselines([]);
            setSelectedBaselineId("");

            return;
        }

        try {

            setLoading(true);

            const response =
                await getBaselinesByInquiry(
                    inquiryId
                );

            const data =
                response.data || [];

            setBaselines(data);

            /*
             * Automatically select the active
             * baseline if one exists.
             */
            const activeBaseline =
                data.find(
                    (baseline) =>
                        baseline.isActive
                );

            if (activeBaseline) {

                setSelectedBaselineId(
                    activeBaseline.id
                );

            } else if (data.length > 0) {

                setSelectedBaselineId(
                    data[0].id
                );

            } else {

                setSelectedBaselineId("");

            }

        } catch (error) {

            console.error(error);

            setBaselines([]);

            setSelectedBaselineId("");

            toast.error(
                "Failed to load baselines."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       LOAD FEASIBILITY REVIEWS
    ===================================================== */

    const loadFeasibilityReviews =
        async (inquiryId) => {

            if (!inquiryId) {

                setFeasibilityReviews([]);

                return;
            }

            try {

                setLoading(true);

                const response =
                    await getFeasibilityReviewsByInquiry(
                        inquiryId
                    );

                setFeasibilityReviews(
                    response.data || []
                );

            } catch (error) {

                console.error(error);

                setFeasibilityReviews([]);

                toast.error(
                    "Failed to load feasibility reviews."
                );

            } finally {

                setLoading(false);

            }
        };


    /* =====================================================
       LOAD DATA WHEN INQUIRY CHANGES
    ===================================================== */

    useEffect(() => {

        if (!selectedInquiryId) {

            setBaselines([]);
            setFeasibilityReviews([]);
            setSelectedBaselineId("");

            return;
        }

        loadBaselines(
            selectedInquiryId
        );

        loadFeasibilityReviews(
            selectedInquiryId
        );

    }, [selectedInquiryId]);


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadInquiries();

    }, []);


    /* =====================================================
       CHANGE INQUIRY
    ===================================================== */

    const handleInquiryChange = (e) => {

        const inquiryId =
            e.target.value;

        setSelectedInquiryId(
            inquiryId
        );

        setSearchTerm("");

        setSelectedItem(null);

        setShowDetails(false);
    };


    /* =====================================================
       CHANGE VIEW
    ===================================================== */

    const handleViewTypeChange =
        (e) => {

            setViewType(
                e.target.value
            );

            setSearchTerm("");

            setSelectedItem(null);

            setShowDetails(false);
        };


    /* =====================================================
       SEARCH
    ===================================================== */

    const currentData =
        viewType === "baseline"
            ? baselines
            : feasibilityReviews;


    const filteredData = useMemo(() => {

        if (!searchTerm.trim()) {

            return currentData;

        }

        const keyword =
            searchTerm
                .toLowerCase()
                .trim();

        return currentData.filter(
            (item) => {

                if (viewType === "baseline") {

                    return (
                        String(
                            item.versionNumber || ""
                        )
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        String(
                            item.productCategory || ""
                        )
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        String(
                            item.createdBy || ""
                        )
                            .toLowerCase()
                            .includes(keyword)
                    );

                }

                return (
                    String(
                        item.status || ""
                    )
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(
                        item.processRoute || ""
                    )
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(
                        item.costingMaterialBasis || ""
                    )
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(
                        item.evaluatedBy || ""
                    )
                        .toLowerCase()
                        .includes(keyword)
                );

            }
        );

    }, [
        currentData,
        searchTerm,
        viewType,
    ]);


    /* =====================================================
       FORM FIELDS
    ===================================================== */

    const currentFields =
        viewType === "baseline"
            ? baselineFields
            : feasibilityReviewFields;


    /* =====================================================
       ADD
    ===================================================== */

    const handleAdd = () => {

        if (!selectedInquiryId) {

            toast.warning(
                "Please select an inquiry first."
            );

            return;
        }

        if (
            viewType === "feasibility" &&
            !selectedBaselineId
        ) {

            toast.warning(
                "Please select a baseline first."
            );

            return;
        }

        setSelectedItem(null);

        setFormMode("add");

        setShowFormModal(true);
    };


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (item) => {

        setSelectedItem(item);

        setShowDetails(true);
    };


    /* =====================================================
       EDIT

       There are currently no PATCH APIs for
       baselines or feasibility reviews.

       Therefore we don't perform an edit.
    ===================================================== */

    const handleEdit = () => {

        toast.info(
            "Editing is not available for this record."
        );

    };


    /* =====================================================
       DELETE

       No delete API exists for these resources.
    ===================================================== */

    const handleDelete = () => {

        toast.info(
            "Deleting is not available for this record."
        );

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit =
        async (formData) => {

            if (!selectedInquiryId) {

                toast.error(
                    "Please select an inquiry."
                );

                return;
            }

            try {

                setFormLoading(true);

                /* =============================================
                   CREATE BASELINE
                ============================================= */

                if (
                    viewType === "baseline"
                ) {

                    const payload = {
                        ...formData,
                    };


                    /*
                     * Convert numeric value.
                     */
                    if (
                        payload.finishedGsmWeight !==
                        "" &&
                        payload.finishedGsmWeight !==
                        null &&
                        payload.finishedGsmWeight !==
                        undefined
                    ) {

                        payload.finishedGsmWeight =
                            Number(
                                payload.finishedGsmWeight
                            );

                    } else {

                        payload.finishedGsmWeight =
                            null;

                    }


                    /* =============================================
       BUILD SIZE & COLOR JSON
    ============================================= */
                    const quantity = Number(payload.quantity);

                    if (!Number.isFinite(quantity) || quantity <= 0) {
                        toast.error("Quantity must be greater than 0.");
                        setFormLoading(false);
                        return;
                    }

                    payload.sizeColorSplitJson = {
                        sizes: [
                            payload.size
                        ],

                        colors: [
                            payload.color
                        ],

                        quantities: {
                            [payload.size]: quantity,
                        }
                    };


                    /* =============================================
                       BUILD UNCLEAR PARAMETERS JSON
                    ============================================= */

                    if (
                        payload.unclearBorderStyle ||
                        payload.unclearEmbroideryPlacement
                    ) {

                        payload.unclearParameters = {
                            borderStyle:
                                payload.unclearBorderStyle || null,

                            embroideryPlacement:
                                payload.unclearEmbroideryPlacement || null,
                        };

                    } else {

                        payload.unclearParameters = null;
                    }


                    /* =============================================
                       REMOVE FRONTEND-ONLY FIELDS
                    ============================================= */

                    delete payload.size;
                    delete payload.color;
                    delete payload.quantity;

                    delete payload.unclearBorderStyle;
                    delete payload.unclearEmbroideryPlacement;


                    await createBaseline(
                        selectedInquiryId,
                        payload
                    );


                    toast.success(
                        "Baseline created successfully."
                    );

                }


                /* =============================================
                   CREATE FEASIBILITY REVIEW
                ============================================= */

                else {

                    if (!selectedBaselineId) {

                        toast.error(
                            "Please select a baseline."
                        );

                        setFormLoading(false);

                        return;
                    }


                    const payload = {
                        ...formData,

                        inquiryId:
                            selectedInquiryId,
                    };


                    if (
                        payload.leadTimeDays !==
                        "" &&
                        payload.leadTimeDays !==
                        null &&
                        payload.leadTimeDays !==
                        undefined
                    ) {

                        payload.leadTimeDays =
                            Number(
                                payload.leadTimeDays
                            );

                    }


                    await createFeasibilityReview(
                        selectedBaselineId,
                        payload
                    );


                    toast.success(
                        "Feasibility review created successfully."
                    );

                }


                setShowFormModal(false);

                setSelectedItem(null);


                /*
                 * Reload both datasets because
                 * creating a baseline can affect the
                 * active baseline.
                 */

                await loadBaselines(
                    selectedInquiryId
                );

                await loadFeasibilityReviews(
                    selectedInquiryId
                );

            } catch (error) {

                console.error(error);

                toast.error(
                    error?.response?.data?.message ||
                    "Operation failed."
                );

            } finally {

                setFormLoading(false);

            }
        };

    /* =====================================================
   RENDER
===================================================== */

    return (
        <div className="dashboard-container">

            <div className="dashboard-content">


                {/* =================================================
                   TOOLBAR
                ================================================= */}

                <CrudToolbar
                    title="Requirement Baseline & Feasibility"
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                    onAdd={handleAdd}
                    addButtonText={
                        viewType === "baseline"
                            ? "Add Baseline"
                            : "Add Feasibility Review"
                    }
                    loading={loading}
                />


                {/* =================================================
                   FILTER / SELECTION AREA
                ================================================= */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "minmax(280px, 1fr) minmax(220px, 300px)",
                        gap: "16px",
                        marginBottom: "20px",
                    }}
                >

                    {/* ---------------------------------------------
                       INQUIRY DROPDOWN
                    --------------------------------------------- */}

                    <div className="form-group">

                        <label>
                            Inquiry
                        </label>

                        <select
                            value={
                                selectedInquiryId
                            }
                            onChange={
                                handleInquiryChange
                            }
                            disabled={loading}
                        >

                            <option value="">
                                Select Inquiry
                            </option>

                            {inquiryOptions.map(
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


                    {/* ---------------------------------------------
                       VIEW TYPE DROPDOWN
                    --------------------------------------------- */}

                    <div className="form-group">

                        <label>
                            View
                        </label>

                        <select
                            value={viewType}
                            onChange={
                                handleViewTypeChange
                            }
                            disabled={loading}
                        >

                            <option value="baseline">
                                Baselines
                            </option>

                            <option value="feasibility">
                                Feasibility Reviews
                            </option>

                        </select>

                    </div>

                </div>


                {/* =================================================
                   BASELINE SELECTION
                   
                   Only needed when working with reviews.
                ================================================= */}

                {viewType === "feasibility" &&
                    selectedInquiryId && (

                        <div
                            style={{
                                marginBottom: "20px",
                            }}
                        >

                            <div
                                className="form-group"
                                style={{
                                    maxWidth: "500px",
                                }}
                            >

                                <label>
                                    Baseline
                                </label>

                                <select
                                    value={
                                        selectedBaselineId
                                    }
                                    onChange={(e) =>
                                        setSelectedBaselineId(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        loading ||
                                        baselines.length === 0
                                    }
                                >

                                    <option value="">
                                        Select Baseline
                                    </option>

                                    {baselineOptions.map(
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

                        </div>

                    )}


                {/* =================================================
                   EMPTY STATE
                ================================================= */}

                {!selectedInquiryId ? (

                    <div
                        style={{
                            padding: "50px 20px",
                            textAlign: "center",
                            color: "#777",
                        }}
                    >

                        <h3>
                            Select an Inquiry
                        </h3>

                        <p>
                            Select an inquiry above to
                            view its baselines and
                            feasibility reviews.
                        </p>

                    </div>

                ) : (

                    <>
                        {/* =========================================
                           CURRENT TABLE
                        ========================================= */}

                        <CrudTable
                            columns={
                                viewType === "baseline"
                                    ? baselineColumns
                                    : feasibilityReviewColumns
                            }

                            data={filteredData}

                            loading={loading}

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

                    </>

                )}

            </div>


            {/* =====================================================
               CREATE MODAL
            ===================================================== */}

            <CrudFormModal
                title={
                    viewType === "baseline"
                        ? "Baseline"
                        : "Feasibility Review"
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
                    selectedItem
                }

                loading={
                    formLoading
                }

                onClose={() => {

                    if (
                        formLoading
                    ) {
                        return;
                    }

                    setShowFormModal(
                        false
                    );

                    setSelectedItem(
                        null
                    );

                }}

                onSubmit={
                    handleSubmit
                }
            />


            {/* =====================================================
               DETAILS MODAL

               We don't use ViewPartyDrawer here because this
               dashboard handles two different resource types.
            ===================================================== */}

            {showDetails &&
                selectedItem && (

                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setShowDetails(false)
                        }
                    >

                        <div
                            className="modal-container"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div
                                className="modal-header"
                            >

                                <h2>
                                    {viewType ===
                                        "baseline"
                                        ? "Baseline Details"
                                        : "Feasibility Review Details"}
                                </h2>

                                <button
                                    type="button"
                                    className="modal-close-btn"
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                >
                                    ✕
                                </button>

                            </div>


                            <div
                                className="modal-body"
                            >

                                {viewType ===
                                    "baseline" ? (

                                    <>
                                        <div className="drawer-section">

                                            <h3>
                                                Baseline Information
                                            </h3>

                                            <div className="drawer-grid">

                                                <div className="drawer-item">
                                                    <label>
                                                        Version
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.versionNumber
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Product Category
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.productCategory
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        GSM
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.finishedGsmWeight ??
                                                            "-"
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Status
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.isActive
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Created By
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.createdBy
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Created At
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.createdAt
                                                                ? new Date(
                                                                    selectedItem.createdAt
                                                                ).toLocaleString()
                                                                : "-"
                                                        }
                                                    </span>
                                                </div>

                                            </div>

                                        </div>


                                        <div className="drawer-section">

                                            <h3>
                                                Size & Color Split
                                            </h3>

                                            <pre
                                                style={{
                                                    whiteSpace:
                                                        "pre-wrap",
                                                    wordBreak:
                                                        "break-word",
                                                }}
                                            >
                                                {JSON.stringify(
                                                    selectedItem.sizeColorSplitJson,
                                                    null,
                                                    2
                                                )}
                                            </pre>

                                        </div>


                                        <div className="drawer-section">

                                            <h3>
                                                Testing Requirements
                                            </h3>

                                            <p>
                                                {
                                                    selectedItem.testingRequirements ||
                                                    "-"
                                                }
                                            </p>

                                        </div>


                                        <div className="drawer-section">

                                            <h3>
                                                Unclear Parameters
                                            </h3>

                                            <pre
                                                style={{
                                                    whiteSpace:
                                                        "pre-wrap",
                                                    wordBreak:
                                                        "break-word",
                                                }}
                                            >
                                                {selectedItem.unclearParameters
                                                    ? JSON.stringify(
                                                        selectedItem.unclearParameters,
                                                        null,
                                                        2
                                                    )
                                                    : "-"}
                                            </pre>

                                        </div>


                                        {selectedItem.feasibilityReviews &&
                                            selectedItem.feasibilityReviews.length >
                                            0 && (

                                                <div className="drawer-section">

                                                    <h3>
                                                        Feasibility Reviews
                                                    </h3>

                                                    {selectedItem.feasibilityReviews.map(
                                                        (review) => (

                                                            <div
                                                                key={
                                                                    review.id
                                                                }
                                                                style={{
                                                                    padding:
                                                                        "12px 0",
                                                                    borderBottom:
                                                                        "1px solid #eee",
                                                                }}
                                                            >

                                                                <strong>
                                                                    {
                                                                        review.status
                                                                    }
                                                                </strong>

                                                                <div>
                                                                    {
                                                                        review.processRoute
                                                                    }
                                                                </div>

                                                                <div>
                                                                    Lead Time:{" "}
                                                                    {
                                                                        review.leadTimeDays
                                                                    }{" "}
                                                                    days
                                                                </div>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            )}

                                    </>

                                ) : (

                                    <>
                                        <div className="drawer-section">

                                            <h3>
                                                Review Information
                                            </h3>

                                            <div className="drawer-grid">

                                                <div className="drawer-item">
                                                    <label>
                                                        Status
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.status
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Process Route
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.processRoute
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Material Basis
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.costingMaterialBasis
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Lead Time
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.leadTimeDays
                                                        }{" "}
                                                        days
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Evaluated By
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.evaluatedBy
                                                        }
                                                    </span>
                                                </div>

                                                <div className="drawer-item">
                                                    <label>
                                                        Created At
                                                    </label>

                                                    <span>
                                                        {
                                                            selectedItem.createdAt
                                                                ? new Date(
                                                                    selectedItem.createdAt
                                                                ).toLocaleString()
                                                                : "-"
                                                        }
                                                    </span>
                                                </div>

                                            </div>

                                        </div>


                                        <div className="drawer-section">

                                            <h3>
                                                Technical Risks
                                            </h3>

                                            <p>
                                                {
                                                    selectedItem.technicalRisks ||
                                                    "No technical risks recorded."
                                                }
                                            </p>

                                        </div>


                                        {selectedItem.baselineVersion && (

                                            <div className="drawer-section">

                                                <h3>
                                                    Baseline Version
                                                </h3>

                                                <div className="drawer-grid">

                                                    <div className="drawer-item">
                                                        <label>
                                                            Version
                                                        </label>

                                                        <span>
                                                            {
                                                                selectedItem
                                                                    .baselineVersion
                                                                    .versionNumber
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="drawer-item">
                                                        <label>
                                                            Product Category
                                                        </label>

                                                        <span>
                                                            {
                                                                selectedItem
                                                                    .baselineVersion
                                                                    .productCategory
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="drawer-item">
                                                        <label>
                                                            GSM
                                                        </label>

                                                        <span>
                                                            {
                                                                selectedItem
                                                                    .baselineVersion
                                                                    .finishedGsmWeight ??
                                                                "-"
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="drawer-item">
                                                        <label>
                                                            Active
                                                        </label>

                                                        <span>
                                                            {
                                                                selectedItem
                                                                    .baselineVersion
                                                                    .isActive
                                                                    ? "Yes"
                                                                    : "No"
                                                            }
                                                        </span>
                                                    </div>

                                                </div>

                                            </div>

                                        )}

                                    </>

                                )}

                            </div>


                            <div
                                className="modal-footer"
                            >

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
};


export default InquiryServiceDashboard;