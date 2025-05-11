import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useNavigate } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  getToken,
  getUser,
  resetAuth,
  setUser,
} from "../store/slices/authSlice";
import { useCallback, useEffect } from "react";
import baseApi, { endpoints } from "../config/api";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const navigate = useNavigate();
  const user = useSelector(getUser);
  const token = useSelector(getToken);
  const dispatch = useDispatch();

  const authenticateUser = useCallback(async () => {
    try {
      const res = await baseApi.get(endpoints.lookup, {
        headers: { Authorization: token },
      });
      dispatch(setUser(res.data?.user));
    } catch (error) {
      navigate("/signin");
      dispatch(resetAuth());
    }
  }, [token, user]);

  useEffect(() => {
    if (!user) {
      if (token) {
        authenticateUser();
      } else {
        navigate("/signin");
      }
    }
  }, [user, token]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {user && <Outlet />}
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
