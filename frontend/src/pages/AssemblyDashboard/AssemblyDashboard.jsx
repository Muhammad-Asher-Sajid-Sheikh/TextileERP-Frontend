import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AssemblyToolbar from "../../components/assembly/AssemblyToolbar";
import AssemblyTable from "../../components/assembly/AssemblyTable";
import CreateJobCardModal from "../../components/assembly/CreateJobCardModal";
import LogPhaseModal from "../../components/assembly/LogPhaseModal";
import CompletePhaseModal from "../../components/assembly/CompletePhaseModal";
import JobCardDrawer from "../../components/assembly/JobCardDrawer";

import DepartmentNavbar from "../../components/common/DepartmentNavbar";
import { PRODUCTION_NAV_LINKS } from "../../constants/productionNavLinks";

import {
    getProductionOrders,
    getJobCardsByOrder,
    getJobCard,
    createJobCard,
    logAssemblyPhase,
    completeAssemblyPhase,
} from "../../services/assemblyApi";

import "../../styles/assembly/dashboard.css";

const AssemblyDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState("");

    const [jobCards, setJobCards] = useState([]);

    const [selectedJobCard, setSelectedJobCard] = useState(null);
    const [drawerJobCard, setDrawerJobCard] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    const loadOrders = async () => {
        try {
            const data = await getProductionOrders();

            const filtered = data.filter(
                (item) => item.orderTokenId
            );

            setOrders(filtered);
        } catch (error) {
            toast.error("Unable to load production orders.");
        }
    };

    const loadJobCards = async () => {
        if (!selectedOrder) {
            setJobCards([]);
            return;
        }

        try {
            setLoading(true);

            const response = await getJobCardsByOrder(
                selectedOrder
            );

            setJobCards(response.data.jobCards || []);
        } catch (error) {
            toast.error("Unable to load job cards.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        loadJobCards();
    }, [selectedOrder]);

    const handleCreateJobCard = async (payload) => {
        try {
            await createJobCard(payload);

            toast.success("Job card created successfully.");

            setShowCreateModal(false);

            loadJobCards();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Unable to create job card."
            );
        }
    };

    const handleLogPhase = async (payload) => {
        try {
            await logAssemblyPhase(payload);

            toast.success("Phase logged successfully.");

            setShowLogModal(false);

            loadJobCards();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Unable to log phase."
            );
        }
    };

    const handleCompletePhase = async (payload) => {
        try {
            await completeAssemblyPhase(payload);

            toast.success("Phase completed successfully.");

            setShowCompleteModal(false);

            loadJobCards();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Unable to complete phase."
            );
        }
    };

    const handleView = async (jobCard) => {
        try {
            const response = await getJobCard(
                jobCard.jobCardId
            );

            setDrawerJobCard(response.data);

            setShowDrawer(true);
        } catch (error) {
            toast.error("Unable to load job card.");
        }
    };

    return (
        <><DepartmentNavbar
                title="Production Department"
                links={PRODUCTION_NAV_LINKS}
            />
        <div className="assembly-dashboard">

            <h1>Assembly Log</h1>

            <AssemblyToolbar
                orders={orders}
                selectedOrder={selectedOrder}
                onOrderChange={setSelectedOrder}
                onAddJobCard={() => setShowCreateModal(true)}
                onRefresh={loadJobCards}
            />

            <AssemblyTable
                jobCards={jobCards}
                loading={loading}
                onView={handleView}
                onLogPhase={(jobCard) => {
                    setSelectedJobCard(jobCard);
                    setShowLogModal(true);
                }}
                onCompletePhase={(jobCard) => {
                    setSelectedJobCard(jobCard);
                    setShowCompleteModal(true);
                }}
            />

            <CreateJobCardModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                selectedOrder={selectedOrder}
                onSubmit={handleCreateJobCard}
            />

            <LogPhaseModal
                open={showLogModal}
                jobCard={selectedJobCard}
                onClose={() => setShowLogModal(false)}
                onSubmit={handleLogPhase}
            />

            <CompletePhaseModal
                open={showCompleteModal}
                jobCard={selectedJobCard}
                onClose={() => setShowCompleteModal(false)}
                onSubmit={handleCompletePhase}
            />

            <JobCardDrawer
                open={showDrawer}
                jobCard={drawerJobCard}
                onClose={() => setShowDrawer(false)}
            />

        </div>
        </>
    );
};

export default AssemblyDashboard;