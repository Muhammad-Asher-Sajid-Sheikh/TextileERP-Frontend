import "../../styles/merchandise/instructionDetails.css";

export default function InstructionDetailsModal({
    instruction,
    onClose,
}) {

    if (!instruction) return null;

    return (

        <div className="modal-overlay">

            <div className="instruction-details">

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2>
                    Instruction Details
                </h2>

                <div className="detail-grid">

                    <div>

                        <label>Design Name</label>

                        <p>{instruction.designName}</p>

                    </div>

                    <div>

                        <label>Season</label>

                        <p>{instruction.seasonCode}</p>

                    </div>

                    <div>

                        <label>Target Quantity</label>

                        <p>{instruction.totalTargetQuantity}</p>

                    </div>

                    <div>

                        <label>Version</label>

                        <p>V{instruction.version}</p>

                    </div>

                    <div>

                        <label>Status</label>

                        <p>

                            {
                                instruction.isLocked
                                    ? "Released"
                                    : "Draft"
                            }

                        </p>

                    </div>

                    <div>

                        <label>Weaving</label>

                        <p>

                            {
                                instruction.weavingSpec
                                    ? "Added"
                                    : "Not Added"
                            }

                        </p>

                    </div>

                    <div>

                        <label>Dyeing</label>

                        <p>

                            {
                                instruction.dyeingSpec
                                    ? "Added"
                                    : "Not Added"
                            }

                        </p>

                    </div>

                    <div>

                        <label>Components</label>

                        <p>

                            {
                                instruction.components
                                    ? instruction.components.length
                                    : 0
                            }

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}