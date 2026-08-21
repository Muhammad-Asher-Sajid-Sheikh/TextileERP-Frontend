import React from "react";
import "../../../styles/marketing/partyService/toolbar.css";

const CrudToolbar = ({
    title = "Dashboard",
    searchTerm = "",
    onSearch,
    onAdd,
    addButtonText = "Add New",
    loading = false,
}) => {
    return (
        <div className="dashboard-toolbar">

            <div className="dashboard-toolbar-left">
                <h2 className="dashboard-title">{title}</h2>
            </div>

            <div className="dashboard-toolbar-right">

                <div className="dashboard-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        disabled={loading}
                        className="dashboard-search-input"
                    />
                </div>

                <button
                    className="dashboard-primary-btn"
                    onClick={onAdd}
                    disabled={loading}
                >
                    + {addButtonText}
                </button>

            </div>

        </div>
    );
};

export default CrudToolbar;