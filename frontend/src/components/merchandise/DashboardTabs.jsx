import "../../styles/merchandise/dashboardTabs.css";

export default function DashboardTabs({
    activeTab,
    setActiveTab,
}) {

    const tabs = [
        {
            id: "instructions",
            label: "Instructions",
        },
        {
            id: "weaving",
            label: "Weaving",
        },
        {
            id: "dyeing",
            label: "Dyeing",
        },
        {
            id: "components",
            label: "Components",
        },

        {
            id: "commercialRates",
            label: "Commercial Rates",
        },
    ];

    return (
        <div className="dashboard-tabs">

            {tabs.map((tab) => (

                <button
                    key={tab.id}
                    className={
                        activeTab === tab.id
                            ? "tab active"
                            : "tab"
                    }
                    onClick={() =>
                        setActiveTab(tab.id)
                    }
                >
                    {tab.label}
                </button>

            ))}

        </div>
    );
}