import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "./Modal";
import DyeingForm from "./DyeingForm";

import {
    getAllTechPacks,
    getTechPack,
} from "../../services/techPackApi";

import "../../styles/merchandise/dyeingDashboard.css";

export default function DyeingDashboard() {

    const [techPacks, setTechPacks] = useState([]);

    const [selectedTechPackId, setSelectedTechPackId] = useState("");

    const [selectedTechPack, setSelectedTechPack] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    /**
     * Load all Tech Packs
     */
    const fetchTechPacks = async () => {

        try {

            const techPacks = await getAllTechPacks();

            setTechPacks(techPacks);

        }

        catch (error) {

            console.error(error);

            toast.error("Unable to load instructions.");

        }

    };

    /**
     * Load selected Tech Pack
     */
    const fetchSelectedTechPack = async (id) => {

        if (!id) {

            setSelectedTechPack(null);

            return;

        }

        setLoading(true);

        try {

            const response = await getTechPack(id);

            setSelectedTechPack(response?.data?.data);

        }

        catch (error) {

            console.error(error);

            toast.error("Unable to load dyeing specification.");

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

    /**
     * Refresh after save
     */
    const handleSuccess = async () => {

        setShowModal(false);

        await fetchSelectedTechPack(selectedTechPackId);

    };

    return (

        <div className="dyeing-dashboard">

            <div className="dyeing-header">

                <h2>

                    Dyeing Instructions

                </h2>

                <div className="dyeing-actions">

                    <select

                        value={selectedTechPackId}

                        onChange={(e) =>
                            setSelectedTechPackId(e.target.value)
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

                                    {techPack.designName} • Season {techPack.seasonCode} • Qty {techPack.totalTargetQuantity} • V{techPack.version}

                                </option>

                            ))

                        }

                    </select>

                    <button

                        className="dyeing-btn"

                        disabled={
                            !selectedTechPack ||
                            selectedTechPack.isLocked
                        }

                        onClick={() => setShowModal(true)}

                    >

                        {

                            selectedTechPack?.dyeingSpec

                                ? "Update Dyeing"

                                : "+ Add Dyeing"

                        }

                    </button>

                </div>

            </div>

            {

                selectedTechPack?.isLocked && (

                    <div className="locked-warning">

                        This instruction has been released.

                        Create a revision before updating the dyeing specification.

                    </div>

                )

            }

            {

                !selectedTechPack && (

                    <div className="dyeing-empty">

                        Select an instruction to view its dyeing specification.

                    </div>

                )

            }

            {

                loading && (

                    <div className="dyeing-empty">

                        Loading...

                    </div>

                )

            }

            {

                selectedTechPack && !loading && (

                    <div className="dyeing-card">

                        {

                            !selectedTechPack.dyeingSpec ? (

                                <div className="dyeing-empty">

                                    No dyeing specification has been added yet.

                                </div>

                            ) : (

                                <>

                                    <div className="dyeing-row">

                                        <span>Dye Type</span>

                                        <strong>

                                            {selectedTechPack.dyeingSpec.dyeType}

                                        </strong>

                                    </div>

                                    <div className="dyeing-row">

                                        <span>Color Name</span>

                                        <strong>

                                            {selectedTechPack.dyeingSpec.colorName}

                                        </strong>

                                    </div>

                                    <div className="dyeing-row">

                                        <span>Pantone Code</span>

                                        <strong>

                                            {selectedTechPack.dyeingSpec.pantoneCode}

                                        </strong>

                                    </div>

                                    <div className="dyeing-row">

                                        <span>Chemical Restraints</span>

                                        <strong>

                                            {selectedTechPack.dyeingSpec.chemicalRestraints}

                                        </strong>

                                    </div>

                                    <div className="dyeing-row">

                                        <span>Target Shrinkage (%)</span>

                                        <strong>

                                            {selectedTechPack.dyeingSpec.targetShrinkagePct}

                                        </strong>

                                    </div>

                                </>

                            )

                        }

                    </div>

                )

            }

            {

                showModal && (

                    <Modal

                        onClose={() => setShowModal(false)}

                    >

                        <DyeingForm

                            techPack={selectedTechPack}

                            onSuccess={handleSuccess}

                        />

                    </Modal>

                )

            }

        </div>

    );

}