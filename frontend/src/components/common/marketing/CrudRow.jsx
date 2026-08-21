import React from "react";
import "../../../styles/marketing/partyService/row.css";

const CrudRow = ({
    item,
    columns = [],
    onView,
    onEdit,
    onDelete,
}) => {

    const renderValue = (value) => {
        if (typeof value === "boolean") {
            return (
                <span
                    className={`status-badge ${
                        value ? "status-yes" : "status-no"
                    }`}
                >
                    {value ? "Yes" : "No"}
                </span>
            );
        }

        if (value === null || value === undefined || value === "") {
            return "-";
        }

        return value;
    };

    return (
        <tr className="dashboard-row">

            {columns.map((column) => {

                const value = column.render
                    ? column.render(item)
                    : item[column.key];

                return (
                    <td key={column.key}>
                        {renderValue(value)}
                    </td>
                );

            })}
            
            <td className="actions-cell">

                <button
                    type="button"
                    className="action-btn view-btn"
                    onClick={() => onView(item)}
                    title="View"
                >
                    View
                </button>

                <button
                    type="button"
                    className="action-btn edit-btn"
                    onClick={() => onEdit(item)}
                    title="Edit"
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="action-btn delete-btn"
                    onClick={() => onDelete(item)}
                    title="Delete"
                >
                    Delete
                </button>

            </td>

        </tr>
    );
};

export default CrudRow;