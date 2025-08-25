import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contextApi/AuthContext";
import PageHeader from "../components/PageHeader";
import AdvertiserHeader from "../components/AdvertiserHeader";

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
      <AdminHeader user={user} />
      <AdminSidebar />
      <main className="nxl-container">
        <div className="nxl-content without-header nxl-full-content">
                    <div className='main-content'>
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default ApplicationLayout;
