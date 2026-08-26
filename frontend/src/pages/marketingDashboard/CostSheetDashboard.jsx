import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { toast } from "react-toastify";

import {
    getAllInquiries,

    getCostSheetsByInquiry,
    createCostSheet,
    getCostSheetById,
    updateCostSheet,
    updateCostSheetStatus,

    addYarn,
    updateYarn,
    deleteYarn,

    addDyeingColor,
    updateDyeingColor,
    deleteDyeingColor,
} from "../../services/marketingApi";

import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";

// import ViewCostSheetDrawer from "../../components/marketing/PartyService/ViewPartyDrawer";

import ViewCostSheetDrawer
    from "../../components/marketing/CostSheetService/ViewCostSheetDrawer";
import "../../styles/marketing/partyService/dashboard.css";


/* ============================================================
   COST SHEET COLUMNS
============================================================ */

const costSheetColumns = [
    {
        key: "versionNumber",
        label: "Version",
    },
    {
        key: "status",
        label: "Status",
    },
    {
        key: "costOfYarn",
        label: "Cost of Yarn",
    },
    {
        key: "totalWeavingCost",
        label: "Total Weaving",
    },
    {
        key: "totalDyeingCharges",
        label: "Dyeing Charges",
    },
    {
        key: "costPerKg",
        label: "Cost / Kg",
    },
    {
        key: "totalCost",
        label: "Total Cost",
    },
    {
        key: "createdAt",
        label: "Created At",
    },
];


/* ============================================================
   YARN COLUMNS
============================================================ */

const yarnColumns = [
    {
        key: "quality",
        label: "Quality",
    },
    {
        key: "usage",
        label: "Usage",
    },
    {
        key: "rate",
        label: "Rate",
    },
    {
        key: "wastage",
        label: "Wastage %",
    },
    {
        key: "dyeingCharges",
        label: "Dyeing Charges",
    },
    {
        key: "dyeingWastage",
        label: "Dyeing Wastage %",
    },
    {
        key: "totalCost",
        label: "Total Cost",
    },
];


/* ============================================================
   DYEING COLOR COLUMNS
============================================================ */

const dyeingColorColumns = [
    {
        key: "colorName",
        label: "Color",
    },
    {
        key: "charges",
        label: "Charges",
    },
    {
        key: "wastage",
        label: "Wastage %",
    },
];


/* ============================================================
   COST SHEET FORM FIELDS
============================================================ */

const costSheetFields = [
    {
        name: "status",
        label: "Status",
        type: "select",
        required: false,
        placeholder: "Select Status",
        options: [
            {
                value: "DRAFT_DATA_PENDING",
                label: "Draft Data Pending",
            },
            {
                value: "CALCULATED",
                label: "Calculated",
            },
            {
                value: "APPROVED",
                label: "Approved",
            },
            {
                value: "REVISED",
                label: "Revised",
            },
        ],
    },

    {
        name: "costOfYarn",
        label: "Cost of Yarn",
        type: "number",
        required: false,
    },

    {
        name: "weavingWastagePercent",
        label: "Weaving Wastage %",
        type: "number",
        required: false,
    },

    {
        name: "weavingWastageCost",
        label: "Weaving Wastage Cost",
        type: "number",
        required: false,
    },

    {
        name: "weavingCharges",
        label: "Weaving Charges",
        type: "number",
        required: false,
    },

    {
        name: "totalWeavingCost",
        label: "Total Weaving Cost",
        type: "number",
        required: false,
    },

    {
        name: "totalDyeingCharges",
        label: "Total Dyeing Charges",
        type: "number",
        required: false,
    },

    {
        name: "totalDyeingWastage",
        label: "Total Dyeing Wastage",
        type: "number",
        required: false,
    },

    {
        name: "extraCostOfWeaving",
        label: "Extra Cost of Weaving",
        type: "number",
        required: false,
    },

    {
        name: "costOfReadyFabric",
        label: "Cost of Ready Fabric",
        type: "number",
        required: false,
    },

    {
        name: "costOfTowelPerLbs",
        label: "Cost of Towel / Lbs",
        type: "number",
        required: false,
    },

    {
        name: "bAndCutPcsWastage",
        label: "B & Cut Pcs Wastage",
        type: "number",
        required: false,
    },

    {
        name: "cartonPackedTowel",
        label: "Carton Packed Towel",
        type: "number",
        required: false,
    },

    {
        name: "factoryOverheadChgs1",
        label: "Factory Overhead Charges 1",
        type: "number",
        required: false,
    },

    {
        name: "costPerLbs",
        label: "Cost / Lbs",
        type: "number",
        required: false,
    },

    {
        name: "costPerKg",
        label: "Cost / Kg",
        type: "number",
        required: false,
    },

    {
        name: "totalCost",
        label: "Total Cost",
        type: "number",
        required: false,
    },

    {
        name: "exchangeRate",
        label: "Exchange Rate",
        type: "number",
        required: false,
    },

    {
        name: "cnfRateToQuotePerPc",
        label: "CNF Rate / Piece",
        type: "number",
        required: false,
    },

    {
        name: "labourCutToPack",
        label: "Labour Cut to Pack",
        type: "number",
        required: false,
    },

    {
        name: "thread",
        label: "Thread",
        type: "number",
        required: false,
    },

    {
        name: "horseStitching",
        label: "Horse Stitching",
        type: "number",
        required: false,
    },

    {
        name: "stiffenerSheet",
        label: "Stiffener Sheet",
        type: "number",
        required: false,
    },

    {
        name: "checking",
        label: "Checking",
        type: "number",
        required: false,
    },

    {
        name: "knottingChgs",
        label: "Knotting Charges",
        type: "number",
        required: false,
    },

    {
        name: "label",
        label: "Label",
        type: "number",
        required: false,
    },

    {
        name: "silicaGel",
        label: "Silica Gel",
        type: "number",
        required: false,
    },

    {
        name: "labTest",
        label: "Lab Test",
        type: "number",
        required: false,
    },

    {
        name: "totalConfectionExp",
        label: "Total Confection Expense",
        type: "number",
        required: false,
    },

    {
        name: "factoryOverheadChgs2",
        label: "Factory Overhead Charges 2",
        type: "number",
        required: false,
    },

    {
        name: "freightUsd",
        label: "Freight USD",
        type: "number",
        required: false,
    },

    {
        name: "freightExRate",
        label: "Freight Exchange Rate",
        type: "number",
        required: false,
    },

    {
        name: "freightPkr",
        label: "Freight PKR",
        type: "number",
        required: false,
    },

    {
        name: "clgAndTransport",
        label: "CLG & Transport",
        type: "number",
        required: false,
    },

    {
        name: "totalFreight",
        label: "Total Freight",
        type: "number",
        required: false,
    },

    {
        name: "kgsPerFcl",
        label: "Kgs per FCL",
        type: "number",
        required: false,
    },

    {
        name: "freightPerKg",
        label: "Freight / Kg",
        type: "number",
        required: false,
    },

    {
        name: "wovenLabelCost",
        label: "Woven Label Cost",
        type: "number",
        required: false,
    },

    {
        name: "wovenStitchingCost",
        label: "Woven Stitching Cost",
        type: "number",
        required: false,
    },

    {
        name: "totalLabelCost",
        label: "Total Label Cost",
        type: "number",
        required: false,
    },

    {
        name: "embroideryCost",
        label: "Embroidery Cost",
        type: "number",
        required: false,
    },
];


/* ============================================================
   YARN FORM FIELDS
============================================================ */

const yarnFields = [
    {
        name: "quality",
        label: "Quality",
        type: "text",
        required: true,
    },

    {
        name: "usage",
        label: "Usage",
        type: "number",
        required: true,
    },

    {
        name: "rate",
        label: "Rate",
        type: "number",
        required: true,
    },

    {
        name: "wastage",
        label: "Wastage %",
        type: "number",
        required: true,
    },

    {
        name: "yarnTypeId",
        label: "Yarn Type",
        type: "text",
        required: false,
    },

    {
        name: "dyeingCharges",
        label: "Dyeing Charges",
        type: "number",
        required: false,
    },

    {
        name: "dyeingWastage",
        label: "Dyeing Wastage %",
        type: "number",
        required: false,
    },

    {
        name: "totalCost",
        label: "Total Cost",
        type: "number",
        required: false,
    },
];


/* ============================================================
   DYEING COLOR FORM FIELDS
============================================================ */

const dyeingColorFields = [
    {
        name: "colorName",
        label: "Color Name",
        type: "text",
        required: true,
    },

    {
        name: "charges",
        label: "Charges",
        type: "number",
        required: true,
    },

    {
        name: "wastage",
        label: "Wastage %",
        type: "number",
        required: true,
    },
];


/* ============================================================
   DASHBOARD
============================================================ */

const CostSheetServiceDashboard = () => {

    /* --------------------------------------------------------
       INQUIRIES
    -------------------------------------------------------- */

    const [inquiries, setInquiries] = useState([]);

    const [selectedInquiryId, setSelectedInquiryId] =
        useState("");


    /* --------------------------------------------------------
       COST SHEETS
    -------------------------------------------------------- */

    const [costSheets, setCostSheets] =
        useState([]);

    const [selectedCostSheet, setSelectedCostSheet] =
        useState(null);


    /* --------------------------------------------------------
       ACTIVE TYPE
    -------------------------------------------------------- */

    const [activeType, setActiveType] =
        useState("costSheet");


    /* --------------------------------------------------------
       UI STATE
    -------------------------------------------------------- */

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [showDrawer, setShowDrawer] =
        useState(false);

    const [formMode, setFormMode] =
        useState("add");

    const [selectedAction, setSelectedAction] =
        useState("");


    /* ========================================================
       INQUIRY OPTIONS
    ======================================================== */

    const inquiryOptions = useMemo(() => {

        return inquiries.map((inquiry) => ({
            value: inquiry.id,

            label:
                `${inquiry.icnNumber || "No ICN"}`
                +
                (
                    inquiry.customer?.legalName
                        ? ` - ${inquiry.customer.legalName}`
                        : ""
                ),
        }));

    }, [inquiries]);


    /* ========================================================
       TABLE DATA
    ======================================================== */

    const tableData =
        activeType === "costSheet"
            ? costSheets
            : activeType === "yarn"
                ? selectedCostSheet?.yarns || []
                : selectedCostSheet?.dyeingColors || [];


    const columns =
        activeType === "costSheet"
            ? costSheetColumns
            : activeType === "yarn"
                ? yarnColumns
                : dyeingColorColumns;


    /* ========================================================
       LOAD INQUIRIES
    ======================================================== */

    const loadInquiries = async () => {

        try {

            setLoading(true);

            const response =
                await getAllInquiries();

            setInquiries(
                response?.data || []
            );

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
       LOAD COST SHEETS
    ======================================================== */

    const loadCostSheets = async (
        inquiryId
    ) => {

        if (!inquiryId) {

            setCostSheets([]);
            setSelectedCostSheet(null);

            return;
        }

        try {

            setLoading(true);

            const response =
                await getCostSheetsByInquiry(
                    inquiryId
                );

            const data =
                response?.data || [];

            setCostSheets(data);

            setSelectedCostSheet(
                data[0] || null
            );

        } catch (error) {

            console.error(
                "Failed to load cost sheets:",
                error
            );

            toast.error(
                "Failed to load cost sheets."
            );

            setCostSheets([]);
            setSelectedCostSheet(null);

        } finally {

            setLoading(false);

        }
    };


    /* ========================================================
       INQUIRY CHANGE
    ======================================================== */

    const handleInquiryChange = async (
        event
    ) => {

        const inquiryId =
            event.target.value;

        setSelectedInquiryId(
            inquiryId
        );

        setSelectedAction("");

        setActiveType(
            "costSheet"
        );

        setSelectedCostSheet(null);

        setCostSheets([]);

        if (inquiryId) {

            await loadCostSheets(
                inquiryId
            );
        }
    };


    /* ========================================================
       INITIAL LOAD
    ======================================================== */

    useEffect(() => {

        loadInquiries();

    }, []);


    /* ========================================================
       SEARCH
    ======================================================== */

    const [searchTerm, setSearchTerm] =
        useState("");


    const filteredData =
        useMemo(() => {

            if (!searchTerm.trim()) {
                return tableData;
            }

            const keyword =
                searchTerm
                    .toLowerCase()
                    .trim();

            return tableData.filter(
                (item) => {

                    const values = [
                        item.icnNumber,
                        item.status,
                        item.quality,
                        item.colorName,
                        item.versionNumber,
                        item.createdAt,
                    ];

                    return values.some(
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
       ADD
    ======================================================== */

    const openAddModal = () => {

        setSelectedItem(null);

        setFormMode("add");

        setShowFormModal(true);
    };


    /* ========================================================
       VIEW
    ======================================================== */

    const handleView = async (item) => {

        try {

            setLoading(true);

            if (!item?.id) {
                toast.error("Unable to identify this record.");
                return;
            }

            if (activeType === "costSheet") {

                const response =
                    await getCostSheetById(item.id);

                const data =
                    response?.data || item;

                setSelectedCostSheet(data);
                setSelectedItem(data);

            } else {

                setSelectedItem(item);

            }

            setShowDrawer(true);

        } catch (error) {

            console.error(
                "Failed to load details:",
                error
            );

            toast.error(
                "Failed to load details."
            );

        } finally {

            setLoading(false);

        }
    };


    /* ========================================================
       EDIT
    ======================================================== */

    const handleEdit = (item) => {

        setSelectedItem(item);

        setFormMode("edit");

        setShowFormModal(true);
    };


    /* ========================================================
       DELETE
    ======================================================== */

    const handleDelete = async (item) => {
        if (!item?.id) {
            toast.error("Unable to identify the record.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete this ${activeType === "yarn"
                ? "yarn"
                : activeType === "dyeingColor"
                    ? "dyeing color"
                    : "cost sheet"
            }?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            /* =====================================================
               COST SHEET
               No delete API exists
            ===================================================== */

            if (activeType === "costSheet") {
                toast.info(
                    "Delete API is not available for cost sheets."
                );
                return;
            }


            /* =====================================================
               YARN
            ===================================================== */

            if (activeType === "yarn") {
                await deleteYarn(item.id);

                toast.success(
                    "Yarn deleted successfully."
                );
            }


            /* =====================================================
               DYEING COLOR
            ===================================================== */

            if (activeType === "dyeingColor") {
                await deleteDyeingColor(item.id);

                toast.success(
                    "Dyeing color deleted successfully."
                );
            }


            /* =====================================================
               REFRESH COST SHEETS
            ===================================================== */

            await loadCostSheets(
                selectedInquiryId
            );

        } catch (error) {
            console.error(
                "Delete failed:",
                error
            );

            toast.error(
                "Failed to delete record."
            );

        } finally {
            setLoading(false);
        }
    };


    /* ========================================================
       CLOSE MODAL
    ======================================================== */

    const closeModal = () => {

        setShowFormModal(false);

        setSelectedItem(null);
    };


    /* ========================================================
       CLOSE DRAWER
    ======================================================== */

    const closeDrawer = () => {

        setShowDrawer(false);

        setSelectedItem(null);
    };


    /* ========================================================
       FORM SUBMIT
    ======================================================== */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setSaving(true);

            if (
                activeType === "costSheet"
            ) {

                if (formMode === "add") {

                    await createCostSheet(
                        selectedInquiryId,
                        formData
                    );

                    toast.success(
                        "Cost sheet created successfully."
                    );

                } else {

                    await updateCostSheet(
                        selectedItem.id,
                        formData
                    );

                    toast.success(
                        "Cost sheet updated successfully."
                    );
                }

                closeModal();

                await loadCostSheets(
                    selectedInquiryId
                );

                return;
            }

            if (
                activeType === "yarn"
            ) {

                if (formMode === "add") {

                    await addYarn(
                        selectedCostSheet.id,
                        formData
                    );

                } else {

                    await updateYarn(
                        selectedItem.id,
                        formData
                    );
                }

                toast.success(
                    "Yarn saved successfully."
                );

                closeModal();

                await loadCostSheets(
                    selectedInquiryId
                );

                return;
            }

            if (
                activeType === "dyeingColor"
            ) {

                if (formMode === "add") {

                    await addDyeingColor(
                        selectedCostSheet.id,
                        formData
                    );

                } else {

                    await updateDyeingColor(
                        selectedItem.id,
                        formData
                    );
                }

                toast.success(
                    "Dyeing color saved successfully."
                );

                closeModal();

                await loadCostSheets(
                    selectedInquiryId
                );
            }

        } catch (error) {

            console.error(
                "Save failed:",
                error
            );

            toast.error(
                "Failed to save data."
            );

        } finally {

            setSaving(false);

        }
    };


    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">

                <div>
                    <h1>
                        Cost Sheet Service
                    </h1>

                    <p>
                        Manage inquiry cost sheets
                        and costing details
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={openAddModal}
                    disabled={
                        !selectedInquiryId
                    }
                >
                    Add
                </button>

            </div>


            {/* =================================================
                SELECTION BAR
            ================================================= */}

            <div className="selection-bar">

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


                <div className="selection-group">

                    <label>
                        View
                    </label>

                    <select
                        value={
                            activeType
                        }
                        onChange={(event) => {

                            setActiveType(
                                event.target.value
                            );

                            setSelectedItem(
                                null
                            );

                        }}
                        disabled={
                            !selectedInquiryId
                        }
                    >

                        <option value="costSheet">
                            Cost Sheets
                        </option>

                        <option value="yarn">
                            Yarns
                        </option>

                        <option value="dyeingColor">
                            Dyeing Colors
                        </option>

                    </select>

                </div>

            </div>


            {/* =================================================
                NO INQUIRY
            ================================================= */}

            {!selectedInquiryId && (

                <div className="empty-state">

                    <h3>
                        Select an Inquiry
                    </h3>

                    <p>
                        Select an inquiry above
                        to view and manage its
                        cost sheets.
                    </p>

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {selectedInquiryId &&
                loading && (

                    <div className="loading-state">
                        Loading...
                    </div>

                )}


            {/* =================================================
                TABLE
            ================================================= */}

            {selectedInquiryId &&
                !loading && (

                    <CrudTable
                        columns={columns}
                        data={filteredData}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )}


            {/* =================================================
                FORM MODAL
            ================================================= */}

            <CrudFormModal
                title={
                    activeType === "costSheet"
                        ? "Cost Sheet"
                        : activeType === "yarn"
                            ? "Yarn"
                            : "Dyeing Color"
                }

                fields={
                    activeType === "costSheet"
                        ? costSheetFields
                        : activeType === "yarn"
                            ? yarnFields
                            : dyeingColorFields
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


            {/* =================================================
                DRAWER
            ================================================= */}

            <ViewCostSheetDrawer
                isOpen={showDrawer}
                costSheet={selectedCostSheet}
                item={selectedItem}
                type={activeType}
                onClose={closeDrawer}
            />

        </div>
    );
};


export default CostSheetServiceDashboard;