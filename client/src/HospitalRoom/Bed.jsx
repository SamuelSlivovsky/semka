import React from "react";
function Bed(props) {
  const taken = "#ff606d";
  const free = "#94fb90";
  return (
    <div
      id={`bed${props.bedNumber}`}
      style={{
        width: "150px",
        height: "300px",
        margin: "1em",
        cursor: "pointer",
        backgroundColor: "#e4e6e4",
        borderRadius: "5px",
        border: "1px solid black",
        marginBottom: "20px",
      }}
      onClick={props.onClick}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "60px",
            backgroundColor: props.taken ? taken : free,
            margin: "10px",
            border: "1px solid gray",
            borderRadius: "5px",
          }}
        ></div>
        <div
          style={{
            width: "130px",
            height: "210px",
            backgroundColor: props.taken ? taken : free,
            border: " 1px solid gray",
            borderRadius: "5px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Bed;
