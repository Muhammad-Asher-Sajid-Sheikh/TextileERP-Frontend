// ============================================
// Surface Decoration Process Types
// ============================================

export const DECORATION_TYPES = [
    {
        value: "PRINTING",
        label: "Printing",
    },
    {
        value: "EMBROIDERY",
        label: "Embroidery",
    },
];

// ============================================
// Printing Status
// ============================================

export const PRINTING_STATUS = {
    PENDING: "Pending",
    INPROGRESS: "In Progress",
    RETURNED: "Returned",
    DISCREPANCY_FLAGGED: "Discrepancy Flagged",
    NOT_REQUIRED: "Not Required",
};

// ============================================
// Embroidery Status
// ============================================

export const EMBROIDERY_STATUS = {
    PENDING: "Pending",
    INITIATED: "Initiated",
    INPROGRESS: "In Progress",
    RETURNED: "Returned",
    DISCREPANCY_FLAGGED: "Discrepancy Flagged",
    NOT_REQUIRED: "Not Required",
};

// ============================================
// Table Actions
// ============================================

export const DECORATION_ACTIONS = {
    VIEW: "VIEW",
    INITIATE: "INITIATE",
    DISPATCH: "DISPATCH",
    COMPLETE: "COMPLETE",
};

// ============================================
// Printing Form Defaults
// ============================================

export const PRINTING_INITIAL_VALUES = {
    orderTokenId: "",
    rollsReturned: "",
    specAuditBy: "",
    returnedAt: "",
    specAuditNotes: "",
};

// ============================================
// Embroidery Initiate Defaults
// ============================================

export const EMBROIDERY_INITIATE_INITIAL_VALUES = {
    orderTokenId: "",
    totalPiecesCut: "",
    preStitchBy: "",
};

// ============================================
// Embroidery Dispatch Defaults
// ============================================

export const EMBROIDERY_DISPATCH_INITIAL_VALUES = {
    orderTokenId: "",
    vendorId: "",
    piecesSent: "",
};

// ============================================
// Embroidery Complete Defaults
// ============================================

export const EMBROIDERY_COMPLETE_INITIAL_VALUES = {
    orderTokenId: "",
    piecesReturned: "",
    returnedAt: "",
};

// ============================================
// Status Badge Colors
// ============================================

export const STATUS_COLORS = {
    PENDING: "#9CA3AF",
    INITIATED: "#3B82F6",
    INPROGRESS: "#F59E0B",
    RETURNED: "#22C55E",
    DISCREPANCY_FLAGGED: "#EF4444",
    NOT_REQUIRED: "#6B7280",
};

// ============================================
// Helpers
// ============================================

export const getStatusLabel = (status) => {
    return (
        PRINTING_STATUS[status] ||
        EMBROIDERY_STATUS[status] ||
        status
    );
};

export const getStatusColor = (status) => {
    return STATUS_COLORS[status] || "#6B7280";
};

export const isPrinting = (type) => type === "PRINTING";

export const isEmbroidery = (type) => type === "EMBROIDERY";