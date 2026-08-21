import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "./Modal";
import ComponentForm from "./ComponentForm";
import ComponentTable from "./ComponentTable";
//import mockTechPacks from "../../assets/mockTechPacks";

import DetailsDrawer from "../common/DetailsDrawer";
import DetailSection from "../common/DetailSection";
import DetailItem from "../common/DetailItem";

import {
    getAllTechPacks,
    getTechPack,
} from "../../services/techPackApi";

import "../../styles/merchandise/componentsDashboard.css";

export default function ComponentsDashboard() {

    const [techPacks, setTechPacks] = useState([]);

    const [selectedTechPackId, setSelectedTechPackId] = useState("");

    const [selectedTechPack, setSelectedTechPack] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [selectedComponent, setSelectedComponent] = useState(null);

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

            setSelectedTechPack(
                response?.data?.data
            );

        }

        catch (error) {

            console.error(error);

            toast.error("Unable to load components.");

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

            fetchSelectedTechPack(
                selectedTechPackId
            );

        }

    }, [selectedTechPackId]);

    /**
     * Component Created Successfully
     */

    const handleComponentCreated = async () => {

        setShowModal(false);

        await fetchSelectedTechPack(
            selectedTechPackId
        );

    };

    return (

        <div className="components-dashboard">

            <div className="components-header">

                <h2>

                    Components

                </h2>

                <div className="components-actions">

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

                                    {techPack.designName} (V{techPack.version})

                                </option>

                            ))

                        }

                    </select>

                    <button

                        className="add-component-btn"

                        disabled={
                            !selectedTechPack ||
                            selectedTechPack.isLocked
                        }

                        onClick={() =>
                            setShowModal(true)
                        }

                    >

                        + Add Component

                    </button>

                </div>

            </div>

            {

                selectedTechPack?.isLocked && (

                    <div className="locked-warning">

                        This instruction has been released.

                        Create a revision before adding or deleting components.

                    </div>

                )

            }

            <ComponentTable

                loading={loading}

                techPack={selectedTechPack}

                refresh={() =>
                    fetchSelectedTechPack(
                        selectedTechPackId
                    )
                }

                onView={setSelectedComponent}

            />

            {

                showModal && (

                    <Modal

                        onClose={() =>
                            setShowModal(false)
                        }

                    >

                        <ComponentForm

                            techPackId={
                                selectedTechPackId
                            }

                            onSuccess={
                                handleComponentCreated
                            }

                        />

                    </Modal>

                )

            }

            <DetailsDrawer
                open={!!selectedComponent}
                title={selectedComponent?.componentName || "Component Details"}
                onClose={() => setSelectedComponent(null)}
            >

                {selectedComponent && (

                    <>

                        <DetailSection title="Dimensions">

                            <DetailItem
                                label="Cut Length"
                                value={`${selectedComponent.cutLengthInches} in`}
                            />

                            <DetailItem
                                label="Cut Width"
                                value={`${selectedComponent.cutWidthInches} in`}
                            />

                            <DetailItem
                                label="Finished Length"
                                value={`${selectedComponent.finishedLengthCms} cm`}
                            />

                            <DetailItem
                                label="Finished Width"
                                value={`${selectedComponent.finishedWidthCms} cm`}
                            />

                        </DetailSection>

                        <DetailSection title="Production">

                            <DetailItem
                                label="Target GSM"
                                value={selectedComponent.targetGsm}
                            />

                            <DetailItem
                                label="Target Piece Weight"
                                value={`${selectedComponent.targetPieceWeightGm} gm`}
                            />

                            <DetailItem
                                label="Stitching Type"
                                value={selectedComponent.stitchingType}
                            />

                            <DetailItem
                                label="Border Structure"
                                value={selectedComponent.borderStructure}
                            />

                            <DetailItem
                                label="Carton Packing Ratio"
                                value={selectedComponent.cartonPackingRatio}
                            />

                        </DetailSection>

                        <DetailSection title="Printing">

                            <DetailItem
                                label="Print Method"
                                value={selectedComponent.printingSpec?.printMethod}
                            />

                            <DetailItem
                                label="Placement Area"
                                value={selectedComponent.printingSpec?.placementArea}
                            />

                            <DetailItem
                                label="Color Count"
                                value={selectedComponent.printingSpec?.colorCount}
                            />

                        </DetailSection>

                    </>

                )}

            </DetailsDrawer>

        </div>

    );

}