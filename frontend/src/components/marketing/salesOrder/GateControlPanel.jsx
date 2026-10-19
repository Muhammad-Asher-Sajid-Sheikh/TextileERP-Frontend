import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getGateControlsByOrderId,
    approveGateA,
    updatePpsStatus,
    releaseGateC,
    getUserById,
} from "../../../services/marketingApi";

import "../../../styles/marketing/salesOrder/gateControlPanel.css";

const GateControlPanel = ({ salesOrder }) => {
    const [gateControl, setGateControl] = useState(null);

    const [loading, setLoading] = useState(false);

    const [gateAApproverId, setGateAApproverId] = useState("");
    const [controlledInitialLotQty, setControlledInitialLotQty] =
        useState("");

    const [ppsStatus, setPpsStatus] = useState("");
    const [ppsWaiverReason, setPpsWaiverReason] = useState("");

    const [gateCApproverId, setGateCApproverId] = useState("");

    const [savingGateA, setSavingGateA] = useState(false);
    const [savingGateB, setSavingGateB] = useState(false);
    const [savingGateC, setSavingGateC] = useState(false);

    const loadGateControl = async () => {
        if (!salesOrder?.id) {
            return;
        }

        try {
            setLoading(true);

            const response = await getGateControlsByOrderId(
                salesOrder.id
            );

            setGateControl(response?.data || null);
            if (response?.data) {
                setPpsStatus(response.data.ppsStatus || "");
                setPpsWaiverReason(
                    response.data.ppsWaiverReason || ""
                );
            }
        } catch (error) {
            // 404 means the gate control record does not exist yet.
            if (error?.response?.status === 404) {
                setGateControl(null);
            } else {
                console.error(
                    "Failed to load gate control:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load gate control."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGateControl();
    }, [salesOrder?.id]);

    const handleApproveGateA = async (e) => {
        e.preventDefault();

        if (!gateAApproverId.trim()) {
            toast.error("Gate A Approver ID is required.");
            return;
        }

        try {
            setSavingGateA(true);

            const payload = {
                gateAApproverId: gateAApproverId.trim(),
            };

            if (
                controlledInitialLotQty !== "" &&
                controlledInitialLotQty !== null
            ) {
                payload.controlledInitialLotQty =
                    Number(controlledInitialLotQty);
            }

            const response = await approveGateA(
                salesOrder.id,
                payload
            );

            setGateControl(response?.data || null);

            toast.success("Gate A approved successfully.");
        } catch (error) {
            console.error("Gate A approval failed:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to approve Gate A."
            );
        } finally {
            setSavingGateA(false);
        }
    };

    const handleUpdatePpsStatus = async (e) => {
        e.preventDefault();

        if (!ppsStatus.trim()) {
            toast.error("PPS Status is required.");
            return;
        }

        try {
            setSavingGateB(true);

            const payload = {
                ppsStatus: ppsStatus.trim(),
            };

            if (ppsWaiverReason.trim()) {
                payload.ppsWaiverReason =
                    ppsWaiverReason.trim();
            }

            const response = await updatePpsStatus(
                salesOrder.id,
                payload
            );

            setGateControl(response?.data || null);

            toast.success("PPS status updated successfully.");
        } catch (error) {
            console.error(
                "PPS status update failed:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to update PPS status."
            );
        } finally {
            setSavingGateB(false);
        }
    };
    const approverUsers = [
        {
            id: "2d2830c9-5421-47e7-9b93-33547596f22d",
            name: "User 1",
        },
        {
            id: "PUT_REAL_USER_UUID_HERE",
            name: "User 2",
        },
    ];
    const handleReleaseGateC = async (e) => {
        e.preventDefault();

        if (!gateCApproverId.trim()) {
            toast.error("Gate C Approver ID is required.");
            return;
        }

        try {
            setSavingGateC(true);

            const response = await releaseGateC(
                salesOrder.id,
                {
                    gateCApproverId:
                        gateCApproverId.trim(),
                }
            );

            setGateControl(response?.data || null);

            toast.success(
                "Gate C released. Bulk production is now unblocked."
            );
        } catch (error) {
            console.error(
                "Gate C release failed:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to release Gate C."
            );
        } finally {
            setSavingGateC(false);
        }
    };

    if (loading) {
        return (
            <div className="gate-control-panel">
                <div className="gate-control-loading">
                    Loading production gate control...
                </div>
            </div>
        );
    }

    return (
        <div className="gate-control-panel">
            <div className="gate-control-title-row">
                <div>
                    <h3>Production Gate Control</h3>

                    <p>
                        Manage Gate A, Gate B technical readiness,
                        and Gate C bulk production release.
                    </p>
                </div>

                <span
                    className={
                        salesOrder.isBulkProductionBlocked
                            ? "gate-status-badge gate-status-blocked"
                            : "gate-status-badge gate-status-released"
                    }
                >
                    {salesOrder.isBulkProductionBlocked
                        ? "BULK BLOCKED"
                        : "BULK RELEASED"}
                </span>
            </div>

            {/* ==================================================
                GATE A
            ================================================== */}

            <section className="gate-control-card">
                <div className="gate-control-card-header">
                    <div>
                        <h4>Gate A — Controlled Pre-Production</h4>

                        <p>
                            Approve the controlled initial production
                            lot.
                        </p>
                    </div>

                    <span
                        className={
                            gateControl?.gateAApproved
                                ? "gate-mini-status gate-mini-approved"
                                : "gate-mini-status gate-mini-pending"
                        }
                    >
                        {gateControl?.gateAApproved
                            ? "APPROVED"
                            : "NOT APPROVED"}
                    </span>
                </div>

                <div className="gate-control-info-grid">
                    <div>
                        <strong>Approver</strong>

                        <span>
                            {gateControl?.gateAApprover?.name ||
                                "-"}
                        </span>
                    </div>

                    <div>
                        <strong>Initial Lot Qty</strong>

                        <span>
                            {gateControl?.controlledInitialLotQty ??
                                "-"}
                        </span>
                    </div>
                </div>

                <form
                    onSubmit={handleApproveGateA}
                    className="gate-control-form"
                >
                    <div className="gate-control-form-group">
                        <label>Gate A Approver</label>

                        <select
                            value={gateAApproverId}
                            onChange={async (e) => {
                                const userId = e.target.value;

                                setGateAApproverId(userId);

                                if (!userId) {
                                    return;
                                }

                                try {
                                    const response = await getUserById(userId);

                                    console.log("Selected Gate A Approver:", response.data);
                                } catch (error) {
                                    console.error(
                                        "Failed to fetch Gate A approver:",
                                        error
                                    );
                                }
                            }}
                        >
                            <option value="">Select Approver</option>

                            {approverUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="gate-control-form-group">
                        <label>
                            Controlled Initial Lot Qty
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={controlledInitialLotQty}
                            onChange={(e) =>
                                setControlledInitialLotQty(
                                    e.target.value
                                )
                            }
                            placeholder="Enter quantity"
                        />
                    </div>

                    <button
                        type="submit"
                        className="gate-control-primary-btn"
                        disabled={savingGateA}
                    >
                        {savingGateA
                            ? "Approving..."
                            : "Approve Gate A"}
                    </button>
                </form>
            </section>

            {/* ==================================================
                GATE B
            ================================================== */}

            <section className="gate-control-card">
                <div className="gate-control-card-header">
                    <div>
                        <h4>
                            Gate B — Technical Readiness
                        </h4>

                        <p>
                            Update the PPS technical readiness
                            status.
                        </p>
                    </div>

                    <span className="gate-mini-status gate-mini-info">
                        {gateControl?.ppsStatus || "NOT SET"}
                    </span>
                </div>

                <div className="gate-control-info-grid">
                    <div>
                        <strong>PPS Status</strong>

                        <span>
                            {gateControl?.ppsStatus || "-"}
                        </span>
                    </div>

                    <div>
                        <strong>Waiver Reason</strong>

                        <span>
                            {gateControl?.ppsWaiverReason ||
                                "-"}
                        </span>
                    </div>
                </div>

                <form
                    onSubmit={handleUpdatePpsStatus}
                    className="gate-control-form"
                >
                    <div className="gate-control-form-group">
                        <label>
                            PPS Status
                        </label>

                        <select
                            value={ppsStatus}
                            onChange={(e) =>
                                setPpsStatus(e.target.value)
                            }
                        >
                            <option value="">
                                Select PPS Status
                            </option>

                            <option value="PREPARATION_PENDING">
                                Preparation Pending
                            </option>

                            <option value="SUBMITTED">
                                Submitted
                            </option>

                            <option value="APPROVED">
                                Approved
                            </option>

                            <option value="WAIVED">
                                Waived
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>
                        </select>
                    </div>

                    <div className="gate-control-form-group">
                        <label>
                            PPS Waiver Reason
                        </label>

                        <input
                            type="text"
                            value={ppsWaiverReason}
                            onChange={(e) =>
                                setPpsWaiverReason(
                                    e.target.value
                                )
                            }
                            placeholder="Optional"
                        />
                    </div>

                    <button
                        type="submit"
                        className="gate-control-primary-btn"
                        disabled={savingGateB}
                    >
                        {savingGateB
                            ? "Updating..."
                            : "Update PPS Status"}
                    </button>
                </form>
            </section>

            {/* ==================================================
                GATE C
            ================================================== */}

            <section className="gate-control-card gate-c-card">
                <div className="gate-control-card-header">
                    <div>
                        <h4>
                            Gate C — Bulk Production Release
                        </h4>

                        <p>
                            Release the Sales Order for bulk
                            production.
                        </p>
                    </div>

                    <span
                        className={
                            gateControl?.gateCBulkReleased
                                ? "gate-mini-status gate-mini-approved"
                                : "gate-mini-status gate-mini-pending"
                        }
                    >
                        {gateControl?.gateCBulkReleased
                            ? "RELEASED"
                            : "NOT RELEASED"}
                    </span>
                </div>

                <div className="gate-control-info-grid">
                    <div>
                        <strong>Bulk Production</strong>

                        <span>
                            {salesOrder.isBulkProductionBlocked
                                ? "BLOCKED"
                                : "RELEASED"}
                        </span>
                    </div>

                    <div>
                        <strong>Gate C Approver</strong>

                        <span>
                            {gateControl?.gateCApprover?.name ||
                                "-"}
                        </span>
                    </div>

                    <div>
                        <strong>Release Timestamp</strong>

                        <span>
                            {gateControl?.gateCApprovalTimestamp
                                ? new Date(
                                    gateControl.gateCApprovalTimestamp
                                ).toLocaleString()
                                : "-"}
                        </span>
                    </div>
                </div>

                <form
                    onSubmit={handleReleaseGateC}
                    className="gate-control-form"
                >
                    <div className="gate-control-form-group">
                        <label>
                            Gate C Approver
                        </label>

                        <select
                            value={gateCApproverId}
                            onChange={async (e) => {
                                const userId = e.target.value;

                                setGateCApproverId(userId);

                                if (!userId) {
                                    return;
                                }

                                try {
                                    const response = await getUserById(userId);

                                    console.log(
                                        "Selected Gate C Approver:",
                                        response.data
                                    );
                                } catch (error) {
                                    console.error(
                                        "Failed to fetch Gate C approver:",
                                        error
                                    );
                                }
                            }}
                        >
                            <option value="">
                                Select Approver
                            </option>

                            {approverUsers.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="gate-control-release-btn"
                        disabled={
                            savingGateC ||
                            !salesOrder.isBulkProductionBlocked
                        }
                    >
                        {savingGateC
                            ? "Releasing..."
                            : gateControl?.gateCBulkReleased
                                ? "Gate C Released"
                                : "Release Gate C"}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default GateControlPanel;