import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="container-fluid">
        <div className="row tophead mt-2 footer">
          <div className="col-md-6 col-xs-12 offset-md-3">
            <p
              style={{
                color: "white",
                fontWeight: "800",
                marginTop: "13px",
                font: "Mplus 1p",
                fontSize: "10px",
                marginLeft: "55px",
                lineHeight: "35px",
                letterSpacing: "0.2em",
              }}
            >
              Copyright All Right Reserved 2024, Abasyn University Management
              System (AUMS)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
