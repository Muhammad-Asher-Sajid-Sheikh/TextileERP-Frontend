import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import "../../styles/preApprovedSamples/ppsForm.css";

import {
    createPreApprovedSample,
    updatePreApprovedSample,
} from "../../services/preApprovedSampleApi";

export default function PPSForm({
    techPack,
    existingCount = 0,
    editingPPS,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        serialNo:
            editingPPS?.serialNo ??
            existingCount + 1,

        itemName:
            editingPPS?.itemName ?? "",

        required:
            editingPPS?.required ?? "YES",

        detailsSpecification:
            editingPPS?.detailsSpecification ?? "",

        customerInfoReceived:
            editingPPS?.customerInfoReceived ?? "NO",

        customerApprovalReceived:
            editingPPS?.customerApprovalReceived ?? "NO",

        finalQtyConfirmed:
            editingPPS?.finalQtyConfirmed ?? "NO",

        status:
            editingPPS?.status ?? "Pending",

        remarks:
            editingPPS?.remarks ?? "",

    });

    useEffect(() => {

        if (editingPPS) {

            setFormData({

                serialNo: editingPPS.serialNo,
                itemName: editingPPS.itemName,
                required: editingPPS.required,
                detailsSpecification: editingPPS.detailsSpecification,
                customerInfoReceived: editingPPS.customerInfoReceived,
                customerApprovalReceived: editingPPS.customerApprovalReceived,
                finalQtyConfirmed: editingPPS.finalQtyConfirmed,
                status: editingPPS.status,
                remarks: editingPPS.remarks,

            });

        } else {

            setFormData({

                serialNo: existingCount + 1,
                itemName: "",
                required: "YES",
                detailsSpecification: "",
                customerInfoReceived: "NO",
                customerApprovalReceived: "NO",
                finalQtyConfirmed: "NO",
                status: "Pending",
                remarks: "",

            });

        }

    }, [editingPPS, existingCount]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            if (editingPPS) {

                const response =
                    await updatePreApprovedSample(
                        editingPPS.id,
                        formData
                    );

                toast.success(
                    response?.data?.message ||
                    "PPS updated successfully."
                );

            } else {

                const response =
                    await createPreApprovedSample(
                        techPack.id,
                        formData
                    );

                toast.success(
                    response?.data?.message ||
                    "Pre Approved Sample added successfully."
                );

            }

            onSuccess?.();

        }

        catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to save PPS."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <form
            className="pps-form"
            onSubmit={handleSubmit}
        >

            <h2>

                {

                    editingPPS

                        ? "Update Pre Approved Sample"

                        : "Add Pre Approved Sample"

                }

            </h2>

            <div className="pps-grid">

                <div>

                    <label>Serial No</label>

                    <input
                        type="number"
                        value={formData.serialNo}
                        readOnly
                    />

                </div>

                <div>

                    <label>Item Name</label>

                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>Required</label>

                    <select
                        name="required"
                        value={formData.required}
                        onChange={handleChange}
                    >

                        <option value="YES">YES</option>
                        <option value="NO">NO</option>

                    </select>

                </div>

                <div>

                    <label>Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >

                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>

                    </select>

                </div>

            </div>

            <div>

                <label>Details / Specification</label>

                <textarea
                    name="detailsSpecification"
                    value={formData.detailsSpecification}
                    onChange={handleChange}
                    rows={4}
                    required
                />

            </div>

            <div className="pps-grid">

                <div>

                    <label>Customer Info Received</label>

                    <select
                        name="customerInfoReceived"
                        value={formData.customerInfoReceived}
                        onChange={handleChange}
                    >

                        <option value="YES">YES</option>
                        <option value="NO">NO</option>

                    </select>

                </div>

                <div>

                    <label>Customer Approval Received</label>

                    <select
                        name="customerApprovalReceived"
                        value={formData.customerApprovalReceived}
                        onChange={handleChange}
                    >

                        <option value="YES">YES</option>
                        <option value="NO">NO</option>

                    </select>

                </div>

                <div>

                    <label>Final Quantity Confirmed</label>

                    <select
                        name="finalQtyConfirmed"
                        value={formData.finalQtyConfirmed}
                        onChange={handleChange}
                    >

                        <option value="YES">YES</option>
                        <option value="NO">NO</option>

                    </select>

                </div>

                <div>

                    <label>Remarks</label>

                    <input
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                    />

                </div>

            </div>

            <button
                type="submit"
                disabled={loading}
            >

                {

                    loading

                        ? "Saving..."

                        : editingPPS

                            ? "Update PPS"

                            : "Save PPS"

                }

            </button>

        </form>

    );

}