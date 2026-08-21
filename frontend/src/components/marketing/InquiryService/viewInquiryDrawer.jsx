import React, { useEffect, useState } from "react";
import "../../../styles/marketing/partyService/drawer.css";

const ViewInquiryDrawer = ({
    isOpen,
    inquiry,
    merchandiserOptions = [],
    onStatusUpdate,
    onAssignMerchandiser,
    onClose,
}) => {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedMerchandiser, setSelectedMerchandiser] = useState("");

    useEffect(() => {
        if (inquiry) {
            setSelectedStatus(inquiry.status || "");
            setSelectedMerchandiser(
                inquiry.assignedMerchandiserId || ""
            );
        }
    }, [inquiry]);

    if (!isOpen || !inquiry) return null;

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString();
    };

    const statusOptions = [
        "RECEIVED",
        "UNDER_FEASIBILITY",
        "COSTING_IN_PROGRESS",
        "QUOTED",
        "SAMPLE_DEVELOPMENT",
        "PO_RECEIVED",
        "CONVERTED_TO_ORDER",
        "REJECTED",
        "CANCELLED",
    ];

    return (
        <>
            <div
                className="drawer-overlay"
                onClick={onClose}
            />

            <div className="drawer">

                <div className="drawer-header">
                    <h2>Inquiry Details</h2>

                    <button
                        className="drawer-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="drawer-body">

                    {/* ================= Inquiry Information ================= */}

                    <div className="drawer-section">

                        <h3>Inquiry Information</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>ICN Number</label>
                                <span>{inquiry.icnNumber}</span>
                            </div>

                            <div className="drawer-item">
                                <label>Channel</label>
                                <span>{inquiry.channel}</span>
                            </div>

                            <div className="drawer-item">
                                <label>Priority</label>
                                <span>{inquiry.priority}</span>
                            </div>

                            <div className="drawer-item">
                                <label>Status</label>
                                <span>{inquiry.status}</span>
                            </div>

                            <div className="drawer-item">
                                <label>Response Due Date</label>
                                <span>
                                    {formatDate(
                                        inquiry.responseDueDate
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* ================= Customer ================= */}

                    <div className="drawer-section">

                        <h3>Customer Information</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>Party Code</label>
                                <span>
                                    {inquiry.customer?.partyCode || "-"}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Legal Name</label>
                                <span>
                                    {inquiry.customer?.legalName || "-"}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Country</label>
                                <span>
                                    {inquiry.customer?.country || "-"}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Contact Email</label>
                                <span>
                                    {inquiry.customer?.contactEmail || "-"}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* ================= Assignment ================= */}

                    <div className="drawer-section">

                        <h3>Assignment</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>Assigned Merchandiser</label>
                                <span>
                                    {merchandiserOptions.find(
                                        (user) =>
                                            user.value ===
                                            inquiry.assignedMerchandiserId
                                    )?.label || "-"}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Communication Attachment</label>

                                {inquiry.originalCommAttachment ? (
                                    <a
                                        href={
                                            inquiry.originalCommAttachment
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open Attachment
                                    </a>
                                ) : (
                                    <span>-</span>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* ================= Workflow ================= */}

                    <div className="drawer-section">

                        <h3>Workflow Actions</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>Update Status</label>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(
                                            e.target.value
                                        )
                                    }
                                >
                                    {statusOptions.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    className="primary-btn"
                                    style={{ marginTop: "10px" }}
                                    onClick={() =>
                                        onStatusUpdate(
                                            inquiry.id,
                                            selectedStatus
                                        )
                                    }
                                >
                                    Update Status
                                </button>
                            </div>

                            <div className="drawer-item">
                                <label>Assign Merchandiser</label>

                                <select
                                    value={selectedMerchandiser}
                                    onChange={(e) =>
                                        setSelectedMerchandiser(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select Merchandiser
                                    </option>

                                    {merchandiserOptions.map((user) => (
                                        <option
                                            key={user.value}
                                            value={user.value}
                                        >
                                            {user.label}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    className="primary-btn"
                                    style={{ marginTop: "10px" }}
                                    onClick={() =>
                                        onAssignMerchandiser(
                                            inquiry.id,
                                            selectedMerchandiser
                                        )
                                    }
                                >
                                    Assign Merchandiser
                                </button>
                            </div>

                        </div>

                    </div>

                    {/* ================= System ================= */}

                    <div className="drawer-section">

                        <h3>System Information</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>Created At</label>
                                <span>
                                    {formatDate(inquiry.createdAt)}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Updated At</label>
                                <span>
                                    {formatDate(inquiry.updatedAt)}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};

export default ViewInquiryDrawer;