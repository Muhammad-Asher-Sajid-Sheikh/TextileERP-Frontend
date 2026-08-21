import api from "./api";

/**
 * Get Pre Approved Samples
 */
export const getPreApprovedSamples = async (techPackId) => {

    const response = await api.get(
        `/api/merchandise/${techPackId}/pre-approved`
    );

    return response.data;

};

/**
 * Create Pre Approved Sample
 */
export const createPreApprovedSample = async (
    techPackId,
    data
) => {

    const response = await api.post(
        `/api/merchandise/${techPackId}/pre-approved-samples`,
        data
    );

    return response.data;

};

/**
 * Update Pre Approved Sample
 */
export const updatePreApprovedSample = async (
    id,
    data
) => {

    const response = await api.put(
        `/api/merchandise/pre-approved-samples/${id}`,
        data
    );

    return response.data;

};

/**
 * Delete Pre Approved Sample
 */
export const deletePreApprovedSample = async (id) => {

    const response = await api.delete(
        `/api/merchandise/pre-approved-samples/${id}`
    );

    return response.data;

};

/**
 * Delete PPS
 * (Backend API will be added later)
 */

/*
export const deletePreApprovedSample = async (id) => {

    const response = await api.delete(
        `/api/merchandise/pre-approved-samples/${id}`
    );

    return response.data;

};
*/