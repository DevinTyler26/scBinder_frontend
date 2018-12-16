import React from "react";
import loadingGif from "../../assets/allegroLogoLoadingSmall.gif";

const Loading = () => {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-50px",
    marginLeft: "-50px",
    maxWidth: "60px"
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <img src={loadingGif} alt="Loading" style={style} />
    </div>
  );
};

export default Loading;
