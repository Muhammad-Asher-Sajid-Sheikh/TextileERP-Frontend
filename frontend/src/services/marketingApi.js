import api from "./api"; // Adjust the path if your axios instance is elsewhere

/* ==========================================================
   PARTY SERVICE
========================================================== */

/**
 * Get all parties
 */
export const getAllParties = async () => {
    const response = await api.get("/api/marketing/party/get-all");
    return response.data;
};

/**
 * Get single party by ID
 */
export const getPartyById = async (partyId) => {
    const response = await api.get(`/api/marketing/party/${partyId}`);
    return response.data;
};

/**
 * Create new party
 */
export const createParty = async (payload) => {
    const response = await api.post(
        "/api/marketing/party/create",
        payload
    );

    return response.data;
};

/**
 * Update party
 */
export const updateParty = async (partyId, payload) => {
    const response = await api.patch(
        `/api/marketing/party/${partyId}`,
        payload
    );

    return response.data;
};

/**
 * Delete party
 */
export const deleteParty = async (partyId) => {
    const response = await api.delete(
        `/api/marketing/party/${partyId}`
    );

    return response.data;
};


// ==============================
// Inquiry APIs
// ==============================

export const getAllInquiries = async () => {
    const response = await api.get("/api/marketing/inquiries");
    return response.data;
};

export const getInquiryById = async (id) => {
    const response = await api.get(`/api/marketing/inquiries/${id}`);
    return response.data;
};

export const createInquiry = async (data) => {
    const response = await api.post("/api/marketing/inquiries", data);
    return response.data;
};

export const updateInquiry = async (id, data) => {
    const response = await api.patch(`/api/marketing/inquiries/${id}`, data);
    return response.data;
};

export const assignMerchandiser = async (id, merchandiserId) => {
    const response = await api.patch(
        `/api/marketing/inquiries/${id}/assign-merchandiser`,
        { merchandiserId }
    );

    return response.data;
};

export const updateInquiryStatus = async (id, status) => {
    const response = await api.patch(
        `/api/marketing/inquiries/${id}/status`,
        { status }
    );

    return response.data;
};

// ================================
// BASELINES
// ================================

// Get all baselines for an inquiry
export const getBaselinesByInquiry = async (inquiryId) => {
    const response = await api.get(
        `/api/marketing/baselines/${inquiryId}/baselines`
    );

    return response.data;
};


// Create a new baseline for an inquiry
export const createBaseline = async (inquiryId, data) => {
    const response = await api.post(
        `/api/marketing/baselines/${inquiryId}/baselines`,
        data
    );

    return response.data;
};


// Get a single baseline by baseline ID
export const getBaselineById = async (baselineId) => {
    const response = await api.get(
        `/api/marketing/baselines/feasibility-reviews/${baselineId}`
    );

    return response.data;
};


// ================================
// FEASIBILITY REVIEWS
// ================================

// Get all feasibility reviews for an inquiry
export const getFeasibilityReviewsByInquiry = async (inquiryId) => {
    const response = await api.get(
        `/api/marketing/baselines/${inquiryId}/feasibility-reviews`
    );

    return response.data;
};


// Create a feasibility review for a baseline
export const createFeasibilityReview = async (baselineId, data) => {
    const response = await api.post(
        `/api/marketing/baselines/${baselineId}/feasibility-reviews`,
        data
    );

    return response.data;
};


// ==========================================
// COST SHEET ROUTES
// ==========================================

// Get all cost sheets for an inquiry
export const getCostSheetsByInquiry = async (inquiryId) => {
    const response = await api.get(
        `/api/marketing/${inquiryId}/cost-sheets`
    );

    return response.data;
};


// Create a new cost sheet for an inquiry
export const createCostSheet = async (inquiryId, data) => {
    const response = await api.post(
        `/api/marketing/${inquiryId}/cost-sheets`,
        data
    );

    return response.data;
};


// Get a single cost sheet by ID
export const getCostSheetById = async (costSheetId) => {
    const response = await api.get(
        `/api/marketing/cost-sheets/${costSheetId}`
    );

    return response.data;
};


// Update a cost sheet
export const updateCostSheet = async (costSheetId, data) => {
    const response = await api.put(
        `/api/marketing/cost-sheets/${costSheetId}`,
        data
    );

    return response.data;
};


// Update cost sheet status
export const updateCostSheetStatus = async (costSheetId, status) => {
    const response = await api.patch(
        `/api/marketing/cost-sheets/${costSheetId}/status`,
        {
            status,
        }
    );

    return response.data;
};


// ==========================================
// COST SHEET - YARNS
// ==========================================

// Add yarn to a cost sheet
export const addYarn = async (costSheetId, data) => {
    const response = await api.post(
        `/api/marketing/cost-sheets/${costSheetId}/yarns`,
        data
    );

    return response.data;
};


// Update yarn
export const updateYarn = async (yarnId, data) => {
    const response = await api.patch(
        `/api/marketing/cost-sheets/yarns/${yarnId}`,
        data
    );

    return response.data;
};


// Delete yarn
export const deleteYarn = async (yarnId) => {
    const response = await api.delete(
        `/api/marketing/cost-sheets/yarns/${yarnId}`
    );

    return response.data;
};


// ==========================================
// COST SHEET - DYEING COLORS
// ==========================================

// Add dyeing color
export const addDyeingColor = async (costSheetId, data) => {
    const response = await api.post(
        `/api/marketing/cost-sheets/${costSheetId}/dyeing-colors`,
        data
    );

    return response.data;
};


// Update dyeing color
export const updateDyeingColor = async (colorId, data) => {
    const response = await api.patch(
        `/api/marketing/cost-sheets/dyeing-colors/${colorId}`,
        data
    );

    return response.data;
};


// Delete dyeing color
export const deleteDyeingColor = async (colorId) => {
    const response = await api.delete(
        `/api/marketing/cost-sheets/dyeing-colors/${colorId}`
    );

    return response.data;
};

// ============================================================
// SAMPLE ROUTES
// ============================================================

// GET /api/marketing/inquiries/:inquiryId/samples
export const getSamplesByInquiryId = async (inquiryId) => {
    const response = await api.get(
        `/api/marketing/inquiries/${inquiryId}/samples`
    );

    return response.data;
};


// POST /api/marketing/inquiries/:inquiryId/samples
export const createSample = async (inquiryId, data) => {
    const response = await api.post(
        `/api/marketing/inquiries/${inquiryId}/samples`,
        data
    );

    return response.data;
};


// GET /api/marketing/samples/:id
export const getSampleById = async (id) => {
    const response = await api.get(
        `/api/marketing/samples/${id}`
    );

    return response.data;
};


// PATCH /api/marketing/samples/:id
export const updateSample = async (id, data) => {
    const response = await api.patch(
        `/api/marketing/samples/${id}`,
        data
    );

    return response.data;
};


// POST /api/marketing/samples/:id/dispatch-approval
export const approveSampleDispatch = async (id, data) => {
    const response = await api.post(
        `/api/marketing/samples/${id}/dispatch-approval`,
        data
    );

    return response.data;
};


// POST /api/marketing/samples/:id/ledger-costs
export const addSampleLedgerCost = async (id, data) => {
    const response = await api.post(
        `/api/marketing/samples/${id}/ledger-costs`,
        data
    );

    return response.data;
};


// GET /api/marketing/samples/:id/ledger-costs
export const getSampleLedgerCosts = async (id) => {
    const response = await api.get(
        `/api/marketing/samples/${id}/ledger-costs`
    );

    return response.data;
};


// ============================================================
// SALES CONTRACT APIs
// ============================================================

// ============================================================
// DUMMY PO LIST
// TODO: Replace this with the real GET /pos API later
// ============================================================

export const getAllPOs = async () => {
    return {
        success: true,
        data: [
            {
                id: "35c4dfe1-9868-4ecf-8957-c19cc7a266de",
                inquiryId: "9c663fb0-5229-4903-8f17-b0c381b1d32a",
                customerPoNumber: "PO-2026-001",
                poRevision: 1,
                status: "PO_RECEIVED_VERIFICATION_PENDING",
                originalPoAttachment: "PO-127",
                createdAt: new Date().toISOString(),
            },
        ],
    };
};

// GET /api/marketing/pos/:poId/sales-contracts
export const getSalesContractsByPo = async (poId) => {
    const response = await api.get(
        `/api/marketing/pos/${poId}/sales-contracts`
    );

    return response.data;
};


// POST /api/marketing/pos/:poId/sales-contracts
export const createSalesContract = async (poId, data) => {
    const response = await api.post(
        `/api/marketing/pos/${poId}/sales-contracts`,
        data
    );

    return response.data;
};


// GET /api/marketing/sales-contracts/:id
export const getSalesContractById = async (id) => {
    const response = await api.get(
        `/api/marketing/sales-contracts/${id}`
    );

    return response.data;
};


// PATCH /api/marketing/sales-contracts/:id/payment-clearance
export const updateSalesContractPaymentClearance = async (
    id,
    data
) => {
    const response = await api.patch(
        `/api/marketing/sales-contracts/${id}/payment-clearance`,
        data
    );

    return response.data;
};


// PATCH /api/marketing/sales-contracts/:id/signed-copy
export const updateSalesContractSignedCopy = async (
    id,
    data
) => {
    const response = await api.patch(
        `/api/marketing/sales-contracts/${id}/signed-copy`,
        data
    );

    return response.data;
};


// ==========================================
// SALES ORDERS
// ==========================================

export const getAllSalesOrders = async () => {
    const response = await api.get("/api/marketing/sales-orders");
    return response.data;
};

export const activateSalesOrder = async (data) => {
    const response = await api.post(
        "/api/marketing/sales-orders/activate",
        data
    );

    return response.data;
};

export const getSalesOrderById = async (id) => {
    const response = await api.get(
        `/api/marketing/sales-orders/${id}`
    );

    return response.data;
};

export const updateSalesOrderQuantities = async (id, data) => {
    const response = await api.patch(
        `/api/marketing/sales-orders/${id}/quantities`,
        data
    );

    return response.data;
};


// ==========================================
// SALES ORDER BOM
// ==========================================

export const getBomsByOrderId = async (orderId) => {
    const response = await api.get(
        `/api/marketing/sales-orders/${orderId}/boms`
    );

    return response.data;
};

export const createOrderBom = async (orderId, data) => {
    const response = await api.post(
        `/api/marketing/sales-orders/${orderId}/boms`,
        data
    );

    return response.data;
};

export const getOrderBomById = async (bomId) => {
    const response = await api.get(
        `/api/marketing/order-boms/${bomId}`
    );

    return response.data;
};

export const addYarnDetailToBom = async (bomId, data) => {
    const response = await api.post(
        `/api/marketing/order-boms/${bomId}/yarn-details`,
        data
    );

    return response.data;
};

export const updateYarnDetail = async (yarnDetailId, data) => {
    const response = await api.patch(
        `/api/marketing/order-boms/yarn-details/${yarnDetailId}`,
        data
    );

    return response.data;
};


// ============================================================
// PRODUCTION GATE CONTROL
// ============================================================

export const getGateControlsByOrderId = async (orderId) => {
    const response = await api.get(
        `/api/marketing/sales-orders/${orderId}/gate-controls`
    );

    return response.data;
};

export const approveGateA = async (orderId, data) => {
    const response = await api.post(
        `/api/marketing/sales-orders/${orderId}/gate-controls/gate-a-approve`,
        data
    );

    return response.data;
};

export const updatePpsStatus = async (orderId, data) => {
    const response = await api.patch(
        `/api/marketing/sales-orders/${orderId}/gate-controls/pps-status`,
        data
    );

    return response.data;
};

export const releaseGateC = async (orderId, data) => {
    const response = await api.post(
        `/api/marketing/sales-orders/${orderId}/gate-controls/gate-c-release`,
        data
    );

    return response.data;
};

// ============================================================
// DUMMY USERS
// TODO: Replace with real users API when available
// ============================================================

export const getUserById = async (id) => {
    const response = await api.get(`/api/marketing/users/${id}`);
    return response.data;
};

export const getAllUsers = async () => {
    return {
        success: true,
        data: [
            {
                id: "2d2830c9-5421-47e7-9b93-33547596f22d",
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
        ],
    };
};