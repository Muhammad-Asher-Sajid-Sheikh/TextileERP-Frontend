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
        // Empty values
        if (value === null || value === undefined || value === "") {
            return "-";
        }

        // Boolean
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

        // Arrays
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return "-";
            }

            return `${value.length} item${value.length !== 1 ? "s" : ""}`;
        }

        // Objects
        if (typeof value === "object") {

            // Sales Contract
            if (value.salesContractNumber) {
                return value.salesContractNumber;
            }

            // Order Token
            if (value.orderNumber) {
                return value.orderNumber;
            }

            // Common name fields
            if (value.name) {
                return value.name;
            }

            if (value.title) {
                return value.title;
            }

            if (value.code) {
                return value.code;
            }

            // Fallback
            if (value.id) {
                return value.id;
            }

            return "-";
        }

        // Numbers / strings
        return String(value);
    };

    return (
        <tr className="dashboard-row">

            {columns.map((column) => {

                let value;

                // Custom column renderer
                if (typeof column.render === "function") {
                    value = column.render(item);
                } else {
                    value = item?.[column.key];
                }

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
                    onClick={() => onView?.(item)}
                    title="View"
                >
                    View
                </button>

                <button
                    type="button"
                    className="action-btn edit-btn"
                    onClick={() => onEdit?.(item)}
                    title="Edit"
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="action-btn delete-btn"
                    onClick={() => onDelete?.(item)}
                    title="Delete"
                >
                    Delete
                </button>

            </td>

        </tr>
    );
};

export default CrudRow;