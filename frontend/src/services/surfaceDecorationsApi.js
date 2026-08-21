import api from "./api";

// ========================================
// PRINTING
// ========================================

export const getPrintingRecords = async (orderTokenId) => {
    const response = await api.get(
        `/api/production/decoration/printing/records/${orderTokenId}`
    );

    return response.data;
};

export const completePrinting = async (payload) => {
    const response = await api.post(
        "/api/production/decoration/printing/complete",
        payload
    );

    return response.data.data;
};

export const dispatchPrinting = async (payload) => {
    console.log(payload);
    const response = await api.post(
        "/api/production/decoration/printing/dispatch",
        payload
    );

    return response.data.data;
};

// ========================================
// EMBROIDERY
// ========================================

export const getEmbroideryRecords = async (orderTokenId) => {
    const response = await api.get(
        `/api/production/decoration/embroidery/records/${orderTokenId}`
    );

    return response.data;
};

export const initiateEmbroidery = async (payload) => {
    console.log("Initiate Embroidery Payload:", payload);

    const response = await api.post(
        "/api/production/decoration/embroidery/initiate",
        payload
    );

    return response.data.data;
};

export const dispatchEmbroidery = async (payload) => {
    const response = await api.post(
        "/api/production/decoration/embroidery/dispatch",
        payload
    );

    return response.data.data;
};

export const completeEmbroidery = async (payload) => {
    const response = await api.post(
        "/api/production/decoration/embroidery/complete",
        payload
    );

    return response.data.data;
};

// ========================================
// COMMON
// ========================================

export const getDecorationStatus = async (orderTokenId) => {
    const response = await api.get(
        `/api/production/decoration/status/${orderTokenId}`
    );

    return response.data.data;
};

// Used by the toolbar Order dropdown
export const getProductionOrders = async () => {
    const response = await api.get(
        "/api/production/tech-packs/list"
    );

    console.log("Production Orders Response:", response.data);

    return response.data.filter(
        (techPack) => techPack.orderTokenId
    );
};