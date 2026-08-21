import React from "react";
import "../../../styles/marketing/partyService/drawer.css";

const ViewPartyDrawer = ({
    isOpen,
    party,
    onClose,
}) => {
    if (!isOpen || !party) return null;

    const formatBoolean = (value) => (value ? "Yes" : "No");

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString();
    };

    return (
        <>
            <div
                className="drawer-overlay"
                onClick={onClose}
            />

            <div className="drawer">

                <div className="drawer-header">

                    <h2>Party Details</h2>

                    <button
                        className="drawer-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="drawer-body">

                    <div className="drawer-section">

                        <h3>Basic Information</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>Party Code</label>
                                <span>{party.partyCode}</span>
                            </div>

                            <div className="drawer-item">
                                <label>Legal Name</label>
                                <span>{party.legalName}</span>
                            </div>

                            <div className="drawer-item">
                                <label>Country</label>
                                <span>{party.country}</span>
                            </div>

                            <div className="drawer-item">
                                <label>Contact Email</label>
                                <span>{party.contactEmail}</span>
                            </div>

                        </div>

                    </div>

                    <div className="drawer-section">

                        <h3>Party Roles</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>Customer</label>

                                <span
                                    className={
                                        party.isCustomer
                                            ? "status-badge status-yes"
                                            : "status-badge status-no"
                                    }
                                >
                                    {formatBoolean(
                                        party.isCustomer
                                    )}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Legal Buyer</label>

                                <span
                                    className={
                                        party.isLegalBuyer
                                            ? "status-badge status-yes"
                                            : "status-badge status-no"
                                    }
                                >
                                    {formatBoolean(
                                        party.isLegalBuyer
                                    )}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Payment Remitter</label>

                                <span
                                    className={
                                        party.isPaymentRemitter
                                            ? "status-badge status-yes"
                                            : "status-badge status-no"
                                    }
                                >
                                    {formatBoolean(
                                        party.isPaymentRemitter
                                    )}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Consignee</label>

                                <span
                                    className={
                                        party.isConsignee
                                            ? "status-badge status-yes"
                                            : "status-badge status-no"
                                    }
                                >
                                    {formatBoolean(
                                        party.isConsignee
                                    )}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Ultimate Client</label>

                                <span
                                    className={
                                        party.isUltimateClient
                                            ? "status-badge status-yes"
                                            : "status-badge status-no"
                                    }
                                >
                                    {formatBoolean(
                                        party.isUltimateClient
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                    <div className="drawer-section">

                        <h3>System Information</h3>

                        <div className="drawer-grid">

                            <div className="drawer-item">
                                <label>Created At</label>

                                <span>
                                    {formatDate(
                                        party.createdAt
                                    )}
                                </span>
                            </div>

                            <div className="drawer-item">
                                <label>Updated At</label>

                                <span>
                                    {formatDate(
                                        party.updatedAt
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};

export default ViewPartyDrawer;