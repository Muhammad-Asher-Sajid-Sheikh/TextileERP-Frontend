import api from "./api.js";

/*
|--------------------------------------------------------------------------
| Job Card APIs
|--------------------------------------------------------------------------
*/

// Create Job Card
export const createJobCard = async (payload) => {
  const response = await api.post(
    "/api/production/assembly/job-card/create",
    payload
  );

  return response.data;
};

// Get Single Job Card
export const getJobCard = async (jobCardId) => {
  const response = await api.get(
    `/api/production/assembly/job-card/${jobCardId}`
  );

  return response.data;
};

// Get All Job Cards for an Order
export const getJobCardsByOrder = async (orderTokenId) => {
  const response = await api.get(
    `/api/production/assembly/job-cards/${orderTokenId}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Phase APIs
|--------------------------------------------------------------------------
*/

// Log Phase
export const logAssemblyPhase = async (payload) => {
  const response = await api.post(
    "/api/production/assembly/phase/log",
    payload
  );

  return response.data;
};

// Complete Phase
export const completeAssemblyPhase = async (payload) => {
  const response = await api.post(
    "/api/production/assembly/phase/complete",
    payload
  );

  return response.data;
};

// Phase Status Summary
export const getAssemblyPhaseStatus = async (orderTokenId) => {
  const response = await api.get(
    `/api/production/assembly/phase-status/${orderTokenId}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Production Orders
|--------------------------------------------------------------------------
*/

// Used for Order Dropdown
export const getProductionOrderslist = async () => {
  const response = await api.get(
    "/api/production/yarn-fabric/list"
  );

  return response.data;
};

export const getProductionOrders = async () => {
    const response = await api.get(
        "/api/production/tech-packs/list"
    );

    return response.data.filter(
        (techPack) => techPack.orderTokenId
    );
};