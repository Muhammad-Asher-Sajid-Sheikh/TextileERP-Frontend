import "../../styles/surfaceDecorations/table.css";
import SurfaceDecorationRow from "./SurfaceDecorationRow";

const SurfaceDecorationsTable = ({
    selectedProcess,
    records = [],
    loading = false,
    onView,
    onComplete,
    onDispatch,
}) => {

    const isPrinting = selectedProcess === "PRINTING";

    return (
        <div className="surface-table-container">

            <table className="surface-table">

                <thead>

                    <tr>

                        <th>Design</th>

                        <th>
                            {isPrinting
                                ? "Rolls Sent"
                                : "Pieces Cut"}
                        </th>

                        <th>Status</th>

                        <th>Updated</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>
                    [console.log(records);]
                    {loading ? (

                        <tr>
                            <td
                                colSpan="5"
                                className="empty-row"
                            >
                                Loading...
                            </td>
                        </tr>

                    ) : records.length === 0 ? (

                        <tr>
                            <td
                                colSpan="5"
                                className="empty-row"
                            >
                                No records found.
                            </td>
                        </tr>

                    ) : (
                        

                        records.map((record) => (
                            <SurfaceDecorationRow
                                key={record.id}
                                record={record}
                                selectedProcess={selectedProcess}
                                onView={onView}
                                onDispatch={onDispatch}
                                onComplete={onComplete}
                            />
                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default SurfaceDecorationsTable;