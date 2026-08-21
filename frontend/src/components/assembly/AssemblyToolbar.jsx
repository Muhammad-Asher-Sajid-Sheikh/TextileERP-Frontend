import "./../../styles/assembly/toolbar.css";

const AssemblyToolbar = ({
  orders = [],
  selectedOrder = "",
  onOrderChange,
  onAddJobCard,
  onRefresh,
}) => {
  return (
    <div className="assembly-toolbar">

      <button
        className="assembly-add-btn"
        onClick={onAddJobCard}
        disabled={!selectedOrder}
      >
        + New Job Card
      </button>

      <div className="assembly-order-selector">
        <label>Production Order</label>

        <select
          value={selectedOrder}
          onChange={(e) => onOrderChange(e.target.value)}
        >
          <option value="">
            Select Production Order
          </option>

          {orders.map((order) => (
            <option
              key={order.orderTokenId}
              value={order.orderTokenId}
            >
              {order.designName}
              {order.seasonCode ? ` (${order.seasonCode})` : ""}
            </option>
          ))}
        </select>
      </div>

      <button
        className="assembly-refresh-btn"
        onClick={onRefresh}
      >
        Refresh
      </button>

    </div>
  );
};

export default AssemblyToolbar;