import "../../styles/assembly/modal.css";
import { ASSEMBLY_PHASES } from "../../constants/assemblyPhases";

const getPhaseLabel = (phaseValue) => {
    const phase = ASSEMBLY_PHASES.find(
        (item) => item.value === phaseValue
    );

    return phase ? phase.label : phaseValue;
};

const JobCardDrawer = ({
    open,
    onClose,
    jobCard,
}) => {

    if (!open || !jobCard) return null;

    return (
        <div className="drawer-overlay">

            <div className="drawer">

                <div className="drawer-header">
                    <h2>Job Card Details</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="drawer-content">

                    <div className="drawer-section">
                        <h3>Worker Information</h3>

                        <p><strong>Worker ID:</strong> {jobCard.workerId}</p>

                        <p><strong>Name:</strong> {jobCard.workerName}</p>

                        <p><strong>Piece Rate:</strong> {jobCard.basePieceRate}</p>

                        <p><strong>Total Pieces:</strong> {jobCard.totalPiecesCompleted}</p>

                        <p><strong>Calculated Wage:</strong> {jobCard.calculatedWage}</p>
                    </div>

                    <div className="drawer-section">
                        <h3>Assembly Phases</h3>

                        {jobCard.phaseLogs?.length ? (

                            <table className="phase-table">

                                <thead>
                                    <tr>
                                        <th>Phase</th>
                                        <th>Status</th>
                                        <th>Pieces</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {jobCard.phaseLogs.map((phase) => (

                                        <tr key={phase.phaseLogId}>

                                            <td>{getPhaseLabel(phase.phase)}</td>

                                            <td>{phase.status}</td>

                                            <td>{phase.piecesProcessed}</td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        ) : (

                            <p>No phases logged yet.</p>

                        )}
                    </div>

                    <div className="drawer-section">

                        <h3>Timestamps</h3>

                        <p>
                            <strong>Created:</strong>{" "}
                            {new Date(jobCard.createdAt).toLocaleString()}
                        </p>

                        <p>
                            <strong>Updated:</strong>{" "}
                            {new Date(jobCard.updatedAt).toLocaleString()}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default JobCardDrawer;