import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router";
import "../icons.css";
import "../styles/sidebar.css";
export default function SidebarButton(props) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div style={{ position: "relative" }}>
      {props.notifications && props.notifications > 0 ? (
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: props.visibleLeft ? "60px" : "250px",
            display: "inline-block",
            padding: "0 4px",
            minWidth: "8px",
            maxWidth: "18px",
            height: "16px",
            borderRadius: "22px",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "400",
            lineHeight: "16px",
            backgroundColor: "#c00",
            color: "#fff",
            zIndex: 9999,
          }}
        >
          {props.notifications}
        </div>
      ) : (
        ""
      )}
      <Button
        icon={props.icon}
        onClick={() => navigate(props.path)}
        label={`${
          props.icon !== ""
            ? props.visibleLeft
              ? props.label
              : ""
            : props.label
        }`}
        style={{
          marginTop: "1rem",
          marginRight: "8px",
          marginLeft: "auto",
          display: "flex",
          width: `${props.visibleLeft ? "15rem" : ""}`,
          background: `${location.pathname === props.path ? "" : "#454545"}`,
          border: "#454545",
          padding: "2px",
          transition: "0.3s",
        }}
      />
    </div>
  );
}
