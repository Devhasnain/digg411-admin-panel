import { useCallback, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import PageMeta from "../components/common/PageMeta";
import Tile from "../components/common/Tile";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import IconButton from "../components/ui/iconButton/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../store/slices/authSlice";
import { useQuery } from "../hooks/useQuery";
import { endpoints } from "../config/api";
import {
  deleteNewsLetter,
  getNewsLetters,
  setNewsLetters,
} from "../store/slices/newsLettersSlice";
import { TrashBinIcon } from "../icons";
import toast from "react-hot-toast";
import { useDeleteRequest } from "../hooks/useDeleteRequest";

export default function NewsLetters() {
  const [globalFilter, setGlobalFilter] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const newsletters = useSelector(getNewsLetters);
  const { request, data, loading } = useQuery(
    endpoints.getNewsLetters,
    token ?? "",
    !newsletters.length
  );
  const deleteNewsLtrApi = useDeleteRequest();

  const renderHeader = () => {
    return (
      <div className="flex justify-end">
        <form>
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <MagnifyingGlassIcon height={18} width={18} />
            </span>
            <input
              //   ref={inputRef}
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search Newsletters"
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm font-normal text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
            />

            <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
              <span> ⌘ </span>
              <span> K </span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  const handleDelete = useCallback((id: string) => {
    if (!id) return;
    const deletePromise = toast.promise(
      deleteNewsLtrApi.request({
        path: `${endpoints.deleteNewsletter}?id=${id}`,
      }),
      {
        loading: "Deleting Newsletter...",
        success: "Newsletter deleted successfully!",
        error: "Failed to delete Newsletter.",
      }
    );

    deletePromise.then(() => {
      dispatch(deleteNewsLetter(id));
    });
  }, [newsletters]);

  useEffect(() => {
    if (data?.newsletters?.length) {
      dispatch(setNewsLetters(data?.newsletters));
    }
  }, [data?.newsletters]);

  return (
    <>
      <PageMeta title="Contact |" description="" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Newsletters
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
        </ol>
      </div>
      <Tile>
        <div className="w-full overflow-x-hidden">
          <DataTable
            value={newsletters}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            globalFilterFields={["name", "email", "phone", "message", ""]}
            header={renderHeader}
            emptyMessage="No newsletters found!"
            globalFilter={globalFilter}
          >
            <Column
              field="name"
              header={
                <span className="text-gray-500 text-sm font-normal">Name</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.name}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="email"
              header={
                <span className="text-gray-500 text-sm font-normal">Email</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.email}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="phone"
              header={
                <span className="text-gray-500 text-sm font-normal">Phone</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.phone}
                </span>
              )}
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="message"
              header={
                <span className="text-gray-500 text-sm font-normal">
                  Message
                </span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal !line-clamp-2">
                  {rowData?.message}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal !line-clamp-2">
                  <TrashBinIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleDelete(rowData?._id)}
                  />
                </span>
              )}
              style={{ minWidth: "2rem" }}
            />
          </DataTable>
        </div>
      </Tile>
    </>
  );
}
