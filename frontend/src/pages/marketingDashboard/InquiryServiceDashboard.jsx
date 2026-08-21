import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "react-toastify";

import {
    getAllInquiries,
    getInquiryById,
    createInquiry,
    updateInquiry,
    getAllParties,
    //getAllUsers, // Replace with your actual User API
    //deleteParty,
} from "../../services/marketingApi";

import CrudToolbar from "../../components/common/marketing/CrudToolbar";
import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";
import ViewPartyDrawer from "../../components/marketing/partyService/ViewPartyDrawer";

import "../../styles/marketing/partyService/dashboard.css";

const columns = [
    {
        key: "icnNumber",
        label: "ICN Number",
    },
    {
        key: "customer",
        label: "Customer",
        render: (row) => row.customer?.legalName || "-",
    },
    {
        key: "channel",
        label: "Channel",
    },
    {
        key: "priority",
        label: "Priority",
    },
    {
        key: "status",
        label: "Status",
    },
    {
        key: "responseDueDate",
        label: "Due Date",
        render: (row) =>
            row.responseDueDate
                ? new Date(row.responseDueDate).toLocaleDateString()
                : "-",
    },
];

const PartyServiceDashboard = () => {

    const [inquiry, setinquiry] = useState([]);
    const [parties, setParties] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [formLoading, setFormLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedParty, setSelectedParty] =
        useState(null);

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [showDrawer, setShowDrawer] =
        useState(false);

    const [formMode, setFormMode] =
        useState("add");


    const loadParties = async () => {
    try {
        const response = await getAllParties();
        setParties(response.data || []);
    } catch (error) {
        console.error(error);
    }
};


    const partyOptions = parties.map((party) => ({
        value: party.id,
        label: `${party.partyCode} - ${party.legalName}`,
    }));

    const userOptions = users.map((user) => ({
        value: user.id,
        label: user.fullName,
    }));

    const loadUsers = async () => {
    try {
        // TODO: Replace with GET /users API
        const dummyUsers = [
            {
                id: "23787779-a2f7-49b9-bebc-dbd21b0f36f0",
                fullName: "Marketing",
            },
            {
                id: "213353fc-f808-43a5-9df0-b4747000285e",
                fullName: "Asher Sajid",
            },
            {
                id: "bb051c54-65a0-47c9-a84b-bbd77385e8b8",
                fullName: "Management",
            },
        ];

        setUsers(dummyUsers);
    } catch (error) {
        console.error(error);
    }
};

    const inquiryFields = [
    {
        name: "icnNumber",
        label: "ICN Number",
        type: "text",
        required: true,
    },
    {
        name: "customerId",
        label: "Customer",
        type: "select",
        required: true,
        placeholder: "Select Customer",
        options: partyOptions,
    },
    {
        name: "channel",
        label: "Channel",
        type: "text",
        required: true,
    },
    {
        name: "assignedMerchandiserId",
        label: "Assigned Merchandiser",
        type: "select",
        required: true,
        placeholder: "Select Merchandiser",
        options: userOptions,
    },
    {
        name: "responseDueDate",
        label: "Response Due Date",
        type: "date",
        required: true,
    },
    {
        name: "priority",
        label: "Priority",
        type: "select",
        required: true,
        options: [
            { value: "LOW", label: "Low" },
            { value: "MEDIUM", label: "Medium" },
            { value: "HIGH", label: "High" },
        ],
    },
    {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
            { value: "RECEIVED", label: "Received" },
            { value: "UNDER_FEASIBILITY", label: "Under Feasibility" },
            { value: "COSTING_IN_PROGRESS", label: "Costing In Progress" },
            { value: "QUOTED", label: "Quoted" },
            { value: "SAMPLE_DEVELOPMENT", label: "Sample Development" },
            { value: "PO_RECEIVED", label: "PO Received" },
            { value: "CONVERTED_TO_ORDER", label: "Converted to Order" },
            { value: "REJECTED", label: "Rejected" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
    },
    {
        name: "originalCommAttachment",
        label: "Attachment URL",
        type: "text",
    },
];

    /* =======================================================
       LOAD ALL inquiry
    ======================================================= */

    const loadinquiry = async () => {

        try {

            setLoading(true);

            const response =
                await getAllInquiries();

            setinquiry(response.data || []);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load inquiry."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadinquiry();
        loadParties();
        loadUsers();

    }, []);


    /* =======================================================
       SEARCH
    ======================================================= */

    const filteredinquiry = useMemo(() => {

        if (!searchTerm.trim())
            return inquiry;

        const keyword =
            searchTerm.toLowerCase();

        return inquiry.filter((party) =>

            party.partyCode
                ?.toLowerCase()
                .includes(keyword) ||

            party.legalName
                ?.toLowerCase()
                .includes(keyword) ||

            party.country
                ?.toLowerCase()
                .includes(keyword) ||

            party.contactEmail
                ?.toLowerCase()
                .includes(keyword)

        );

        

    }, [inquiry, searchTerm]);

    /* =======================================================
       ADD
    ======================================================= */

    const handleAdd = () => {

        setSelectedParty(null);

        setFormMode("add");

        setShowFormModal(true);

    };

    /* =======================================================
       EDIT
    ======================================================= */

    const handleEdit = async (party) => {

        try {

            setLoading(true);

            const response =
                await getInquiryById(
                    party.id
                );

            setSelectedParty(
                response.data
            );

            setFormMode("edit");

            setShowFormModal(true);

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to fetch party."
            );

        } finally {

            setLoading(false);

        }

    };

    /* =======================================================
       VIEW
    ======================================================= */

    const handleView = async (party) => {

        try {

            setLoading(true);

            const response =
                await getInquiryById(
                    party.id
                );

            setSelectedParty(
                response.data
            );

            setShowDrawer(true);

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to fetch party."
            );

        } finally {

            setLoading(false);

        }

    };

    /* =======================================================
       DELETE
    ======================================================= */

    const handleDelete = async (party) => {

        const confirmed =
            window.confirm(
                `Delete "${party.legalName}"?`
            );

        if (!confirmed)
            return;

        try {

            setLoading(true);

            await deleteParty(
                party.id
            );

            toast.success(
                "Party deleted successfully."
            );

            loadinquiry();

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to delete party."
            );

        } finally {

            setLoading(false);

        }

    };

    /* =======================================================
       SUBMIT
    ======================================================= */

    const handleSubmit =
        async (formData) => {

        try {

            setFormLoading(true);

            if (
                formMode === "add"
            ) {

                await createInquiry(
                    formData
                );

                toast.success(
                    "Party created successfully."
                );

            } else {

                await updateInquiry(
                    selectedParty.id,
                    formData
                );

                toast.success(
                    "Party updated successfully."
                );

            }

            setShowFormModal(
                false
            );

            setSelectedParty(
                null
            );

            loadinquiry();

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data
                    ?.message ||
                "Operation failed."
            );

        } finally {

            setFormLoading(
                false
            );

        }

    };

        return (
        <div className="dashboard-container">

            <div className="dashboard-content">

                <CrudToolbar
                    title="Party Service"
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                    onAdd={handleAdd}
                    addButtonText="Add Party"
                    loading={loading}
                />

                <CrudTable
                    columns={columns}
                    data={filteredinquiry}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={false}
                />

            </div>

            <CrudFormModal
                title="Inquiry"
                fields={inquiryFields}
                isOpen={showFormModal}
                mode={formMode}
                initialData={selectedParty}
                loading={formLoading}
                onClose={() => {

                    if (formLoading) return;

                    setShowFormModal(false);
                    setSelectedParty(null);

                }}
                onSubmit={handleSubmit}
            />

            <ViewPartyDrawer
                isOpen={showDrawer}
                party={selectedParty}
                onClose={() => {

                    setShowDrawer(false);
                    setSelectedParty(null);

                }}
            />

        </div>
    );

};

export default PartyServiceDashboard;