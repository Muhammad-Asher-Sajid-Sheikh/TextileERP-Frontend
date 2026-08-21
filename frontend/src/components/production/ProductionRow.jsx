import React from "react";

const getStatusBadgeClass = (status) => {
    switch (status) {
        case "COMPLETED":
            return "status-badge completed";

        case "INPROGRESS":
            return "status-badge in-progress";

        case "PENDING":
            return "status-badge pending";

        case "NOT_REQUIRED":
            return "status-badge not-required";

        default:
            return "status-badge";
    }
};

const ProductionRow = ({
    record,

    activeTab,
    wetProcessingView,

    onView,

    onComplete,

    onDispatch,

    onFabricOutput,

    onQualityTest,
}) => {
    if (activeTab === "yarnFabric") {

        return (

            <tr>

                <td>{record.orderTokenId}</td>

                <td>{record.yarnTwistingStatus}</td>

                <td>{record.weavingStatus}</td>

                <td>
                    {record.updatedAt
                        ? new Date(record.updatedAt).toLocaleString()
                        : "-"}
                </td>

                <td className="action-buttons">

                    {
                        record.yarnTwistingStatus === "PENDING" && (

                            <button
                                className="action-btn success"
                                onClick={() => onComplete(record)}
                            >
                                Complete
                            </button>

                        )
                    }

                    {
                        record.yarnTwistingStatus === "COMPLETED" &&
                        record.weavingStatus === "NOT_STARTED" && (

                            <button
                                className="action-btn primary"
                                onClick={() => onDispatch(record)}
                            >
                                Dispatch
                            </button>

                        )
                    }

                    {
                        record.weavingStatus === "INPROGRESS" && (

                            <button
                                className="action-btn warning"
                                onClick={() => onFabricOutput(record)}
                            >
                                Output
                            </button>

                        )
                    }

                    <button
                        className="action-btn secondary"
                        onClick={() => onView(record)}
                    >
                        View
                    </button>

                </td>

            </tr>

        );

    }

    if (wetProcessingView === "wetProcessing") {

        return (

            <tr>

                <td>{record.orderTokenId}</td>

                <td>{record.status}</td>

                
                <td>{record.inputTotalWeight}</td>

                <td>
                    {record.updatedAt
                        ? new Date(record.updatedAt).toLocaleString()
                        : "-"}
                </td>

                <td className="action-buttons">

                    {
                        record.status === "PENDING" && (

                            <button
                                className="action-btn success"
                                onClick={() => onComplete(record)}
                            >
                                Complete
                            </button>

                        )
                    }

                    <button
                        className="action-btn secondary"
                        onClick={() => onView(record)}
                    >
                        View
                    </button>

                </td>

            </tr>

        );

    }

    return (

        <tr>

            <td>{record.id}</td>

            <td>{record.testType}</td>

            <td>{record.result}</td>

            <td>{record.wetProcessingLogId}</td>

            <td className="action-buttons">

                <button
                    className="action-btn secondary"
                    onClick={() => onView(record)}
                >
                    View
                </button>

            </td>

        </tr>

    );


};

export default ProductionRow;