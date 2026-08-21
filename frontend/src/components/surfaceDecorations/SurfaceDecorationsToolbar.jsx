import { DECORATION_TYPES } from "../../constants/decorationPhases";
import "../../styles/surfaceDecorations/toolbar.css";

const SurfaceDecorationsToolbar = ({
    selectedProcess,
    onProcessChange,
    selectedOrder,
    onOrderChange,
    productionOrders = [],
    onAddNew,
    loading = false,
}) => {
    return (
        <div className="surface-toolbar">

            <div className="surface-toolbar-left">

                <button
                    className="surface-add-btn"
                    onClick={onAddNew}
                    disabled={!selectedOrder || loading}
                >
                    + Add New
                </button>

            </div>

            <div className="surface-toolbar-right">

                <div className="surface-toolbar-group">

                    <label>Decoration Process</label>

                    <select
                        value={selectedProcess}
                        onChange={(e) => onProcessChange(e.target.value)}
                    >
                        {DECORATION_TYPES.map((process) => (
                            <option
                                key={process.value}
                                value={process.value}
                            >
                                {process.label}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="surface-toolbar-group">

                    <label>Production Order</label>

                    <select
                        value={selectedOrder}
                        onChange={(e) => onOrderChange(e.target.value)}
                    >
                        <option value="">
                            Select Production Order
                        </option>
                        {console.log(productionOrders)}
                        {productionOrders.map((order) => (
                            <option
                                key={order.orderTokenId}
                                value={order.orderTokenId}
                            >
                                {order.designName}
                                {" "}
                                (V{order.version})
                            </option>
                        ))}
                    </select>

                </div>

            </div>

        </div>
    );
};

export default SurfaceDecorationsToolbar;