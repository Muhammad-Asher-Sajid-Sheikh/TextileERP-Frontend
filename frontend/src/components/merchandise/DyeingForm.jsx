import { useState } from "react";
import { toast } from "react-toastify";

import { upsertDyeingSpec } from "../../services/techPackApi";

import "../../styles/merchandise/dyeingForm.css";

export default function DyeingForm({

    techPack,

    onSuccess,

}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        dyeType:
            techPack?.dyeingSpec?.dyeType || "",

        colorName:
            techPack?.dyeingSpec?.colorName || "",

        pantoneCode:
            techPack?.dyeingSpec?.pantoneCode || "",

        chemicalRestraints:
            techPack?.dyeingSpec?.chemicalRestraints || "",

        targetShrinkagePct:
            techPack?.dyeingSpec?.targetShrinkagePct || "",

    });

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

            const payload = {

                ...formData,

                targetShrinkagePct: Number(formData.targetShrinkagePct),

            };

            const response = await upsertDyeingSpec(

                techPack.id,

                payload

            );

            toast.success(

                response?.data?.message ||

                "Dyeing specification saved successfully."

            );

            if (onSuccess) {

                onSuccess();

            }

        }

        catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to save dyeing specification."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <form

            className="dyeing-form"

            onSubmit={handleSubmit}

        >

            <h2>

                {

                    techPack?.dyeingSpec

                        ? "Update Dyeing Specification"

                        : "Add Dyeing Specification"

                }

            </h2>

            <input

                type="text"

                name="dyeType"

                placeholder="Dye Type"

                value={formData.dyeType}

                onChange={handleChange}

                required

            />

            <input

                type="text"

                name="colorName"

                placeholder="Color Name"

                value={formData.colorName}

                onChange={handleChange}

                required

            />

            <input

                type="text"

                name="pantoneCode"

                placeholder="Pantone Code"

                value={formData.pantoneCode}

                onChange={handleChange}

                required

            />

            <textarea

                name="chemicalRestraints"

                placeholder="Chemical Restraints"

                value={formData.chemicalRestraints}

                onChange={handleChange}

                rows={4}

                required

            />

            <input

                type="number"

                step="0.1"

                name="targetShrinkagePct"

                placeholder="Target Shrinkage (%)"

                value={formData.targetShrinkagePct}

                onChange={handleChange}

                required

            />

            <button

                type="submit"

                disabled={loading}

            >

                {

                    loading

                        ? "Saving..."

                        : techPack?.dyeingSpec

                            ? "Update Dyeing"

                            : "Save Dyeing"

                }

            </button>

        </form>

    );

}