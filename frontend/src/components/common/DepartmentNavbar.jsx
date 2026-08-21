import { NavLink } from "react-router-dom";
import "./departmentNavbar.css";

const DepartmentNavbar = ({
    title,
    links = [],
}) => {
    return (
        <div className="department-navbar">

            <div className="department-navbar-title">
                <h2>{title}</h2>
            </div>

            <div className="department-navbar-links">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            isActive
                                ? "department-nav-btn active"
                                : "department-nav-btn"
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>

        </div>
    );
};

export default DepartmentNavbar;