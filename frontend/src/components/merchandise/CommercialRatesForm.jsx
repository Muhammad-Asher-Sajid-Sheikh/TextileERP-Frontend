import { useState } from "react";
import { toast } from "react-toastify";

import { lockCommercialRates } from "../../services/techPackApi";

import "../../styles/merchandise/commercialRatesForm.css";

export default function CommercialRatesForm({

    techPack,

    onSuccess,

}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        currencyCode: "USD",

        yarnProcurementRate: "",

        brokerCommissionRate: "",

        paymentTerms: "",

        weavingKnittingRate: "",

        dyeingFinishingRatePerKg: "",

        printingPieceRate: "",

        embroideryPieceRate: "",

        cuttingPieceRate: "",

        stitchingPieceRate: "",

        foldingPieceRate: "",

        lockedBy: "",

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

                techPackId: techPack.id,

                orderTokenId: techPack.orderTokenId,

                currencyCode: formData.currencyCode,

                paymentTerms: formData.paymentTerms,

                lockedBy: formData.lockedBy,

                yarnProcurementRate: Number(formData.yarnProcurementRate),

                brokerCommissionRate: Number(formData.brokerCommissionRate),

                weavingKnittingRate: Number(formData.weavingKnittingRate),

                dyeingFinishingRatePerKg: Number(formData.dyeingFinishingRatePerKg),

                printingPieceRate: Number(formData.printingPieceRate),

                embroideryPieceRate: Number(formData.embroideryPieceRate),

                cuttingPieceRate: Number(formData.cuttingPieceRate),

                stitchingPieceRate: Number(formData.stitchingPieceRate),

                foldingPieceRate: Number(formData.foldingPieceRate),

            };

            const response = await lockCommercialRates(payload);

            toast.success(

                response?.data?.message ||

                "Commercial rates locked successfully."

            );

            if (onSuccess) {

                onSuccess();

            }

        }

        catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to lock commercial rates."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <form

            className="commercial-form"

            onSubmit={handleSubmit}

        >

            <h2>

                Lock Commercial Rates

            </h2>

            <div className="commercial-grid">

                <input
                    name="currencyCode"
                    placeholder="Currency Code"
                    value={formData.currencyCode}
                    onChange={handleChange}
                    required
                />

                <input
                    name="paymentTerms"
                    placeholder="Payment Terms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="yarnProcurementRate"
                    placeholder="Yarn Procurement Rate"
                    value={formData.yarnProcurementRate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="brokerCommissionRate"
                    placeholder="Broker Commission Rate"
                    value={formData.brokerCommissionRate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="weavingKnittingRate"
                    placeholder="Weaving / Knitting Rate"
                    value={formData.weavingKnittingRate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="dyeingFinishingRatePerKg"
                    placeholder="Dyeing / Finishing Rate"
                    value={formData.dyeingFinishingRatePerKg}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="printingPieceRate"
                    placeholder="Printing Piece Rate"
                    value={formData.printingPieceRate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="embroideryPieceRate"
                    placeholder="Embroidery Piece Rate"
                    value={formData.embroideryPieceRate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="cuttingPieceRate"
                    placeholder="Cutting Piece Rate"
                    value={formData.cuttingPieceRate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="stitchingPieceRate"
                    placeholder="Stitching Piece Rate"
                    value={formData.stitchingPieceRate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="foldingPieceRate"
                    placeholder="Folding Piece Rate"
                    value={formData.foldingPieceRate}
                    onChange={handleChange}
                    required
                />

                <input
                    name="lockedBy"
                    placeholder="Locked By"
                    value={formData.lockedBy}
                    onChange={handleChange}
                    required
                />

            </div>

            <button
                type="submit"
                disabled={loading}
            >

                {

                    loading

                        ? "Locking..."

                        : "Lock Commercial Rates"

                }

            </button>

        </form>

    );

}