import {
    releaseTechPack,
    createRevision,
} from "../../services/techPackApi";
import { toast } from "react-toastify";
import { useState } from "react";


import InstructionDetailsModal from "./InstructionDetailsModal";
import "../../styles/merchandise/instructionTable.css";

export default function InstructionTable({
    loading,
    instructions,
    refreshInstructions,
}) {
    const [selectedInstruction, setSelectedInstruction] = useState(null);

    const handleRelease = async (id) => {

        try {

            const response = await releaseTechPack(id);
            

            toast.success(
                response?.data?.message ||
                "Instruction released successfully."
            );

            refreshInstructions();

        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to release instruction."
            );

        }

    };

    const handleRevision = async (id) => {

        try {

            const response = await createRevision(id);

            toast.success(
                response?.data?.message ||
                "Revision created successfully."
            );

            refreshInstructions();

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to create revision."
            );

        }

    };

    const handleDelete = () => {

        toast.info(
            "Delete functionality will be available soon."
        );

    };

    if (loading) {

        return (

            <div className="table-message">

                Loading Instructions...

            </div>

        );

    }

    if (!instructions.length) {

        return (

            <div className="table-message">

                No Instructions Found.

            </div>

        );

    }

    return (

        <table className="instruction-table">

            <thead>

                <tr>

                    <th>Design Name</th>

                    <th>Season</th>

                    <th>Quantity</th>

                    <th>Version</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    instructions.map((instruction) => (

                        <tr key={instruction.id}>

                            <td>

                                {instruction.designName}

                            </td>

                            <td>

                                {instruction.seasonCode}

                            </td>

                            <td>

                                {instruction.totalTargetQuantity}

                            </td>

                            <td>

                                V{instruction.version}

                            </td>

                            <td>

                                {

                                    instruction.isLocked ? (

                                        <span className="status released">

                                            Released

                                        </span>

                                    ) : (

                                        <span className="status draft">

                                            Draft

                                        </span>

                                    )

                                }

                            </td>

                            <td>

                                {

                                    instruction.isLocked ? (

                                        <button
                                            className="revision-btn"
                                            onClick={() =>
                                                handleRevision(
                                                    instruction.id
                                                )
                                            }
                                        >

                                            Create Revision

                                        </button>

                                    ) : (

                                        <button
                                            className="release-btn"
                                            onClick={() =>
                                                handleRelease(
                                                    instruction.id
                                                )
                                            }
                                        >

                                            Release

                                        </button>

                                        

                                    )

                                }

                                {/* <button
                                    className="view-btn"
                                    onClick={() =>
                                        setSelectedInstruction(instruction)
                                    }
                                >

                                    View

                                </button>*/}

                                <button
                                    className="delete-btn"
                                    onClick={handleDelete}
                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

        

    );

    {
        selectedInstruction && (

            <InstructionDetailsModal
                instruction={selectedInstruction}
                onClose={() =>
                    setSelectedInstruction(null)
                }
            />

        )
    }

}