import React from "react";
import "../../styles/production/productionDrawer.css";

const getStatusBadgeClass = (status) => {
    switch (status) {
        case "COMPLETED":
        case "PASSED":
            return "drawer-status completed";

        case "INPROGRESS":
            return "drawer-status in-progress";

        case "PENDING":
            return "drawer-status pending";

        case "FAILED":
            return "drawer-status failed";

        case "NOT_REQUIRED":
            return "drawer-status not-required";

        default:
            return "drawer-status";
    }
};

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return value;
};

const ProductionViewDrawer = ({
    isOpen,
    record,
    onClose,
    activeTab,
    wetProcessingView,
}) => {
    if (!isOpen || !record) return null;

    const renderYarnFabric = () => (
        <>
            <div className="drawer-section">
                <h3>Order Information</h3>

                <div className="drawer-item">
                    <span>Order Token</span>
                    <strong>{record.orderTokenId}</strong>
                </div>

                <div className="drawer-item">
                    <span>Loom Log ID</span>
                    <strong>{formatValue(record.loomLogId)}</strong>
                </div>
            </div>

            <div className="drawer-section">
                <h3>Twisting</h3>

                <div className="drawer-item">
                    <span>Status</span>

                    <span
                        className={getStatusBadgeClass(
                            record.yarnTwistingStatus
                        )}
                    >
                        {formatValue(record.yarnTwistingStatus)}
                    </span>
                </div>

                <div className="drawer-item">
                    <span>Completed At</span>

                    <strong>
                        {record.twistingCompletedAt
                            ? new Date(
                                  record.twistingCompletedAt
                              ).toLocaleString()
                            : "-"}
                    </strong>
                </div>
            </div>

            <div className="drawer-section">
                <h3>Weaving</h3>

                <div className="drawer-item">
                    <span>Status</span>

                    <span
                        className={getStatusBadgeClass(
                            record.weavingStatus
                        )}
                    >
                        {formatValue(record.weavingStatus)}
                    </span>
                </div>
            </div>

            {record.fabricMetrics && (
                <div className="drawer-section">
                    <h3>Fabric Metrics</h3>

                    <div className="drawer-item">
                        <span>Roll Pieces</span>
                        <strong>
                            {formatValue(
                                record.fabricMetrics.rollPieceCount
                            )}
                        </strong>
                    </div>

                    <div className="drawer-item">
                        <span>Total Weight</span>
                        <strong>
                            {formatValue(
                                record.fabricMetrics.totalMassWeight
                            )}
                        </strong>
                    </div>

                    <div className="drawer-item">
                        <span>Fabric GSM</span>
                        <strong>
                            {formatValue(
                                record.fabricMetrics.fabricDensityGsm
                            )}
                        </strong>
                    </div>

                    <div className="drawer-item">
                        <span>Total Length</span>
                        <strong>
                            {formatValue(
                                record.fabricMetrics.totalLength
                            )}
                        </strong>
                    </div>
                </div>
            )}
        </>
    );

    const renderWetProcessing = () => (
        <>
            <div className="drawer-section">
                <h3>Order Information</h3>

                <div className="drawer-item">
                    <span>Order Token</span>
                    <strong>{record.orderTokenId}</strong>
                </div>

                <div className="drawer-item">
                    <span>Wet Processing Log ID</span>
                    <strong>
                        {formatValue(record.wetProcessingLogId)}
                    </strong>
                </div>
            </div>

            <div className="drawer-section">
                <h3>Wet Processing</h3>

                <div className="drawer-item">
                    <span>Status</span>

                    <span
                        className={getStatusBadgeClass(record.status)}
                    >
                        {formatValue(record.status)}
                    </span>
                </div>

                <div className="drawer-item">
                    <span>Input Weight</span>
                    <strong>
                        {formatValue(record.inputTotalWeight)}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Output Weight</span>
                    <strong>
                        {formatValue(record.outputTotalWeight)}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Weight Loss %</span>
                    <strong>
                        {formatValue(record.weightLossPercentage)}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Within Tolerance</span>
                    <strong>
                        {record.isWithinTolerance === undefined
                            ? "-"
                            : record.isWithinTolerance
                            ? "Yes"
                            : "No"}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Returned At</span>
                    <strong>
                        {record.returnedAt
                            ? new Date(
                                  record.returnedAt
                              ).toLocaleString()
                            : "-"}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Returned From</span>
                    <strong>
                        {formatValue(record.returnedFrom)}
                    </strong>
                </div>
            </div>

            {record.claimDispute && (
                <div className="drawer-section">
                    <h3>Claim Dispute</h3>

                    <div className="drawer-item">
                        <span>Claim ID</span>
                        <strong>
                            {record.claimDispute.claimDisputeId}
                        </strong>
                    </div>

                    <div className="drawer-item">
                        <span>Status</span>

                        <span
                            className={getStatusBadgeClass(
                                record.claimDispute.claimStatus
                            )}
                        >
                            {record.claimDispute.claimStatus}
                        </span>
                    </div>

                    <div className="drawer-item">
                        <span>Message</span>
                        <strong>
                            {record.claimDispute.message}
                        </strong>
                    </div>
                </div>
            )}
        </>
    );

    const renderQualityTesting = () => (
        <>
            <div className="drawer-section">
                <h3>Quality Test</h3>

                <div className="drawer-item">
                    <span>Wet Processing Log ID</span>
                    <strong>
                        {formatValue(record.wetProcessingLogId)}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Test Type</span>
                    <strong>
                        {formatValue(record.testType)}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Result</span>

                    <span
                        className={getStatusBadgeClass(record.result)}
                    >
                        {formatValue(record.result)}
                    </span>
                </div>

                <div className="drawer-item">
                    <span>Tested By</span>
                    <strong>
                        {formatValue(record.testedBy)}
                    </strong>
                </div>

                <div className="drawer-item">
                    <span>Tested At</span>
                    <strong>
                        {record.testedAt
                            ? new Date(
                                  record.testedAt
                              ).toLocaleString()
                            : "-"}
                    </strong>
                </div>
            </div>
        </>
    );

    return (
        <>
            <div
                className="production-drawer-overlay"
                onClick={onClose}
            />

            <div className="production-drawer">
                <div className="production-drawer-header">
                    <h2>Production Details</h2>

                    <button
                        className="drawer-close-btn"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <div className="production-drawer-body">
                    {activeTab === "yarnFabric"
                        ? renderYarnFabric()
                        : wetProcessingView ===
                          "wetProcessing"
                        ? renderWetProcessing()
                        : renderQualityTesting()}
                </div>
            </div>
        </>
    );
};

export default ProductionViewDrawer;