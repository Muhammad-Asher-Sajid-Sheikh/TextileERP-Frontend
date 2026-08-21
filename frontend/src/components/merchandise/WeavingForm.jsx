import { useState } from "react";
import { toast } from "react-toastify";

import { upsertWeavingSpec } from "../../services/techPackApi";

import "../../styles/merchandise/weavingForm.css";

export default function WeavingForm({

    techPack,

    onSuccess,

}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        loomType:
            techPack?.weavingSpec?.loomType || "",

        warpYarnCount:
            techPack?.weavingSpec?.warpYarnCount || "",

        weftYarnCount:
            techPack?.weavingSpec?.weftYarnCount || "",

        pileYarnCount:
            techPack?.weavingSpec?.pileYarnCount || "",

        picksPerInch:
            techPack?.weavingSpec?.picksPerInch || "",

        endsPerInch:
            techPack?.weavingSpec?.endsPerInch || "",

        terryRatio:
            techPack?.weavingSpec?.terryRatio || "",

        technicalNotes:
            techPack?.weavingSpec?.technicalNotes || "",

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

                picksPerInch: Number(formData.picksPerInch),

                endsPerInch: Number(formData.endsPerInch),

                terryRatio: Number(formData.terryRatio),

            };

            const response = await upsertWeavingSpec(

                techPack.id,

                payload

            );

            toast.success(

                response?.data?.message ||

                "Weaving specification saved successfully."

            );

            if (onSuccess) {

                onSuccess();

            }

        }

        catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to save weaving specification."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <form

            className="weaving-form"

            onSubmit={handleSubmit}

        >

            <h2>

                {

                    techPack?.weavingSpec

                        ? "Update Weaving Specification"

                        : "Add Weaving Specification"

                }

            </h2>

            <input

                type="text"

                name="loomType"

                placeholder="Loom Type"

                value={formData.loomType}

                onChange={handleChange}

                required

            />

            <input

                type="text"

                name="warpYarnCount"

                placeholder="Warp Yarn Count"

                value={formData.warpYarnCount}

                onChange={handleChange}

                required

            />

            <input

                type="text"

                name="weftYarnCount"

                placeholder="Weft Yarn Count"

                value={formData.weftYarnCount}

                onChange={handleChange}

                required

            />

            <input

                type="text"

                name="pileYarnCount"

                placeholder="Pile Yarn Count"

                value={formData.pileYarnCount}

                onChange={handleChange}

                required

            />

            <input

                type="number"

                name="picksPerInch"

                placeholder="Picks Per Inch"

                value={formData.picksPerInch}

                onChange={handleChange}

                required

            />

            <input

                type="number"

                name="endsPerInch"

                placeholder="Ends Per Inch"

                value={formData.endsPerInch}

                onChange={handleChange}

                required

            />

            <input

                type="number"

                step="0.1"

                name="terryRatio"

                placeholder="Terry Ratio"

                value={formData.terryRatio}

                onChange={handleChange}

                required

            />

            <textarea

                name="technicalNotes"

                placeholder="Technical Notes"

                value={formData.technicalNotes}

                onChange={handleChange}

                rows={5}

                required

            />

            <button

                type="submit"

                disabled={loading}

            >

                {

                    loading

                        ? "Saving..."

                        : techPack?.weavingSpec

                            ? "Update Weaving"

                            : "Save Weaving"

                }

            </button>

        </form>

    );

}