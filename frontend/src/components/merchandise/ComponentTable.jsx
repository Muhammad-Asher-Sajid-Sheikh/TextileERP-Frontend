import { toast } from "react-toastify";

import {
    deleteComponent,
} from "../../services/techPackApi";

import "../../styles/merchandise/componentTable.css";

export default function ComponentTable({

    loading,

    techPack,

    refresh,

    onView,

}) {

    /**
     * Delete Component
     */

    const handleDelete = async (componentId, componentName) => {

        const confirmed = window.confirm(

            `Are you sure you want to delete "${componentName}"?`

        );

        if (!confirmed) return;

        try {

            const response = await deleteComponent(componentId);

            toast.success(

                response?.data?.message ||

                "Component deleted successfully."

            );

            refresh();

        }

        catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to delete component."

            );

        }

    };

    /**
     * Nothing selected
     */

    if (!techPack) {

        return (

            <div className="component-message">

                Select an instruction to view its components.

            </div>

        );

    }

    /**
     * Loading
     */

    if (loading) {

        return (

            <div className="component-message">

                Loading Components...

            </div>

        );

    }

    /**
     * Empty
     */

    if (!techPack.components || techPack.components.length === 0) {

        return (

            <div className="component-message">

                No components added yet.

            </div>

        );

    }

    return (

        <table className="component-table">

            <thead>

                <tr>

                    <th>Component</th>

                    <th>Target GSM</th>

                    <th>Piece Weight</th>

                    <th>Print Method</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    techPack.components.map((component) => (

                        <tr key={component.id}>

                            <td>

                                {component.componentName}

                            </td>

                            <td>

                                {component.targetGsm}

                            </td>

                            <td>

                                {component.targetPieceWeightGm} gm

                            </td>

                            <td>

                                {

                                    component.printingSpec

                                        ?.printMethod ||

                                    "-"

                                }

                            </td>

                            <td>

                                <button

                                    className="view-component-btn"

                                    onClick={() => onView(component)}

                                >

                                    View

                                </button>

                                <button

                                    className="delete-component-btn"

                                    disabled={techPack.isLocked}

                                    onClick={() =>

                                        handleDelete(

                                            component.id,

                                            component.componentName

                                        )

                                    }

                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}