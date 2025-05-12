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
import baseApi, { endpoints, UserTypes } from "../config/api";
import toast from "react-hot-toast";

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
      if(res.data?.user?.role !== UserTypes.admin){
        throw new Error("You don't have permissions to access admin panel.")
      }
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
    }else if(user && user.role !== UserTypes.admin){
      navigate("/signin");
      dispatch(resetAuth());
      toast.error("You don't have permissions to access admin panel.")
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
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 overflow-x-hidden">
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
