import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "react-toastify";

import {
    getAllParties,
    getPartyById,
    createParty,
    updateParty,
    deleteParty,
} from "../../services/marketingApi";

import CrudToolbar from "../../components/common/marketing/CrudToolbar";
import CrudTable from "../../components/common/marketing/CrudTable";
import CrudFormModal from "../../components/common/marketing/CrudFormModal";
import ViewPartyDrawer from "../../components/marketing/partyService/ViewPartyDrawer";

import "../../styles/marketing/partyService/dashboard.css";

const columns = [
    {
        key: "partyCode",
        label: "Party Code",
    },
    {
        key: "legalName",
        label: "Legal Name",
    },
    {
        key: "country",
        label: "Country",
    },
    {
        key: "contactEmail",
        label: "Email",
    },
    {
        key: "isCustomer",
        label: "Customer",
    },
];

const PartyServiceDashboard = () => {

    const [parties, setParties] = useState([]);

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

    const partyFields =
    [
        {
            name: "partyCode",
            label: "Party Code",
            type: "text",
            required: true,
            placeholder: "PRT-001",
        },
        {
            name: "legalName",
            label: "Legal Name",
            type: "text",
            required: true,
            placeholder: "ABC Textiles Ltd.",
        },
        {
            name: "country",
            label: "Country",
            type: "text", // Later you can change this to "select"
            required: true,
            placeholder: "Pakistan",
        },
        {
            name: "contactEmail",
            label: "Contact Email",
            type: "email",
            required: true,
            placeholder: "contact@company.com",
        },
        {
            name: "isCustomer",
            label: "Customer",
            type: "checkbox",
        },
        {
            name: "isLegalBuyer",
            label: "Legal Buyer",
            type: "checkbox",
        },
        {
            name: "isPaymentRemitter",
            label: "Payment Remitter",
            type: "checkbox",
        },
        {
            name: "isConsignee",
            label: "Consignee",
            type: "checkbox",
        },
        {
            name: "isUltimateClient",
            label: "Ultimate Client",
            type: "checkbox",
        },
    ];

    /* =======================================================
       LOAD ALL PARTIES
    ======================================================= */

    const loadParties = async () => {

        try {

            setLoading(true);

            const response =
                await getAllParties();

            setParties(response.data || []);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load parties."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadParties();

    }, []);

    /* =======================================================
       SEARCH
    ======================================================= */

    const filteredParties = useMemo(() => {

        if (!searchTerm.trim())
            return parties;

        const keyword =
            searchTerm.toLowerCase();

        return parties.filter((party) =>

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

        

    }, [parties, searchTerm]);

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
                await getPartyById(
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
                await getPartyById(
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

            loadParties();

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

                await createParty(
                    formData
                );

                toast.success(
                    "Party created successfully."
                );

            } else {

                await updateParty(
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

            loadParties();

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
                    data={filteredParties}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </div>

            <CrudFormModal
                title="Party"
                fields={partyFields}
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