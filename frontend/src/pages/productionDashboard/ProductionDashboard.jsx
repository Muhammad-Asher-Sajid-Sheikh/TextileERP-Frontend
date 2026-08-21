import React, { useEffect, useMemo, useState } from "react";

import ProductionToolbar from "../../components/production/ProductionToolbar";
import ProductionTable from "../../components/production/ProductionTable";
import ProductionModal from "../../components/production/ProductionModal";
import ProductionViewDrawer from "../../components/production/ProductionViewDrawer";

import YarnTwistingInitiateForm from "../../components/production/forms/YarnTwistingInitiateForm";
import YarnTwistingCompleteForm from "../../components/production/forms/YarnTwistingCompleteForm";
import WeavingDispatchForm from "../../components/production/forms/WeavingDispatchForm";
import FabricOutputForm from "../../components/production/forms/FabricOutputForm";

import WetProcessingDispatchForm from "../../components/production/forms/WetProcessingDispatchForm";
import WetProcessingCompleteForm from "../../components/production/forms/WetProcessingCompleteForm";
import QualityTestForm from "../../components/production/forms/QualityTestForm";

import DepartmentNavbar from "../../components/common/DepartmentNavbar";
import { PRODUCTION_NAV_LINKS } from "../../constants/productionNavLinks";

import {
    getYarnFabricList,
    getWetProcessingList,
    getQualityTestList,
} from "../../services/productionApi";

import "../../styles/production/productionDashboard.css";

const ProductionDashboard = () => {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");

    const [showDrawer, setShowDrawer] = useState(false);

    const [selectedRecord, setSelectedRecord] = useState(null);

    const [activeTab, setActiveTab] = useState("yarnFabric");

    const [wetProcessingView, setWetProcessingView] =
    useState("wetProcessing");

    //-----------------------------------------------------
    // Fetch Records
    //-----------------------------------------------------

    const fetchRecords = async () => {

        try {

            setLoading(true);

            let response;

            if (activeTab === "yarnFabric") {

                response = await getYarnFabricList();

            } else {

                if (wetProcessingView === "wetProcessing") {

                    response = await getWetProcessingList();

                } else {

                    response = await getQualityTestList();

                }

            }

            if (Array.isArray(response)) {
                // Temporary list endpoints
                setRecords(response);
            } else if (response.success) {
                // Standard API response
                setRecords(response.data || []);
            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    //-----------------------------------------------------

    useEffect(() => {

        fetchRecords();

    }, [activeTab, wetProcessingView]);

    //-----------------------------------------------------
    // Search
    //-----------------------------------------------------

    const filteredRecords = useMemo(() => {

        if (!search.trim()) return records;

        return records.filter((record) =>
            record.orderTokenId
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

    }, [records, search]);

    //-----------------------------------------------------
    // Modal
    //-----------------------------------------------------

    const openInitiateModal = () => {

        setSelectedRecord(null);

        setModalType("initiate");

        setShowModal(true);

    };

    const openCompleteModal = (record) => {

        setSelectedRecord(record);

        setModalType("complete");

        setShowModal(true);

    };

    const openDispatchModal = (record) => {

        setSelectedRecord(record);

        setModalType("dispatch");

        setShowModal(true);

    };

    const openFabricOutputModal = (record) => {

        setSelectedRecord(record);

        setModalType("fabricOutput");

        setShowModal(true);

    };

    const openWetDispatchModal = () => {

        setSelectedRecord(null);

        setModalType("wetDispatch");

        setShowModal(true);

    };

    const openWetCompleteModal = (record) => {

        setSelectedRecord(record);

        setModalType("wetComplete");

        setShowModal(true);

    };

    const openQualityTestModal = (record) => {

        setSelectedRecord(record);

        setModalType("qualityTest");

        setShowModal(true);

    };

    //-----------------------------------------------------
    // Drawer
    //-----------------------------------------------------

    const openDrawer = (record) => {

        setSelectedRecord(record);

        setShowDrawer(true);

    };

    //-----------------------------------------------------

    const closeModal = () => {

        setShowModal(false);

        setModalType("");

    };

    //-----------------------------------------------------

    const closeDrawer = () => {

        setShowDrawer(false);

        setSelectedRecord(null);

    };

    //-----------------------------------------------------

    const refreshDashboard = async () => {

        await fetchRecords();

        closeModal();

    };

    //-----------------------------------------------------

    const modalTitle = {

        initiate: "Start Yarn Twisting",

        complete: "Complete Yarn Twisting",

        dispatch: "Dispatch to Weaving",

        fabricOutput: "Log Fabric Output",

        wetDispatch: "Dispatch Wet Processing",

        wetComplete: "Complete Wet Processing",

        qualityTest: "Log Quality Test",

    }[modalType];

    //-----------------------------------------------------

    console.log("Active Tab:", activeTab);
    console.log("Wet View:", wetProcessingView);
    console.log("Records:", records);

    return (

        

        <div className="production-dashboard">

            
            <DepartmentNavbar
                title="Production Department"
                links={PRODUCTION_NAV_LINKS}
            />

            <div className="dashboard-header">

                <h1>Production Dashboard</h1>

            </div>

            <div className="production-tabs">

                <button
                    className={
                        activeTab === "yarnFabric"
                            ? "production-tab active"
                            : "production-tab"
                    }
                    onClick={() => setActiveTab("yarnFabric")}
                >
                    Yarn & Fabric
                </button>

                <button
                    className={
                        activeTab === "wetProcessing"
                            ? "production-tab active"
                            : "production-tab"
                    }
                    onClick={() => setActiveTab("wetProcessing")}
                >
                    Wet Processing
                </button>

            </div>

            {activeTab === "wetProcessing" && (

                <div className="wet-processing-filter">

                    <label>

                        Process

                    </label>

                    <select
                        value={wetProcessingView}
                        onChange={(e) =>
                            setWetProcessingView(e.target.value)
                        }
                    >

                        <option value="wetProcessing">

                            Wet Processing

                        </option>

                        <option value="qualityTesting">

                            Quality Testing

                        </option>

                    </select>

                </div>

            )}


            <ProductionToolbar

                search={search}

                onSearchChange={setSearch}

                onRefresh={fetchRecords}

                onInitiate={

                    activeTab === "yarnFabric"

                        ? openInitiateModal

                        : wetProcessingView === "wetProcessing"

                            ? openWetDispatchModal

                            : openQualityTestModal

                }

                buttonText={

                    activeTab === "yarnFabric"

                        ? "Start Yarn Twisting"

                        : wetProcessingView === "wetProcessing"

                            ? "Dispatch Wet Processing"

                            : "Log Quality Test"

                }

            />

            <ProductionTable

                records={records}

                loading={loading}

                activeTab={activeTab}

                wetProcessingView={wetProcessingView}

                onView={openDrawer}

                onComplete={

                    activeTab === "yarnFabric"

                        ? openCompleteModal

                        : openWetCompleteModal

                }

                onDispatch={openDispatchModal}

                onFabricOutput={openFabricOutputModal}

                onQualityTest={openQualityTestModal}

            />

            <ProductionModal

                isOpen={showModal}

                title={modalTitle}

                onClose={closeModal}

            >

                {modalType === "initiate" && (

                    <YarnTwistingInitiateForm

                        onSuccess={refreshDashboard}

                        onClose={closeModal}

                    />

                )}

                {modalType === "complete" && (

                    <YarnTwistingCompleteForm

                        orderTokenId={selectedRecord?.orderTokenId}

                        onSuccess={refreshDashboard}

                        onClose={closeModal}

                    />

                )}

                {modalType === "dispatch" && (

                    <WeavingDispatchForm

                        orderTokenId={selectedRecord?.orderTokenId}

                        onSuccess={refreshDashboard}

                        onClose={closeModal}

                    />

                )}

                {modalType === "fabricOutput" && (

                    <FabricOutputForm

                        orderTokenId={selectedRecord?.orderTokenId}

                        onSuccess={refreshDashboard}

                        onClose={closeModal}

                    />

                )}

                {modalType === "wetDispatch" && (

                    <WetProcessingDispatchForm

                        onSuccess={refreshDashboard}

                        onClose={closeModal}

                    />

                )}

                {modalType === "wetComplete" && (

                    <WetProcessingCompleteForm

                        orderTokenId={selectedRecord?.orderTokenId}

                        onSuccess={refreshDashboard}

                        onClose={closeModal}

                    />

                )}

                {modalType === "qualityTest" && (

                    <QualityTestForm

                        wetProcessingLogId={
                            selectedRecord?.wetProcessingLogId
                        }

                        onSuccess={refreshDashboard}

                        onClose={closeModal}

                    />

                )}

            </ProductionModal>

            <ProductionViewDrawer

                isOpen={showDrawer}

                record={selectedRecord}

                onClose={closeDrawer}

            />

        </div>

    );

};

export default ProductionDashboard;