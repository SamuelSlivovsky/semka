import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router";
import "../icons.css";
import "../styles/sidebar.css";
export default function SidebarButton(props) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <Button
        icon={props.icon}
        onClick={() => navigate(props.path)}
        label={`${props.visibleLeft ? props.label : ""}`}
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
    </>
  );
}
