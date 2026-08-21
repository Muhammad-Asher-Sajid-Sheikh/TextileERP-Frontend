import { useState } from "react";
import { toast } from "react-toastify";

import { createComponent } from "../../services/techPackApi";

import "../../styles/merchandise/componentForm.css";

export default function ComponentForm({

    techPackId,

    onSuccess,

}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        componentName: "",

        cutLengthInches: "",

        cutWidthInches: "",

        finishedLengthCms: "",

        finishedWidthCms: "",

        targetGsm: "",

        targetPieceWeightGm: "",

        stitchingType: "",

        borderStructure: "",

        cartonPackingRatio: "",

        printingSpec: {

            printMethod: "",

            placementArea: "",

            colorCount: "",

        },

    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handlePrintingChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            printingSpec: {

                ...prev.printingSpec,

                [name]: value,

            },

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const payload = {

                ...formData,

                cutLengthInches: Number(formData.cutLengthInches),

                cutWidthInches: Number(formData.cutWidthInches),

                finishedLengthCms: Number(formData.finishedLengthCms),

                finishedWidthCms: Number(formData.finishedWidthCms),

                targetGsm: Number(formData.targetGsm),

                targetPieceWeightGm: Number(formData.targetPieceWeightGm),

                cartonPackingRatio: Number(formData.cartonPackingRatio),

                printingSpec: {

                    ...formData.printingSpec,

                    colorCount: Number(formData.printingSpec.colorCount),

                },

            };

            const response = await createComponent(

                techPackId,

                payload

            );

            toast.success(

                response?.data?.message ||

                "Component added successfully."

            );

            if (onSuccess) {

                onSuccess();

            }

        }

        catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to add component."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <form

            className="component-form"

            onSubmit={handleSubmit}

        >

            <h2>

                Add Component

            </h2>

            <input
                type="text"
                name="componentName"
                placeholder="Component Name"
                value={formData.componentName}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="cutLengthInches"
                placeholder="Cut Length (Inches)"
                value={formData.cutLengthInches}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="cutWidthInches"
                placeholder="Cut Width (Inches)"
                value={formData.cutWidthInches}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="finishedLengthCms"
                placeholder="Finished Length (Cms)"
                value={formData.finishedLengthCms}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="finishedWidthCms"
                placeholder="Finished Width (Cms)"
                value={formData.finishedWidthCms}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="targetGsm"
                placeholder="Target GSM"
                value={formData.targetGsm}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="targetPieceWeightGm"
                placeholder="Target Piece Weight (gm)"
                value={formData.targetPieceWeightGm}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="stitchingType"
                placeholder="Stitching Type"
                value={formData.stitchingType}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="borderStructure"
                placeholder="Border Structure"
                value={formData.borderStructure}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="cartonPackingRatio"
                placeholder="Carton Packing Ratio"
                value={formData.cartonPackingRatio}
                onChange={handleChange}
                required
            />

            <hr />

            <h3>

                Printing Specification

            </h3>

            <input
                type="text"
                name="printMethod"
                placeholder="Print Method"
                value={formData.printingSpec.printMethod}
                onChange={handlePrintingChange}
                required
            />

            <input
                type="text"
                name="placementArea"
                placeholder="Placement Area"
                value={formData.printingSpec.placementArea}
                onChange={handlePrintingChange}
                required
            />

            <input
                type="number"
                name="colorCount"
                placeholder="Color Count"
                value={formData.printingSpec.colorCount}
                onChange={handlePrintingChange}
                required
            />

            <button

                type="submit"

                disabled={loading}

            >

                {

                    loading

                        ? "Saving..."

                        : "Save Component"

                }

            </button>

        </form>

    );

}