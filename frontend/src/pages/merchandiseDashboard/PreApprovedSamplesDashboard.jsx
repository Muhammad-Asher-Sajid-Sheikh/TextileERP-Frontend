import { useState } from "react";

import PPSDashboard from "../../components/preApprovedSamples/PPSDashboard";

import "../../styles/merchandise/merchandiseDashboard.css";
import DepartmentNavbar from "../../components/common/DepartmentNavbar";
import { MERCHANDISE_NAV_LINKS } from "../../constants/merchandiseNavLinks";

export default function PreApprovedSamplesDashboard() {

    const [activeTab] = useState("pps");

    const tabs = [

        {

            id: "pps",

            label: "Pre Approved Samples",

        },

    ];

    const renderContent = () => {

        switch (activeTab) {

            case "pps":

                return <PPSDashboard />;

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

                <h1>

                    Pre Approved Samples

                </h1>

            </div>

            <div className="dashboard-tabs">

                {

                    tabs.map((tab) => (

                        <button

                            key={tab.id}

                            className="tab-button active"

                        >

                            {tab.label}

                        </button>

                    ))

                }

            </div>

            <div className="dashboard-content">

                {renderContent()}

            </div>

        </div>

    );

}