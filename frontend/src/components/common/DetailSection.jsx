import "./../../styles/common/detailSection.css";

export default function DetailSection({

    title,

    children,

}) {

    return (

        <section className="detail-section">

            <h3 className="detail-section-title">

                {title}

            </h3>

            <div className="detail-section-body">

                {children}

            </div>

        </section>

    );

}