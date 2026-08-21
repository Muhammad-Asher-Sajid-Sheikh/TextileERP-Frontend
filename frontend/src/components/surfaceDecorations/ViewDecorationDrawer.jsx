import "../../styles/surfaceDecorations/modal.css";

const ViewDecorationDrawer = ({
    isOpen,
    onClose,
    decoration,
    selectedProcess,
}) => {

    if (!isOpen || !decoration) return null;

    const isPrinting = selectedProcess === "PRINTING";

    return (
        <div className="drawer-overlay">

            <div className="drawer">

                <div className="drawer-header">

                    <h2>
                        {isPrinting
                            ? "Printing Details"
                            : "Embroidery Details"}
                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <div className="drawer-body">

                    <div className="detail-row">
                        <strong>Order Token</strong>
                        <span>{decoration.orderTokenId}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Status</strong>
                        <span>{decoration.status}</span>
                    </div>

                    {isPrinting ? (
                        <>
                            <div className="detail-row">
                                <strong>Rolls Sent</strong>
                                <span>{decoration.rollsSent ?? "-"}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Rolls Returned</strong>
                                <span>{decoration.rollsReturned ?? "-"}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Audit Completed</strong>
                                <span>
                                    {decoration.specAuditCompleted
                                        ? "Yes"
                                        : "No"}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="detail-row">
                                <strong>Total Pieces Cut</strong>
                                <span>
                                    {decoration.totalPiecesCut ?? "-"}
                                </span>
                            </div>

                            <div className="detail-row">
                                <strong>Pieces Sent</strong>
                                <span>
                                    {decoration.piecesSent ?? "-"}
                                </span>
                            </div>

                            <div className="detail-row">
                                <strong>Pieces Returned</strong>
                                <span>
                                    {decoration.piecesReturned ?? "-"}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="detail-row">
                        <strong>Discrepancy</strong>

                        <span>
                            {decoration.hasDiscrepancy
                                ? "Yes"
                                : "No"}
                        </span>
                    </div>

                    {decoration.discrepancyMessage && (
                        <div className="detail-row">

                            <strong>Remarks</strong>

                            <span>
                                {decoration.discrepancyMessage}
                            </span>

                        </div>
                    )}

                    <div className="detail-row">
                        <strong>Updated</strong>

                        <span>
                            {decoration.updatedAt
                                ? new Date(
                                      decoration.updatedAt
                                  ).toLocaleString()
                                : "-"}
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ViewDecorationDrawer;