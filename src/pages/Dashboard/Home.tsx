import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getDashboardAnalytics, setAnalytics } from "../../store/slices/dashboardSlice";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import { getToken } from "../../store/slices/authSlice";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { RefreshIcon } from "../../icons";


export default function Home() {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const analytics = useSelector(getDashboardAnalytics);
  const {data, loading} = useQuery(endpoints.getAnalytics,token??"",true);
  
  useEffect(()=>{
    if(data){
      dispatch(setAnalytics(data));
    }
  },[data])


  return (
    <>
      <PageMeta
        title="Petro411"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6 relative">
       {loading && <div className="w-full h-full backdrop-blur-sm z-10 absolute top-0 left-0 flex flex-col items-center justify-center gap-2">
        <RefreshIcon className="animate-spin"/>
        <span>loading...</span>
        </div>}
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics analytics={analytics} />

          <MonthlySalesChart />
        </div>
      </div>
    </>
  );
}
