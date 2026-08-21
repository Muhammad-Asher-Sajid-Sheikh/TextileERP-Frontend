import api from "./api.js";

/**
 * ==========================================
 * Yarn & Fabric Production APIs
 * ==========================================
 */

/**
 * Get All Yarn & Fabric Production Records
 * GET /production/yarn-fabric/list
 */
export const getYarnFabricList = async () => {
    const response = await api.get(
        "/api/production/yarn-fabric/list"
    );

    return response.data;
};

/**
 * Start Yarn Twisting
 * POST /production/yarn-fabric/twisting/initiate
**/
export const initiateYarnTwisting = async (data) => {
    const response = await api.post(
        "/api/production/yarn-fabric/twisting/initiate",
        data
    );

    return response.data;
};

/**
 * Complete Yarn Twisting
 * POST /production/yarn-fabric/twisting/complete
 */
export const completeYarnTwisting = async (data) => {
    const response = await api.post(
        "/api/production/yarn-fabric/twisting/complete",
        data
    );

    return response.data;
};

/**
 * Dispatch to Weaving Vendor
 * POST /production/yarn-fabric/weaving/dispatch
 */
export const dispatchToWeaving = async (data) => {
    const response = await api.post(
        "/api/production/yarn-fabric/weaving/dispatch",
        data
    );

    return response.data;
};

/**
 * Log Fabric Output
 * POST /production/yarn-fabric/fabric-output/log
 */
export const logFabricOutput = async (data) => {
    const response = await api.post(
        "/api/production/yarn-fabric/fabric-output/log",
        data
    );

    return response.data;
};

/**
 * Get Production Status
 * GET /production/yarn-fabric/status/:orderTokenId
 */
export const getYarnFabricStatus = async (orderTokenId) => {
    const response = await api.get(
        `/api/production/yarn-fabric/status/${orderTokenId}`
    );

    return response.data;
};

/**
 * ==========================================
 * Wet Processing APIs
 * ==========================================
 */

/**
 * Dispatch Fabric for Wet Processing
 * POST /production/wet-processing/dispatch
 */
export const dispatchWetProcessing = async (data) => {
    const response = await api.post(
        "/api/production/wet-processing/dispatch",
        data
    );

    return response.data;
};

/**
 * Complete Wet Processing
 * POST /production/wet-processing/complete
 */
export const completeWetProcessing = async (data) => {
    const response = await api.post(
        "/api/production/wet-processing/complete",
        data
    );

    return response.data;
};

/**
 * Get Wet Processing Status
 * GET /production/wet-processing/status/:orderTokenId
 */
export const getWetProcessingStatus = async (orderTokenId) => {
    const response = await api.get(
        `/api/production/wet-processing/status/${orderTokenId}`
    );

    return response.data;
};

/**
 * Get Wet Processing List
 * GET /production/wet-processing/list
 * (Temporary endpoint)
 */
export const getWetProcessingList = async () => {
    const response = await api.get(
        "/api/production/wet-processing/lists"
    );

    return response.data;
};

/**
 * ==========================================
 * Quality Testing APIs
 * ==========================================
 */

/**
 * Log Quality Test
 * POST /production/wet-processing/quality-test
 */
export const logQualityTest = async (data) => {
    const response = await api.post(
        "/api/production/wet-processing/quality-test/log",
        data
    );

    return response.data;
};

/**
 * Get Quality Test Status
 * GET /production/wet-processing/quality-test/status/:orderTokenId
 */
export const getQualityTestStatus = async (orderTokenId) => {
    const response = await api.get(
        `/api/production/wet-processing/quality-test/status/${orderTokenId}`
    );

    return response.data;
};

/**
 * Get Quality Test List
 * GET /production/wet-processing/quality-test/list
 * (Temporary endpoint)
 */
export const getQualityTestList = async () => {
    const response = await api.get(
        "/api/production/wet-processing/quality-test/list"
    );

    return response.data;
};