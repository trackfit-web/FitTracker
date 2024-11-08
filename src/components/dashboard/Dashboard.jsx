import React, { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import SideNavUser from "../side-nav/SideNavUser";
import { doSignOut } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import Header from "../header";

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Redirect to '/home/bmi-calculator' if user is on '/home'
  useEffect(() => {
    if (location.pathname === "/home") {
      navigate("/home/bmi-calculator", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <SideNavUser />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
