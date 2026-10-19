import React from "react";
import CrudRow from "./CrudRow";
import "../../../styles/marketing/partyService/table.css";

const CrudTable = ({
    columns = [],
    data = [],
    loading = false,
    onView,
    onEdit,
    onDelete,
    onBom,
}) => {

    if (loading) {
        return (
            <div className="dashboard-table-wrapper">
                <div className="dashboard-empty-state">
                    Loading...
                </div>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="dashboard-table-wrapper">
                <div className="dashboard-empty-state">
                    No records found.
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

                <thead>
                    <tr>

                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}

                        <th className="actions-column">
                            Actions
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {data.map((item) => (
                        <CrudRow
                            key={item.id}
                            item={item}
                            columns={columns}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onBom={onBom}
                        />
                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default CrudTable;