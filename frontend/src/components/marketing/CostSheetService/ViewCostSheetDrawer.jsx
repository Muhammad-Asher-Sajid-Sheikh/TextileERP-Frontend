import React from "react";
import "../../../styles/marketing/partyService/drawer.css";

const ViewCostSheetDrawer = ({
    isOpen,
    costSheet,
    item,
    type = "costSheet",
    onClose,
}) => {

    if (!isOpen) return null;

    const data =
        type === "costSheet"
            ? costSheet
            : item;

    if (!data) return null;

    const formatValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return String(value);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        try {
            return new Date(date).toLocaleString();
        } catch {
            return "-";
        }
    };

    const formatBoolean = (value) =>
        value ? "Yes" : "No";

    const formatNumber = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return String(value);
        }

        return number.toLocaleString();
    };


    /* ========================================================
       COST SHEET
    ======================================================== */

    const renderCostSheet = () => {

        const fields = [
            ["ID", data.id],
            ["Inquiry ID", data.inquiryId],
            ["Version", data.versionNumber],
            ["Status", data.status],

            ["Cost of Yarn", data.costOfYarn],

            [
                "Weaving Wastage %",
                data.weavingWastagePercent,
            ],

            [
                "Weaving Wastage Cost",
                data.weavingWastageCost,
            ],

            [
                "Weaving Charges",
                data.weavingCharges,
            ],

            [
                "Total Weaving Cost",
                data.totalWeavingCost,
            ],

            [
                "Total Dyeing Charges",
                data.totalDyeingCharges,
            ],

            [
                "Total Dyeing Wastage",
                data.totalDyeingWastage,
            ],

            [
                "Extra Cost of Weaving",
                data.extraCostOfWeaving,
            ],

            [
                "Cost of Ready Fabric",
                data.costOfReadyFabric,
            ],

            [
                "Cost of Towel / Lbs",
                data.costOfTowelPerLbs,
            ],

            [
                "B & Cut Pcs Wastage",
                data.bAndCutPcsWastage,
            ],

            [
                "Carton Packed Towel",
                data.cartonPackedTowel,
            ],

            [
                "Factory Overhead Charges 1",
                data.factoryOverheadChgs1,
            ],

            [
                "Cost / Lbs",
                data.costPerLbs,
            ],

            [
                "Cost / Kg",
                data.costPerKg,
            ],

            [
                "Total Cost",
                data.totalCost,
            ],

            [
                "Exchange Rate",
                data.exchangeRate,
            ],

            [
                "CNF Rate / Piece",
                data.cnfRateToQuotePerPc,
            ],

            [
                "Labour Cut to Pack",
                data.labourCutToPack,
            ],

            [
                "Thread",
                data.thread,
            ],

            [
                "Horse Stitching",
                data.horseStitching,
            ],

            [
                "Stiffener Sheet",
                data.stiffenerSheet,
            ],

            [
                "Checking",
                data.checking,
            ],

            [
                "Knotting Charges",
                data.knottingChgs,
            ],

            [
                "Label",
                data.label,
            ],

            [
                "Silica Gel",
                data.silicaGel,
            ],

            [
                "Lab Test",
                data.labTest,
            ],

            [
                "Total Confection Expense",
                data.totalConfectionExp,
            ],

            [
                "Factory Overhead Charges 2",
                data.factoryOverheadChgs2,
            ],

            [
                "Freight USD",
                data.freightUsd,
            ],

            [
                "Freight Exchange Rate",
                data.freightExRate,
            ],

            [
                "Freight PKR",
                data.freightPkr,
            ],

            [
                "CLG & Transport",
                data.clgAndTransport,
            ],

            [
                "Total Freight",
                data.totalFreight,
            ],

            [
                "Kgs per FCL",
                data.kgsPerFcl,
            ],

            [
                "Freight / Kg",
                data.freightPerKg,
            ],

            [
                "Woven Label Cost",
                data.wovenLabelCost,
            ],

            [
                "Woven Stitching Cost",
                data.wovenStitchingCost,
            ],

            [
                "Total Label Cost",
                data.totalLabelCost,
            ],

            [
                "Embroidery Cost",
                data.embroideryCost,
            ],

            [
                "Created At",
                formatDate(data.createdAt),
            ],

            [
                "Updated At",
                formatDate(data.updatedAt),
            ],
        ];

        return (
            <>
                <div className="drawer-section">

                    <h3>Cost Sheet Information</h3>

                    <div className="drawer-grid">

                        {fields.map(
                            ([label, value]) => (
                                <div
                                    className="drawer-item"
                                    key={label}
                                >
                                    <label>
                                        {label}
                                    </label>

                                    <span>
                                        {label === "Cost of Yarn" ||
                                        label.includes("Cost") ||
                                        label.includes("Charges") ||
                                        label.includes("Rate") ||
                                        label.includes("Freight") ||
                                        label.includes("Expense") ||
                                        label.includes("Labour") ||
                                        label.includes("Thread") ||
                                        label.includes("Stitching") ||
                                        label.includes("Checking") ||
                                        label.includes("Knotting") ||
                                        label.includes("Label") ||
                                        label.includes("Silica") ||
                                        label.includes("Testing") ||
                                        label.includes("Embroidery") ||
                                        label.includes("Wastage") ||
                                        label === "Total Cost" ||
                                        label === "Carton Packed Towel" ||
                                        label === "Stiffener Sheet"
                                            ? formatNumber(value)
                                            : formatValue(value)}
                                    </span>

                                </div>
                            )
                        )}

                    </div>

                </div>


                {/* =================================================
                    YARNS
                ================================================= */}

                {Array.isArray(data.yarns) &&
                    data.yarns.length > 0 && (

                        <div className="drawer-section">

                            <h3>
                                Yarn Details
                            </h3>

                            {data.yarns.map(
                                (yarn, index) => (

                                    <div
                                        className="drawer-card"
                                        key={
                                            yarn.id ||
                                            index
                                        }
                                    >

                                        <div className="drawer-card-title">
                                            Yarn #{index + 1}
                                        </div>

                                        <div className="drawer-grid">

                                            <div className="drawer-item">
                                                <label>
                                                    Quality
                                                </label>
                                                <span>
                                                    {formatValue(
                                                        yarn.quality
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Usage
                                                </label>
                                                <span>
                                                    {formatNumber(
                                                        yarn.usage
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Rate
                                                </label>
                                                <span>
                                                    {formatNumber(
                                                        yarn.rate
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Wastage %
                                                </label>
                                                <span>
                                                    {formatNumber(
                                                        yarn.wastage
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Yarn Type ID
                                                </label>
                                                <span>
                                                    {formatValue(
                                                        yarn.yarnTypeId
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Dyeing Charges
                                                </label>
                                                <span>
                                                    {formatNumber(
                                                        yarn.dyeingCharges
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Dyeing Wastage %
                                                </label>
                                                <span>
                                                    {formatNumber(
                                                        yarn.dyeingWastage
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Total Cost
                                                </label>
                                                <span>
                                                    {formatNumber(
                                                        yarn.totalCost
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>
                    )}


                {/* =================================================
                    DYEING COLORS
                ================================================= */}

                {Array.isArray(data.dyeingColors) &&
                    data.dyeingColors.length > 0 && (

                        <div className="drawer-section">

                            <h3>
                                Dyeing Colors
                            </h3>

                            {data.dyeingColors.map(
                                (color, index) => (

                                    <div
                                        className="drawer-card"
                                        key={
                                            color.id ||
                                            index
                                        }
                                    >

                                        <div className="drawer-card-title">
                                            Color #{index + 1}
                                        </div>

                                        <div className="drawer-grid">

                                            <div className="drawer-item">
                                                <label>
                                                    Color Name
                                                </label>

                                                <span>
                                                    {formatValue(
                                                        color.colorName
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Charges
                                                </label>

                                                <span>
                                                    {formatNumber(
                                                        color.charges
                                                    )}
                                                </span>
                                            </div>

                                            <div className="drawer-item">
                                                <label>
                                                    Wastage %
                                                </label>

                                                <span>
                                                    {formatNumber(
                                                        color.wastage
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>
                    )}

            </>
        );
    };


    /* ========================================================
       SINGLE YARN
    ======================================================== */

    const renderYarn = () => {

        const fields = [
            ["Quality", data.quality],
            ["Usage", data.usage],
            ["Rate", data.rate],
            ["Wastage %", data.wastage],
            ["Yarn Type ID", data.yarnTypeId],
            ["Dyeing Charges", data.dyeingCharges],
            ["Dyeing Wastage %", data.dyeingWastage],
            ["Total Cost", data.totalCost],
            ["Created At", formatDate(data.createdAt)],
            ["Updated At", formatDate(data.updatedAt)],
        ];

        return (
            <div className="drawer-section">

                <h3>Yarn Details</h3>

                <div className="drawer-grid">

                    {fields.map(
                        ([label, value]) => (

                            <div
                                className="drawer-item"
                                key={label}
                            >

                                <label>
                                    {label}
                                </label>

                                <span>
                                    {label === "Usage" ||
                                    label === "Rate" ||
                                    label.includes("Wastage") ||
                                    label.includes("Charges") ||
                                    label === "Total Cost"
                                        ? formatNumber(value)
                                        : formatValue(value)}
                                </span>

                            </div>

                        )
                    )}

                </div>

            </div>
        );
    };


    /* ========================================================
       SINGLE DYEING COLOR
    ======================================================== */

    const renderDyeingColor = () => {

        const fields = [
            ["Color Name", data.colorName],
            ["Charges", data.charges],
            ["Wastage %", data.wastage],
            ["Created At", formatDate(data.createdAt)],
            ["Updated At", formatDate(data.updatedAt)],
        ];

        return (
            <div className="drawer-section">

                <h3>Dyeing Color Details</h3>

                <div className="drawer-grid">

                    {fields.map(
                        ([label, value]) => (

                            <div
                                className="drawer-item"
                                key={label}
                            >

                                <label>
                                    {label}
                                </label>

                                <span>
                                    {label === "Charges" ||
                                    label === "Wastage %"
                                        ? formatNumber(value)
                                        : formatValue(value)}
                                </span>

                            </div>

                        )
                    )}

                </div>

            </div>
        );
    };


    const title =
        type === "costSheet"
            ? "Cost Sheet Details"
            : type === "yarn"
            ? "Yarn Details"
            : "Dyeing Color Details";


    return (
        <>
            <div
                className="drawer-overlay"
                onClick={onClose}
            />

            <div className="drawer">

                <div className="drawer-header">

                    <h2>
                        {title}
                    </h2>

                    <button
                        className="drawer-close-btn"
                        onClick={onClose}
                        type="button"
                    >
                        ✕
                    </button>

                </div>

                <div className="drawer-body">

                    {type === "costSheet" &&
                        renderCostSheet()}

                    {type === "yarn" &&
                        renderYarn()}

                    {type === "dyeingColor" &&
                        renderDyeingColor()}

                </div>

            </div>
        </>
    );
};

export default ViewCostSheetDrawer;