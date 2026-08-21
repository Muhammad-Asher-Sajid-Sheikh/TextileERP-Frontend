import api from "./api";

/**
 * Initialize a new Tech Pack
 */
export const initializeTechPack = async (data) => {
    const response = await api.post(
        "/api/merchandise/tech-packs/init",
        data
    );

    return response.data;
};

/**
 * Get all Tech Packs
 * (Backend endpoint will be available soon. For now it is hardcoded)
 */
export const getAllTechPacks = async () => {
    const response = await api.get(
        "/api/merchandise/tech-packs/list"
    );

    return response.data;
};

/**
 * Get single Tech Pack
 */
export const getTechPack = async (id) => {
    const response = await api.get(
        `/api/merchandise/tech-packs/${id}`
    );

    return response.data;
};

/**
 * Release Tech Pack
 */
export const releaseTechPack = async (id) => {
    const response = await api.post(
        `/api/merchandise/tech-packs/${id}/release`
    );

    return response.data;
};

/**
 * Create Revision
 */
export const createRevision = async (id) => {
    const response = await api.post(
        `/api/merchandise/tech-packs/${id}/revision`
    );

    return response.data;
};

/**
 * Create Component
 */
export const createComponent = async (techPackId, data) => {
    const response = await api.post(
        `/api/merchandise/tech-packs/${techPackId}/components`,
        data
    );

    return response.data;
};

/**
 * Delete Component
 */
export const deleteComponent = async (componentId) => {
    const response = await api.delete(
        `/api/merchandise/components/${componentId}`
    );

    return response.data;
};

/**
 * Create / Update Weaving Specification
 */
export const upsertWeavingSpec = async (techPackId, data) => {
    const response = await api.put(
        `/api/merchandise/tech-packs/${techPackId}/weaving-specs`,
        data
    );

    return response.data;
};

/**
 * Create / Update Dyeing Specification
 */
export const upsertDyeingSpec = async (techPackId, data) => {

    const response = await api.put(

        `/api/merchandise/tech-packs/${techPackId}/dyeing-specs`,

        data

    );

    return response.data;

};

/**
 * Get Commercial Rates
 */
export const getCommercialRates = async (techPackId) => {

    const response = await api.get(
        `/api/merchandise/commercial/rates/${techPackId}`
    );

    return response.data;

};

/**
 * Lock Commercial Rates
 */
export const lockCommercialRates = async (data) => {

    const response = await api.post(
        "/api/merchandise/commercial/rates/lock",
        data
    );

    return response.data;

};

