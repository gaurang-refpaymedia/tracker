import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contextApi/AuthContext";

const ApplicationLayout = () => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }
  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <Outlet />
    </>
  );
};

export default ApplicationLayout;
