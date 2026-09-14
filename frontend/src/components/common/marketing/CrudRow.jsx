import React from "react";
import "../../../styles/marketing/partyService/row.css";

const CrudRow = ({
    item,
    columns = [],
    onView,
    onEdit,
    onDelete,
    onBom,
}) => {

    const renderValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        if (typeof value === "boolean") {
            return (
                <span
                    className={`status-badge ${
                        value
                            ? "status-yes"
                            : "status-no"
                    }`}
                >
                    {value ? "Yes" : "No"}
                </span>
            );
        }

        if (Array.isArray(value)) {
            return value.length
                ? `${value.length} item${
                      value.length !== 1
                          ? "s"
                          : ""
                  }`
                : "-";
        }

        if (typeof value === "object") {

            if (value.salesContractNumber) {
                return value.salesContractNumber;
            }

            if (value.orderNumber) {
                return value.orderNumber;
            }

            if (value.name) {
                return value.name;
            }

            if (value.title) {
                return value.title;
            }

            if (value.code) {
                return value.code;
            }

            if (value.id) {
                return value.id;
            }

            return "-";
        }

        return String(value);
    };

    return (
        <tr className="dashboard-row">

            {columns.map((column) => {

                const value =
                    typeof column.render === "function"
                        ? column.render(item)
                        : item?.[column.key];

                return (
                    <td key={column.key}>
                        {renderValue(value)}
                    </td>
                );

            })}

            <td className="actions-cell">

                {onBom && (
                    <button
                        type="button"
                        className="action-btn bom-btn"
                        onClick={() => onBom(item)}
                        title="Manage BOM"
                    >
                        BOM
                    </button>
                )}

                {onView && (
                    <button
                        type="button"
                        className="action-btn view-btn"
                        onClick={() => onView(item)}
                        title="View"
                    >
                        View
                    </button>
                )}

                {onEdit && (
                    <button
                        type="button"
                        className="action-btn edit-btn"
                        onClick={() => onEdit(item)}
                        title="Edit"
                    >
                        Edit
                    </button>
                )}

                {onDelete && (
                    <button
                        type="button"
                        className="action-btn delete-btn"
                        onClick={() => onDelete(item)}
                        title="Delete"
                    >
                        Delete
                    </button>
                )}

            </td>

        </tr>
    );
};

export default CrudRow;