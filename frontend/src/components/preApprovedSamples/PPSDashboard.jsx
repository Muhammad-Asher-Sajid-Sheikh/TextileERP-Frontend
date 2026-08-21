import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../merchandise/Modal";
import PPSTable from "./PPSTable";
import PPSForm from "./PPSForm";

import {
    getAllTechPacks,
    getTechPack,
} from "../../services/techPackApi";

import {
    getPreApprovedSamples,
} from "../../services/preApprovedSampleApi";

import "../../styles/preApprovedSamples/ppsDashboard.css";

export default function PPSDashboard() {

    const [techPacks, setTechPacks] = useState([]);

    const [selectedTechPackId, setSelectedTechPackId] = useState("");

    const [selectedTechPack, setSelectedTechPack] = useState(null);

    const [ppsList, setPpsList] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [editingPPS, setEditingPPS] = useState(null);

    /**
     * Load Instructions
     */
    const fetchTechPacks = async () => {

        try {

            const response = await getAllTechPacks();

            setTechPacks(response);

        }

        catch (error) {

            console.error(error);

            toast.error("Unable to load instructions.");

        }

    };

    /**
     * Load selected instruction
     */
    const fetchSelectedTechPack = async (id) => {

        if (!id) {

            setSelectedTechPack(null);

            setPpsList([]);

            return;

        }

        setLoading(true);

        try {

            const techPackResponse = await getTechPack(id);

            setSelectedTechPack(
                techPackResponse?.data?.data
            );

            const ppsResponse =
                await getPreApprovedSamples(id);

            setPpsList(
                ppsResponse?.data?.data || []
            );

        }

        catch (error) {

            console.error(error);

            setPpsList([]);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchTechPacks();

    }, []);

    useEffect(() => {

        if (selectedTechPackId) {

            fetchSelectedTechPack(selectedTechPackId);

        }

    }, [selectedTechPackId]);

    const handleSuccess = async () => {

        setShowModal(false);

        await fetchSelectedTechPack(selectedTechPackId);

    };

    return (

        <div className="pps-dashboard">

            <div className="pps-header">

                <h2>

                    Pre Approved Samples

                </h2>

                <div className="pps-actions">

                    <select

                        value={selectedTechPackId}

                        onChange={(e) =>
                            setSelectedTechPackId(
                                e.target.value
                            )
                        }

                    >

                        <option value="">

                            Select Instruction

                        </option>

                        {

                            techPacks.map((techPack) => (

                                <option

                                    key={techPack.id}

                                    value={techPack.id}

                                >

                                    {techPack.designName}
                                    {" • "}
                                    Season {techPack.seasonCode}
                                    {" • "}
                                    Qty {techPack.totalTargetQuantity}
                                    {" • "}
                                    V{techPack.version}

                                </option>

                            ))

                        }

                    </select>

                    <button

                        className="pps-btn"

                        disabled={!selectedTechPack}

                        onClick={() => {

                            setEditingPPS(null);

                            setShowModal(true);

                        }}

                    >

                        + Add PPS

                    </button>

                </div>

            </div>

            {

                !selectedTechPack && (

                    <div className="pps-empty">

                        Select an instruction to view
                        Pre Approved Samples.

                    </div>

                )

            }

            {

                selectedTechPack && !loading && (

                    <PPSTable
                        ppsList={ppsList}
                        onEdit={(pps) => {

                            setEditingPPS(pps);

                            setShowModal(true);

                        }}
                        refresh={handleSuccess}
                    />

                )

            }

            {

                showModal && (

                    <Modal

                        onClose={() =>
                            setShowModal(false)
                        }

                    >

                        <PPSForm
                            techPack={selectedTechPack}
                            existingCount={ppsList.length}
                            editingPPS={editingPPS}
                            onSuccess={() => {

                                setEditingPPS(null);

                                handleSuccess();

                            }}
                        />

                    </Modal>

                )

            }

        </div>

    );

}