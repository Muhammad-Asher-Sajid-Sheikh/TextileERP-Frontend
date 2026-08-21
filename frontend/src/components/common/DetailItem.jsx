import "./../../styles/common/detailItem.css";

export default function DetailItem({

    label,

    value,

}) {

    return (

        <div className="detail-item">

            <div className="detail-label">

                {label}

            </div>

            <div className="detail-value">

                {

                    value !== null &&
                    value !== undefined &&
                    value !== ""

                        ? value

                        : "-"

                }

            </div>

        </div>

    );

}