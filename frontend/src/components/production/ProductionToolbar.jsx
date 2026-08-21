import React from "react";
import "../../styles/production/productionToolbar.css";

const ProductionToolbar = ({
    search,
    onSearchChange,
    onRefresh,
    onInitiate,
}) => {
    return (
        <div className="production-toolbar">

            <div className="toolbar-left">

                <input
                    type="text"
                    placeholder="Search by Order Token..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />

            </div>

            <div className="toolbar-right">

                <button
                    className="refresh-btn"
                    onClick={onRefresh}
                >
                    Refresh
                </button>

                <button
                    className="initiate-btn"
                    onClick={onInitiate}
                >
                    + Start Yarn Twisting
                </button>

            </div>

        </div>
    );
};

export default ProductionToolbar;