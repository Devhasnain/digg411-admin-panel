import { Divider } from "primereact/divider";
import { IconButton, PageMeta } from "../../components";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { useCallback, useEffect } from "react";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { deletePlan, getPlans, setPlans } from "../../store/slices/planSlice";
import toast from "react-hot-toast";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";

const Plans = () => {
    const deleteApi = useDeleteRequest();
  const plans = useSelector(getPlans);
  const dispatch = useDispatch();
  const { request, data, loading } = useQuery(
    endpoints.getPlans,
    null,
    !plans.length
  );
  const handleDeletePlan = useCallback((id: string) => {
    const promise = toast.promise(
        deleteApi.request({
            path:`${endpoints.deletePlan}?id=${id}`,
        }),
        {
            loading:"Deleting plan...",
            success:"Plan deleted successfully",
            error:"Something went wrong"
        }
    );
    promise.then(()=>{
        dispatch(deletePlan(id))
    })
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setPlans(data?.plans));
    }
  }, [data]);

  return (
    <>
      <PageMeta title="Plans |" description="" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Plans
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <IconButton onClick={request} loading={loading}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <Link
              className="bg-brand-500 py-3 px-3 rounded-lg text-white hover:bg-brand-600"
              to={"/plans/create"}
            >
              Add new
            </Link>
          </li>
        </ol>
      </div>
      <div className="grid grid-cols-3 w-full gap-8">
        {plans?.length
          ? plans?.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl shadow hover:shadow-md bg-white dark:bg-gray-dark dark:border-gray-dark p-5 dark:text-white group relative"
              >
                <div className="flex flex-row items-center gap-1 justify-end opacity-0 group-hover:opacity-100 !z-0 group-hover:!z-1 absolute top-3 right-3">
                  <TrashBinIcon
                    className="cursor-pointer"
                    onClick={() => handleDeletePlan(item?._id)}
                    height={20}
                    width={20}
                  />
                  <Link to={`/plans/${item?._id}`}>
                    <PencilIcon height={22} width={22} />
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="font-medium text-lg">{item?.title}</h1>
                  <h2 className="font-medium text-3xl">${item?.amount}</h2>
                  <h3 className="font-medium text-md">{item?.subtitle}</h3>
                </div>
                <h3 className="font-medium text-md mt-3 text-gray-500">
                  Features
                </h3>

                <Divider className="!my-2 !dark:border-gray-dark" />

                <div className="flex flex-col mb-2">
                  {item?.features?.map((feat: string, id: number) => (
                    <span className="text-gray-500" key={id}>
                      {feat}
                    </span>
                  ))}
                </div>

                <p className="text-gray-500">{item?.description}</p>
              </div>
            ))
          : ""}
      </div>
    </>
  );
};

export default Plans;
