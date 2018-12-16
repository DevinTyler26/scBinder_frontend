import React from "react";
import { NavLink, Link } from "react-router-dom";
import allegroBtn from "../assets/allegroLogoBlack.png";

const NavBar = ({ user }) => {
  return (
    <div className="outter-nav">
      <nav className="navbar navbar-expand-lg navbar-light bg-light ">
        <Link className="navbar-brand" to="/#">
          <img style={{ maxWidth: 200 }} src={allegroBtn} alt="Allegro Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            {user && (
              <React.Fragment>
                <NavLink className="nav-link" to="/providers">
                  Providers
                </NavLink>
                {/* <NavLink  className="nav-link" to="/profile">
                    {user.name}
                  </NavLink> */}
                <NavLink className="nav-item nav-link" to="/logout">
                  Logout
                </NavLink>
              </React.Fragment>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
