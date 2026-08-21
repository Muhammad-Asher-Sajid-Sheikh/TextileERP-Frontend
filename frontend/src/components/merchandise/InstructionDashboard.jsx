import { useEffect, useState } from "react";
import Modal from "./Modal";
import TechPackForm from "./TechPackForm";
import InstructionTable from "./InstructionTable";
//import mockTechPacks from "../../assets/mockTechPacks";

import {
    getAllTechPacks
} from "../../services/techPackApi";

import "../../styles/merchandise/instructionDashboard.css";

export default function InstructionDashboard() {

    const [instructions, setInstructions] = useState([]);

    const [filteredInstructions, setFilteredInstructions] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState("");

    /**
     * Fetch all instructions
     */

    const fetchInstructions = async () => {

        setLoading(true);

        try {

            const response = await getAllTechPacks();

            const techpacks = response || [];


            setInstructions(techpacks);
            setFilteredInstructions(techpacks);

        }

        catch (error) {

            console.error(error);

            setInstructions([]);
            setFilteredInstructions([]);

        }

        finally {

            setLoading(false);

        }

    };

    /**
     * Initial load
     */

    useEffect(() => {

        fetchInstructions();

    }, []);

    /**
     * Search
     */

    useEffect(() => {

        if (!search.trim()) {

            setFilteredInstructions(instructions);

            return;

        }

        const keyword = search.toLowerCase();

        const filtered = instructions.filter((item) =>

            item.designName
                ?.toLowerCase()
                .includes(keyword)

            ||

            item.seasonCode
                ?.toLowerCase()
                .includes(keyword)

        );

        setFilteredInstructions(filtered);

    }, [search, instructions]);

    /**
     * Modal success callback
     */

    const handleCreated = async () => {

        setShowModal(false);

        await fetchInstructions();

    };

    return (

        <div className="instruction-dashboard">

            <div className="instruction-header black">

                <h2>
                    Instructions ({filteredInstructions.length})
                </h2>

                <div className="header-buttons">

                    <button
                        className="refresh-btn"
                        onClick={fetchInstructions}
                    >
                        Refresh
                    </button>

                    <button
                        className="add-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Add New Instruction
                    </button>

                </div>

            </div>

            <div className="search-container">

                <input
                    type="text"
                    placeholder="Search by Design Name or Season..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            <InstructionTable
                loading={loading}
                instructions={filteredInstructions}
                refreshInstructions={fetchInstructions}
            />

            {

                showModal && (

                    <Modal
                        onClose={() =>
                            setShowModal(false)
                        }
                    >

                        <TechPackForm
                            onSuccess={handleCreated}
                        />

                    </Modal>

                )

            }

        </div>

    );

}