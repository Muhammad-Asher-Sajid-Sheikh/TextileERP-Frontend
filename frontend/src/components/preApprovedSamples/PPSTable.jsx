import "../../styles/preApprovedSamples/ppsTable.css";
import { toast } from "react-toastify";
import {
    deletePreApprovedSample,
} from "../../services/preApprovedSampleApi";

export default function PPSTable({

    ppsList,

    onEdit,

    refresh,

}) {

    const handleDelete = async (pps) => {

        if (

            !window.confirm(

                `Delete "${pps.itemName}"?`

            )

        ) return;

        try {

            await deletePreApprovedSample(pps.id);

            toast.success(

                "PPS deleted successfully."

            );

            refresh();

        }

        catch (error) {

            console.error(error);

            toast.error(

                "Unable to delete PPS."

            );

        }

    };

    if (!ppsList.length) {

        return (

            <div className="pps-table-empty">

                No Pre Approved Samples have been added yet.

            </div>

        );

    }

    return (

        <div className="pps-table-wrapper">

            <table className="pps-table">

                <thead>

                    <tr>

                        <th>Serial</th>

                        <th>Item</th>

                        <th>Required</th>

                        <th>Customer Info</th>

                        <th>Customer Approval</th>

                        <th>Final Qty</th>

                        <th>Status</th>

                        <th>Remarks</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        ppsList.map((pps) => (

                            <tr key={pps.id}>

                                <td>

                                    {pps.serialNo}

                                </td>

                                <td>

                                    <strong>

                                        {pps.itemName}

                                    </strong>

                                </td>

                                <td>

                                    <span

                                        className={`badge ${pps.required === "YES"

                                            ? "badge-success"

                                            : "badge-danger"

                                            }`}

                                    >

                                        {pps.required}

                                    </span>

                                </td>

                                <td>

                                    <span

                                        className={`badge ${pps.customerInfoReceived === "YES"

                                            ? "badge-success"

                                            : "badge-warning"

                                            }`}

                                    >

                                        {pps.customerInfoReceived}

                                    </span>

                                </td>

                                <td>

                                    <span

                                        className={`badge ${pps.customerApprovalReceived === "YES"

                                            ? "badge-success"

                                            : "badge-warning"

                                            }`}

                                    >

                                        {pps.customerApprovalReceived}

                                    </span>

                                </td>

                                <td>

                                    <span

                                        className={`badge ${pps.finalQtyConfirmed === "YES"

                                            ? "badge-success"

                                            : "badge-warning"

                                            }`}

                                    >

                                        {pps.finalQtyConfirmed}

                                    </span>

                                </td>

                                <td>

                                    <span

                                        className={`status ${pps.status
                                                ?.toLowerCase()
                                                .includes("done")

                                            ? "done"

                                            : "pending"

                                            }`}

                                    >

                                        {pps.status}

                                    </span>

                                </td>

                                <td>

                                    {pps.remarks || "-"}

                                </td>

                                <td>

                                    <div className="pps-actions">

                                        {/*<button

                                            className="view-btn"

                                        >

                                            View

                                        </button>*/}

                                        <button

                                            className="edit-btn"

                                            onClick={() => onEdit(pps)}

                                        >

                                            Edit

                                        </button>

                                        <button

                                            className="delete-btn"

                                            onClick={() => handleDelete(pps)}

                                        >

                                            Delete

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}