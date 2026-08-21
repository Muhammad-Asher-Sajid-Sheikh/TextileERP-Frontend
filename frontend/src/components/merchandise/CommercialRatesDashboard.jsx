import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "./Modal";
import CommercialRatesForm from "./CommercialRatesForm";

import {
    getAllTechPacks,
    getTechPack,
    getCommercialRates,
} from "../../services/techPackApi";

import "../../styles/merchandise/commercialRatesDashboard.css";

export default function CommercialRatesDashboard() {

    const [techPacks, setTechPacks] = useState([]);

    const [selectedTechPackId, setSelectedTechPackId] = useState("");

    const [selectedTechPack, setSelectedTechPack] = useState(null);

    const [commercialRates, setCommercialRates] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const fetchTechPacks = async () => {

        try {

            const data = await getAllTechPacks();

            setTechPacks(data);

        }

        catch (error) {

            console.error(error);

            toast.error("Unable to load instructions.");

        }

    };

    const fetchSelectedTechPack = async (id) => {

        if (!id) {

            setSelectedTechPack(null);

            setCommercialRates(null);

            return;

        }

        setLoading(true);

        try {

            const response = await getTechPack(id);

            const techPack = response?.data?.data;

            setSelectedTechPack(techPack);

            if (techPack.isLocked) {

                try {

                    const rateResponse = await getCommercialRates(id);

                    setCommercialRates(rateResponse?.data?.data);

                }

                catch {

                    setCommercialRates(null);

                }

            }

            else {

                setCommercialRates(null);

            }

        }

        catch (error) {

            console.error(error);

            toast.error("Unable to load instruction.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchTechPacks();

    }, []);

    useEffect(() => {

        if (selectedTechPackId) {

            fetchSelectedTechPack(selectedTechPackId);

        }

    }, [selectedTechPackId]);

    const handleSuccess = async () => {

        setShowModal(false);

        fetchSelectedTechPack(selectedTechPackId);

    };

    return (

        <div className="commercial-dashboard">

            <div className="commercial-header">

                <h2>

                    Commercial Rates

                </h2>

                <div className="commercial-actions">

                    <select

                        value={selectedTechPackId}

                        onChange={(e) =>
                            setSelectedTechPackId(e.target.value)
                        }

                    >

                        <option value="">

                            Select Instruction

                        </option>

                        {

                            techPacks.map((techPack) => (

                                <option

                                    key={techPack.id}

                                    value={techPack.id}

                                >

                                    {techPack.designName}
                                    {" • "}
                                    Season {techPack.seasonCode}
                                    {" • "}
                                    Qty {techPack.totalTargetQuantity}
                                    {" • "}
                                    V{techPack.version}

                                </option>

                            ))

                        }

                    </select>

                    <button

                        className="commercial-btn"

                        disabled={
                            !selectedTechPack ||
                            !selectedTechPack.isLocked ||
                            commercialRates
                        }

                        onClick={() => setShowModal(true)}

                    >

                        Lock Commercial Rates

                    </button>

                </div>

            </div>

            {

                !selectedTechPack && (

                    <div className="commercial-empty">

                        Select an instruction.

                    </div>

                )

            }

            {

                selectedTechPack &&
                !selectedTechPack.isLocked && (

                    <div className="commercial-warning">

                        This instruction is still a Draft.

                        Release the instruction before locking commercial rates.

                    </div>

                )

            }

            {

                selectedTechPack &&
                selectedTechPack.isLocked &&
                !commercialRates &&
                !loading && (

                    <div className="commercial-empty">

                        No commercial rates have been locked.

                    </div>

                )

            }

            {

                commercialRates && (

                    <div className="commercial-card">

                        <div className="commercial-row">

                            <span>Currency</span>

                            <strong>{commercialRates.currencyCode}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Yarn Procurement</span>

                            <strong>{commercialRates.yarnProcurementRate}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Broker Commission</span>

                            <strong>{commercialRates.brokerCommissionRate}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Payment Terms</span>

                            <strong>{commercialRates.paymentTerms}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Weaving Rate</span>

                            <strong>{commercialRates.weavingKnittingRate}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Dyeing Rate / Kg</span>

                            <strong>{commercialRates.dyeingFinishingRatePerKg}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Printing Rate</span>

                            <strong>{commercialRates.printingPieceRate}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Embroidery Rate</span>

                            <strong>{commercialRates.embroideryPieceRate}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Cutting Rate</span>

                            <strong>{commercialRates.cuttingPieceRate}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Stitching Rate</span>

                            <strong>{commercialRates.stitchingPieceRate}</strong>

                        </div>

                        <div className="commercial-row">

                            <span>Folding Rate</span>

                            <strong>{commercialRates.foldingPieceRate}</strong>

                        </div>

                    </div>

                )

            }

            {

                showModal && (

                    <Modal onClose={() => setShowModal(false)}>

                        <CommercialRatesForm

                            techPack={selectedTechPack}

                            onSuccess={handleSuccess}

                        />

                    </Modal>

                )

            }

        </div>

    );

}