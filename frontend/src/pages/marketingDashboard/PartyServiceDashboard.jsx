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


/* ============================================================
   TABLE COLUMNS
============================================================ */

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


/* ============================================================
   PARTY SERVICE DASHBOARD
============================================================ */

const PartyServiceDashboard = () => {

    /* ========================================================
       STATE
    ======================================================== */

    const [parties, setParties] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [formLoading, setFormLoading] =
        useState(false);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedParty, setSelectedParty] =
        useState(null);

    const [showFormModal, setShowFormModal] =
        useState(false);

    const [showDrawer, setShowDrawer] =
        useState(false);

    const [formMode, setFormMode] =
        useState("add");


    /* ========================================================
       PARTY FORM FIELDS
    ======================================================== */

    const partyFields = [
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
            type: "text",
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

        /* ====================================================
           PARTY ROLE
        ==================================================== */

        {
            name: "partyType",
            label: "Party Type",
            type: "radio-group",
            sectionTitle: "Options",
            required: true,

            options: [
                {
                    value: "CUSTOMER",
                    label: "Customer",
                },

                {
                    value: "LEGAL_BUYER",
                    label: "Legal Buyer",
                },

                {
                    value: "PAYMENT_REMITTER",
                    label: "Payment Remitter",
                },

                {
                    value: "CONSIGNEE",
                    label: "Consignee",
                },

                {
                    value: "ULTIMATE_CLIENT",
                    label: "Ultimate Client",
                },
            ],
        },
    ];


    /* ========================================================
       LOAD ALL PARTIES
    ======================================================== */

    const loadParties = async () => {

        try {

            setLoading(true);

            const response =
                await getAllParties();

            setParties(
                response.data || []
            );

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


    /* ========================================================
       SEARCH
    ======================================================== */

    const filteredParties = useMemo(() => {

        if (!searchTerm.trim()) {
            return parties;
        }

        const keyword =
            searchTerm
                .toLowerCase()
                .trim();

        return parties.filter(
            (party) =>

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

    }, [
        parties,
        searchTerm,
    ]);


    /* ========================================================
       CONVERT DATABASE PARTY → FORM DATA
       
       Database:
       
       isCustomer
       isLegalBuyer
       isPaymentRemitter
       isConsignee
       isUltimateClient
       
       Form:
       
       partyType
    ======================================================== */

    const getPartyFormData = (
        party
    ) => {

        if (!party) {
            return null;
        }

        let partyType = "";


        if (party.isCustomer) {

            partyType =
                "CUSTOMER";

        } else if (
            party.isLegalBuyer
        ) {

            partyType =
                "LEGAL_BUYER";

        } else if (
            party.isPaymentRemitter
        ) {

            partyType =
                "PAYMENT_REMITTER";

        } else if (
            party.isConsignee
        ) {

            partyType =
                "CONSIGNEE";

        } else if (
            party.isUltimateClient
        ) {

            partyType =
                "ULTIMATE_CLIENT";

        }


        return {
            ...party,
            partyType,
        };
    };


    /* ========================================================
       ADD
    ======================================================== */

    const handleAdd = () => {

        setSelectedParty(null);

        setFormMode("add");

        setShowFormModal(true);

    };


    /* ========================================================
       EDIT
    ======================================================== */

    const handleEdit = async (
        party
    ) => {

        try {

            setLoading(true);

            const response =
                await getPartyById(
                    party.id
                );


            /*
             * Convert the existing
             * database booleans into
             * the radio-group value.
             */
            const formData =
                getPartyFormData(
                    response.data
                );


            setSelectedParty(
                formData
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


    /* ========================================================
       VIEW
    ======================================================== */

    const handleView = async (
        party
    ) => {

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


    /* ========================================================
       DELETE
    ======================================================== */

    const handleDelete = async (
        party
    ) => {

        const confirmed =
            window.confirm(
                `Delete "${party.legalName}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setLoading(true);

            await deleteParty(
                party.id
            );


            toast.success(
                "Party deleted successfully."
            );


            await loadParties();

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to delete party."
            );

        } finally {

            setLoading(false);

        }
    };


    /* ========================================================
       SUBMIT
       
       Convert:
       
       partyType: "CUSTOMER"
       
       into:
       
       isCustomer: true
       isLegalBuyer: false
       isPaymentRemitter: false
       isConsignee: false
       isUltimateClient: false
    ======================================================== */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setFormLoading(true);


            /* ==================================================
               BUILD BACKEND PAYLOAD
            ================================================== */

            const payload = {

                /*
                 * Keep the normal fields.
                 */
                partyCode:
                    formData.partyCode,

                legalName:
                    formData.legalName,

                country:
                    formData.country,

                contactEmail:
                    formData.contactEmail,


                /*
                 * Convert radio selection
                 * to existing boolean fields.
                 */
                isCustomer:
                    formData.partyType ===
                    "CUSTOMER",

                isLegalBuyer:
                    formData.partyType ===
                    "LEGAL_BUYER",

                isPaymentRemitter:
                    formData.partyType ===
                    "PAYMENT_REMITTER",

                isConsignee:
                    formData.partyType ===
                    "CONSIGNEE",

                isUltimateClient:
                    formData.partyType ===
                    "ULTIMATE_CLIENT",
            };


            /* ==================================================
               CREATE
            ================================================== */

            if (
                formMode === "add"
            ) {

                await createParty(
                    payload
                );


                toast.success(
                    "Party created successfully."
                );

            }


            /* ==================================================
               UPDATE
            ================================================== */

            else {

                await updateParty(
                    selectedParty.id,
                    payload
                );


                toast.success(
                    "Party updated successfully."
                );

            }


            /* ==================================================
               CLOSE FORM
            ================================================== */

            setShowFormModal(
                false
            );

            setSelectedParty(
                null
            );


            /* ==================================================
               REFRESH TABLE
            ================================================== */

            await loadParties();

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


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <div className="dashboard-container">

            <div className="dashboard-content">


                {/* ==================================================
                   TOOLBAR
                ================================================== */}

                <CrudToolbar
                    title="Party Service"

                    searchTerm={
                        searchTerm
                    }

                    onSearch={
                        setSearchTerm
                    }

                    onAdd={
                        handleAdd
                    }

                    addButtonText="Add Party"

                    loading={
                        loading
                    }
                />


                {/* ==================================================
                   TABLE
                ================================================== */}

                <CrudTable
                    columns={
                        columns
                    }

                    data={
                        filteredParties
                    }

                    loading={
                        loading
                    }

                    onView={
                        handleView
                    }

                    onEdit={
                        handleEdit
                    }

                    onDelete={
                        handleDelete
                    }
                />

            </div>


            {/* ======================================================
               ADD / EDIT MODAL
            ====================================================== */}

            <CrudFormModal

                title="Party"

                fields={
                    partyFields
                }

                isOpen={
                    showFormModal
                }

                mode={
                    formMode
                }

                initialData={
                    selectedParty
                }

                loading={
                    formLoading
                }

                onClose={() => {

                    if (formLoading) {
                        return;
                    }

                    setShowFormModal(
                        false
                    );

                    setSelectedParty(
                        null
                    );

                }}

                onSubmit={
                    handleSubmit
                }
            />


            {/* ======================================================
               VIEW DRAWER
            ====================================================== */}

            <ViewPartyDrawer

                isOpen={
                    showDrawer
                }

                party={
                    selectedParty
                }

                onClose={() => {

                    setShowDrawer(
                        false
                    );

                    setSelectedParty(
                        null
                    );

                }}
            />

        </div>
    );
};


export default PartyServiceDashboard;