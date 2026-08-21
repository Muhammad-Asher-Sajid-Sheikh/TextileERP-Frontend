import { useState } from "react";

import InstructionDashboard from "../../components/merchandise/InstructionDashboard";
import ComponentsDashboard from "../../components/merchandise/ComponentsDashboard";
import WeavingDashboard from "../../components/merchandise/WeavingDashboard";
import DyeingDashboard from "../../components/merchandise/DyeingDashboard";
import CommercialRatesDashboard from "../../components/merchandise/CommercialRatesDashboard";

import DepartmentNavbar from "../../components/common/DepartmentNavbar";
import { MERCHANDISE_NAV_LINKS } from "../../constants/merchandiseNavLinks";

import "../../styles/merchandise/merchandiseDashboard.css";

export default function MerchandiseDashboard() {

    const [activeTab, setActiveTab] = useState("instructions");

    const renderContent = () => {

        switch (activeTab) {

            case "instructions":
                return <InstructionDashboard />;

            case "components":
                return <ComponentsDashboard />;

            case "weaving":
                return <WeavingDashboard />;

            case "dyeing":
                return <DyeingDashboard />;

            case "commercialRates":
                return <CommercialRatesDashboard />;

            default:
                return null;

        }

    };

    return (

        <div className="merchandise-dashboard">
            <DepartmentNavbar
                title="Merchandise Department"
                links={MERCHANDISE_NAV_LINKS}
            />

            <div className="dashboard-header">

                <div>

                    <h1 style={{ color: "#333" }}>

                        Merchandise Dashboard

                    </h1>

                    <p>

                        Create, manage and release production instructions.

                    </p>

                </div>

            </div>

            <div className="dashboard-tabs">

                <button
                    className={
                        activeTab === "instructions"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("instructions")
                    }
                >
                    Instructions
                </button>

                <button
                    className={
                        activeTab === "components"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("components")
                    }
                >
                    Components
                </button>

                <button
                    className={
                        activeTab === "weaving"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("weaving")
                    }
                >
                    Weaving
                </button>

                <button
                    className={
                        activeTab === "dyeing"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("dyeing")
                    }
                >
                    Dyeing
                </button>

                <button
                    className={
                        activeTab === "commercialRates"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("commercialRates")
                    }
                >
                    Commercial Rates
                </button>

            </div>

            <div className="dashboard-content">

                {renderContent()}

            </div>

        </div>

    );

}