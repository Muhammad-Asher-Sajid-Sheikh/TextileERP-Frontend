import React from "react";
import "../../styles/production/productionTable.css";

import ProductionRow from "./ProductionRow";

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

const ProductionTable = ({
    records,
    loading,

    activeTab,
    wetProcessingView,

    onView,

    onComplete,

    onDispatch,

    onFabricOutput,

    onQualityTest,
}) => {
    if (loading) {
        return (
            <div className="production-table-loading">
                Loading production records...
            </div>
        );
    }

    if (!records.length) {
        return (
            <div className="production-table-empty">
                No production records found.
            </div>
        );
    }

    return (
        <div className="production-table-container">
            <table className="production-table">
                <thead>

                {
                    activeTab === "yarnFabric" ? (

                        <tr>

                            <th>Order Token</th>

                            <th>Twisting</th>

                            <th>Weaving</th>

                            <th>Updated</th>

                            <th>Actions</th>

                        </tr>

                    ) : wetProcessingView === "wetProcessing" ? (

                        <tr>

                            <th>Order Token</th>

                            <th>Status</th>

                            <th>Updated</th>

                            <th>Actions</th>

                        </tr>

                    ) : (

                        <tr>

                            <th>Wet Log ID</th>

                            <th>Test Type</th>

                            <th>Result</th>

                            <th>Tested By</th>

                            <th>Actions</th>

                        </tr>

                    )
                }

            </thead>
                <tbody>

                {
                    records.length === 0 ? (

                        <tr>

                            <td
                                colSpan={5}
                                className="empty-row"
                            >

                                No Records Found

                            </td>

                        </tr>

                    ) : (

                        records.map((record) => (

                            <ProductionRow

                                key={
                                    record.id ||
                                    record.orderTokenId
                                }

                                record={record}

                                activeTab={activeTab}

                                wetProcessingView={
                                    wetProcessingView
                                }

                                onView={onView}

                                onComplete={onComplete}

                                onDispatch={onDispatch}

                                onFabricOutput={
                                    onFabricOutput
                                }

                                onQualityTest={
                                    onQualityTest
                                }

                            />

                        ))

                    )
                }

                </tbody>
            </table>
        </div>
    );
};

export default ProductionTable;