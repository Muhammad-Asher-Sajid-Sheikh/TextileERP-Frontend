import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "./Modal";
import WeavingForm from "./WeavingForm";
//import mockTechPacks from "../../assets/mockTechPacks";

import {
    getAllTechPacks,
    getTechPack,
} from "../../services/techPackApi";

import "../../styles/merchandise/weavingDashboard.css";

export default function WeavingDashboard() {

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

            const response = await getAllTechPacks();

            const techpacks = response || [];

            setTechPacks(techpacks);

            //setTechPacks(mockTechPacks);

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

            toast.error("Unable to load weaving specification.");

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

        <div className="weaving-dashboard">

            <div className="weaving-header">

                <h2>

                    Weaving Instructions

                </h2>

                <div className="weaving-actions">

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

                                    {techPack.designName} (V{techPack.version})

                                </option>

                            ))

                        }

                    </select>

                    <button

                        className="weaving-btn"

                        disabled={
                            !selectedTechPack ||
                            selectedTechPack.isLocked
                        }

                        onClick={() => setShowModal(true)}

                    >

                        {

                            selectedTechPack?.weavingSpec

                                ? "Update Weaving"

                                : "+ Add Weaving"

                        }

                    </button>

                </div>

            </div>

            {

                selectedTechPack?.isLocked && (

                    <div className="locked-warning">

                        This instruction has been released.

                        Create a revision before updating the weaving specification.

                    </div>

                )

            }

            {

                !selectedTechPack && (

                    <div className="weaving-empty">

                        Select an instruction to view its weaving specification.

                    </div>

                )

            }

            {

                loading && (

                    <div className="weaving-empty">

                        Loading...

                    </div>

                )

            }

            {

                selectedTechPack && !loading && (

                    <div className="weaving-card">

                        {

                            !selectedTechPack.weavingSpec ? (

                                <div className="weaving-empty">

                                    No weaving specification has been added yet.

                                </div>

                            ) : (

                                <>

                                    <div className="weaving-row">

                                        <span>Loom Type</span>

                                        <strong>

                                            {selectedTechPack.weavingSpec.loomType}

                                        </strong>

                                    </div>

                                    <div className="weaving-row">

                                        <span>Warp Yarn Count</span>

                                        <strong>

                                            {selectedTechPack.weavingSpec.warpYarnCount}

                                        </strong>

                                    </div>

                                    <div className="weaving-row">

                                        <span>Weft Yarn Count</span>

                                        <strong>

                                            {selectedTechPack.weavingSpec.weftYarnCount}

                                        </strong>

                                    </div>

                                    <div className="weaving-row">

                                        <span>Pile Yarn Count</span>

                                        <strong>

                                            {selectedTechPack.weavingSpec.pileYarnCount}

                                        </strong>

                                    </div>

                                    <div className="weaving-row">

                                        <span>Picks Per Inch</span>

                                        <strong>

                                            {selectedTechPack.weavingSpec.picksPerInch}

                                        </strong>

                                    </div>

                                    <div className="weaving-row">

                                        <span>Ends Per Inch</span>

                                        <strong>

                                            {selectedTechPack.weavingSpec.endsPerInch}

                                        </strong>

                                    </div>

                                    <div className="weaving-row">

                                        <span>Terry Ratio</span>

                                        <strong>

                                            {selectedTechPack.weavingSpec.terryRatio}

                                        </strong>

                                    </div>

                                    <div className="weaving-row notes">

                                        <span>

                                            Technical Notes

                                        </span>

                                        <p>

                                            {selectedTechPack.weavingSpec.technicalNotes}

                                        </p>

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

                        <WeavingForm

                            techPack={selectedTechPack}

                            onSuccess={handleSuccess}

                        />

                    </Modal>

                )

            }

        </div>

    );

}