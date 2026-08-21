import AssemblyRow from "./AssemblyRow";
import "../../styles/assembly/table.css";

const AssemblyTable = ({
    jobCards = [],
    loading = false,
    onView,
    onLogPhase,
    onCompletePhase,
}) => {
    if (loading) {
        return (
            <div className="assembly-empty-state">
                Loading job cards...
            </div>
        );
    }

    if (!jobCards.length) {
        return (
            <div className="assembly-empty-state">
                No job cards found.
            </div>
        );
    }

    return (
        <div className="assembly-table-wrapper">
            <table className="assembly-table">
                <thead>
                    <tr>
                        <th>Worker ID</th>
                        <th>Worker Name</th>
                        <th>Piece Rate</th>
                        <th>Pieces</th>
                        <th>Wage</th>
                        <th>Completed</th>
                        <th>Progress</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {jobCards.map((jobCard) => (
                        <AssemblyRow
                            key={jobCard.jobCardId}
                            jobCard={jobCard}
                            onView={onView}
                            onLogPhase={onLogPhase}
                            onCompletePhase={onCompletePhase}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssemblyTable;