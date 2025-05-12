import React, { useCallback, useEffect } from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import Logo from "../../components/brand/Logo";
import { useDispatch, useSelector } from "react-redux";
import {
  getToken,
  getUser,
  resetAuth,
  setUser,
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router";
import baseApi, { endpoints, UserTypes } from "../../config/api";
import toast from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const token = useSelector(getToken);
  const dispatch = useDispatch();

  const authenticateUser = useCallback(async () => {
    try {
      const res = await baseApi.get(endpoints.lookup, {
        headers: { Authorization: token },
      });
      if (res.data?.user?.role !== UserTypes.admin) {
        toast.error("You don't have permissions to access admin panel.");
        navigate("/signin");
        dispatch(resetAuth());
        return;
      }
      dispatch(setUser(res.data?.user));
      navigate("/");
    } catch (error) {
      dispatch(resetAuth());
    }
  }, [token, user]);

  useEffect(() => {
    if (user) {
      navigate("/");
    } else if (token) {
      authenticateUser();
    }
  }, [user, token]);

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <span className="block mb-4">
                <Logo />
              </span>
              <p className="text-center text-gray-400 dark:text-white/60">
                Connecting You Directly with Mineral Rights Owners, Simplifying
                Outreach, and Unlocking Opportunities in Oil, Gas, and Energy
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
