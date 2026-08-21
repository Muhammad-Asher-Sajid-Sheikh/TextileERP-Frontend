import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import SurfaceDecorationsToolbar from "../../components/surfaceDecorations/SurfaceDecorationsToolbar";
import SurfaceDecorationsTable from "../../components/surfaceDecorations/SurfaceDecorationsTable";

import CreateDecorationModal from "../../components/surfaceDecorations/CreateDecorationModal";
import DispatchEmbroideryModal from "../../components/surfaceDecorations/DispatchEmbroideryModal";
import CompleteDecorationModal from "../../components/surfaceDecorations/CompleteDecorationModal";
import ViewDecorationDrawer from "../../components/surfaceDecorations/ViewDecorationDrawer";

import DepartmentNavbar from "../../components/common/DepartmentNavbar";
import { PRODUCTION_NAV_LINKS } from "../../constants/productionNavLinks";


import {
    getPrintingRecords,
    getEmbroideryRecords,
    dispatchPrinting,
    initiateEmbroidery,
    dispatchEmbroidery,
    completePrinting,
    completeEmbroidery,
    getDecorationStatus,
    getProductionOrders,
} from "../../services/surfaceDecorationsApi";

import "../../styles/surfaceDecorations/dashboard.css";

const SurfaceDecorationsDashboard = () => {

    const [selectedProcess, setSelectedProcess] = useState("PRINTING");

    const [records, setRecords] = useState([]);
    const [orders, setOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState("");

    const [loading, setLoading] = useState(false);

    const [selectedRecord, setSelectedRecord] = useState(null);
    const [viewData, setViewData] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showViewDrawer, setShowViewDrawer] = useState(false);

    //--------------------------------------------------
    // Load Orders
    //--------------------------------------------------

    const loadOrders = async () => {
        try {
            const response = await getProductionOrders();

            const validOrders = response.filter(
                (item) => item.orderTokenId
            );

            setOrders(validOrders);

        } catch (error) {
            console.error(error);
            toast.error("Unable to load production orders.");
        }
    };

    //--------------------------------------------------
    // Load Records
    //--------------------------------------------------

    const loadRecords = async () => {
        if (!selectedOrder) {
            setRecords([]);
            return;
        }

        try {
            setLoading(true);

            const data =
                selectedProcess === "PRINTING"
                    ? await getPrintingRecords(selectedOrder)
                    : await getEmbroideryRecords(selectedOrder);

            setRecords(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load records.");
        } finally {
            setLoading(false);
        }
    };

    //--------------------------------------------------
    // Create
    //--------------------------------------------------

    const handleCreate = async (payload) => {

        try {

            if (selectedProcess === "PRINTING") {
                setSelectedRecord(payload);
                setShowCreateModal(false);
                setShowDispatchModal(true);
                return;
            }

            await initiateEmbroidery(payload);

            await loadRecords();

            toast.success("Embroidery initiated successfully.");

            setShowCreateModal(false);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to initiate process."
            );

        }

    };

    //--------------------------------------------------
    // Dispatch Embroidery
    //--------------------------------------------------

    const handleDispatch = async (payload) => {
        try {

            if (selectedProcess === "PRINTING") {
                await dispatchPrinting(payload);
            } else {
                await dispatchEmbroidery(payload);
            }

            toast.success("Dispatched successfully.");

            setShowDispatchModal(false);

            await loadRecords();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Dispatch failed."
            );
        }
    };

    //--------------------------------------------------
    // Complete
    //--------------------------------------------------

    const handleComplete = async (payload) => {

        try {

            if (selectedProcess === "PRINTING") {
                await completePrinting(payload);
            } else {
                await completeEmbroidery(payload);
            }

            toast.success("Completed successfully.");

            setShowCompleteModal(false);

            await loadRecords();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Completion failed."
            );

        }

    };

    //--------------------------------------------------
    // View Status
    //--------------------------------------------------

    const handleView = async (record) => {

        try {

            const response = await getDecorationStatus(
                record.orderTokenId
            );

            setViewData(response);

            setSelectedRecord(record);

            setShowViewDrawer(true);

        } catch (error) {

            toast.error("Unable to load decoration details.");

        }

    };

    //--------------------------------------------------
    // Effects
    //--------------------------------------------------

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            loadRecords();
        } else {
            setRecords([]);
        }
    }, [selectedProcess, selectedOrder]);

        return (

        <div className="surface-dashboard">
            
            <DepartmentNavbar
                title="Production Department"
                links={PRODUCTION_NAV_LINKS}
            />
            <div className="surface-dashboard-header">
                <h1>Surface Decorations Dashboard</h1>
            </div>

            <SurfaceDecorationsToolbar
                selectedProcess={selectedProcess}
                onProcessChange={setSelectedProcess}
                productionOrders={orders}
                selectedOrder={selectedOrder}
                onOrderChange={setSelectedOrder}
                onAddNew={() => {
                    if (!selectedOrder) {
                        toast.warning("Please select an order first.");
                        return;
                    }

                    setShowCreateModal(true);
                }}
                loading={loading}
            />

            <div className="surface-dashboard-content">

                <SurfaceDecorationsTable
                    process={selectedProcess}
                    records={records}
                    loading={loading}
                    onView={handleView}
                    onDispatch={(record) => {
                        setSelectedRecord(record);
                        setShowDispatchModal(true);
                    }}
                    onComplete={(record) => {
                        setSelectedRecord(record);
                        setShowCompleteModal(true);
                    }}
                />

            </div>

            {/* Create */}

            <CreateDecorationModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreate}
                selectedProcess={selectedProcess}
                selectedOrder={selectedOrder}
                loading={loading}
            />

            {/* Dispatch Embroidery */}
            {console.log('Selected Process:', selectedProcess)}
            <DispatchEmbroideryModal
                isOpen={showDispatchModal}
                onClose={() => setShowDispatchModal(false)}
                onSubmit={handleDispatch}
                selectedOrder={selectedRecord?.orderTokenId}
                selectedProcess={selectedProcess}
                loading={loading}
            />

            {/* Complete */}

            <CompleteDecorationModal
                isOpen={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                onSubmit={handleComplete}
                selectedProcess={selectedProcess}
                selectedOrder={selectedRecord?.orderTokenId}
                loading={loading}
            />

            {/* View */}

            <ViewDecorationDrawer
                isOpen={showViewDrawer}
                onClose={() => {
                    setShowViewDrawer(false);
                    setViewData(null);
                    setSelectedRecord(null);
                }}
                process={selectedProcess}
                data={viewData}
            />

        </div>
    );
};

export default SurfaceDecorationsDashboard;