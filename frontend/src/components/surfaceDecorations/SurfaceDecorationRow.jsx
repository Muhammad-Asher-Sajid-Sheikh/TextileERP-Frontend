import React from "react";

const SurfaceDecorationRow = ({
    record,
    selectedProcess,
    onView,
    onDispatch,
    onComplete,
}) => {
    const isPrinting = selectedProcess === "PRINTING";

    return (
        <tr>

            <td>
                {record.designName || record.orderTokenId}
            </td>

            <td>
                {isPrinting
                    ? record.rollsSent
                    : record.totalPiecesCut}
            </td>

            <td>
                <span
                    className={`status-badge status-${record.status?.toLowerCase()}`}
                >
                    {record.status}
                </span>
            </td>

            <td>
                {record.updatedAt
                    ? new Date(record.updatedAt).toLocaleString()
                    : "-"}
            </td>

            <td className="actions">

                <button
                    className="view-btn"
                    onClick={() => onView(record)}
                >
                    View
                </button>

                {!isPrinting &&
                    record.status === "INITIATED" && (
                        <button
                            className="dispatch-btn"
                            onClick={() => onDispatch(record)}
                        >
                            Dispatch
                        </button>
                    )}

                {(record.status === "INPROGRESS" ||
                    record.status === "INITIATED") && (
                    <button
                        className="complete-btn"
                        onClick={() => onComplete(record)}
                    >
                        Complete
                    </button>
                )}

            </td>

        </tr>
    );
};

export default SurfaceDecorationRow;