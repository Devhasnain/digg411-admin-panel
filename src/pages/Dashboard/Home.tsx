import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardAnalytics, setAnalytics } from "../../store/slices/dashboardSlice";
import { getToken } from "../../store/slices/authSlice";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { useEffect } from "react";

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
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics analytics={analytics} />

          <MonthlySalesChart />
        </div>
      </div>
    </>
  );
}
