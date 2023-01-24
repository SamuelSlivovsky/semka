import { useEffect } from "react";
import { useNavigate } from "react-router";
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("user");
    const headers = { authorization: "Bearer " + token };
    fetch("/auth/logout", { headers });
    localStorage.removeItem("user");
    navigate("/login");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
