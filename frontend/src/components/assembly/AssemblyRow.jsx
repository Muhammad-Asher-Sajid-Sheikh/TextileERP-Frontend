const AssemblyRow = ({
    jobCard,
    onView,
    onLogPhase,
    onCompletePhase,
}) => {
    const progress =
        jobCard.phaseCount > 0
            ? `${jobCard.completedPhases}/${jobCard.phaseCount}`
            : "0/0";

    return (
        <tr>
            <td>{jobCard.workerId}</td>

            <td>{jobCard.workerName}</td>

            <td>{jobCard.basePieceRate}</td>

            <td>{jobCard.totalPiecesCompleted}</td>

            <td>{jobCard.calculatedWage}</td>

            <td>{jobCard.completedPhases}</td>

            <td>{progress}</td>

            <td className="assembly-actions">

                <button
                    className="assembly-btn log"
                    onClick={() => onLogPhase(jobCard)}
                >
                    Log Phase
                </button>

                <button
                    className="assembly-btn complete"
                    onClick={() => onCompletePhase(jobCard)}
                >
                    Complete
                </button>

                <button
                    className="assembly-btn view"
                    onClick={() => onView(jobCard)}
                >
                    View
                </button>

            </td>
        </tr>
    );
};

export default AssemblyRow;