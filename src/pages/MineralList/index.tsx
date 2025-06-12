import { memo, useCallback, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  ArrowPathIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";
import { getToken } from "../../store/slices/authSlice";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import {
  getMineralsList,
  removeMineral,
  setMinerals,
} from "../../store/slices/mineralsSlice";
import { Button, IconButton, Modal, PageMeta, Tile } from "../../components";
import { TrashBinIcon } from "../../icons";
import { Link } from "react-router";
import { useModal } from "../../hooks/useModal";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";

export default function MineralList() {
  const [globalFilter, setGlobalFilter] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const mineralsList = useSelector(getMineralsList);
  const { request, data, loading } = useQuery(
    endpoints.getMinerals,
    token ?? "",
    !mineralsList.length
  );

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
              placeholder="Search or type command..."
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

  useEffect(() => {
    if (data?.minerals?.length) {
      dispatch(setMinerals(data?.minerals));
    }
  }, [data?.minerals]);

  return (
    <>
      <PageMeta title="Contact |" description="" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Mineral list
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
        {/* <div className="w-full overflow-x-auto"> */}
        <DataTable
          value={mineralsList ?? []}
          paginator
          rows={5}
          dataKey="id"
          loading={loading}
          globalFilterFields={["name", "email", "phone"]}
          header={renderHeader}
          emptyMessage="No contacts found!"
          globalFilter={globalFilter}
          className="!bg-transparent min-w-[1000px]"
          scrollable={true}
          rowsPerPageOptions={[5, 10, 20, 30, 40, 50, 100]}
          paginatorDropdownAppendTo={"self"}
        >
          <Column
            field="name"
            filter={true}
            headerClassName="!bg-transparent !py-3"
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
            field="emails"
            headerClassName="!bg-transparent !py-3"
            header={
              <span className="text-gray-500 text-sm font-normal">Email</span>
            }
            body={(rowData) => (
              <>
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.emails[0]}
                </span>
              </>
            )}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="numbers"
            header={
              <span className="text-gray-500 text-sm font-normal">Number</span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal">
                {rowData?.numbers[0] }
              </span>
            )}
            style={{ minWidth: "14rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            field="state"
            header={
              <span className="text-gray-500 text-sm font-normal">State</span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal">
                {rowData?.state?.name}
              </span>
            )}
            style={{ minWidth: "12rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            field="addresses"
            header={
              <span className="text-gray-500 text-sm font-normal !line-clamp-2">
                Address
              </span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal">
                {rowData?.addresses[0]}
              </span>
            )}
            style={{ minWidth: "8rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            body={(rowData) => (
              <div className="text-gray-500 text-sm font-normal flex flex-row items-center gap-2">
                <Link to={`/mineral/${rowData?._id}`}>
                  <EyeIcon className="h-4 w-4 cursor-pointer" />
                </Link>
                <Link to={`/edit-mineral/${rowData?._id}`}>
                  <PencilSquareIcon className="h-4 w-4 cursor-pointer" />
                </Link>
                {/* <TrashBinIcon
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleDelete(rowData?._id)}
                /> */}
                <DeleteConfirmation id={rowData?._id} />
              </div>
            )}
            style={{ minWidth: "4rem" }}
          />
        </DataTable>
        {/* </di/v> */}
      </Tile>
    </>
  );
}

const DeleteConfirmation = memo(({ id }: any) => {
  const dispatch = useDispatch();
  const { isOpen, closeModal, openModal } = useModal();
  const { request, loading } = useDeleteRequest(
    `${endpoints.deleteMineral}?id=${id}`
  );

  const handleDelete = useCallback(() => {
    if (!id) return;
    const deletePromise = toast.promise(request({}), {
      loading: "Deleting Mineral...",
      success: "Mineral deleted successfully!",
      error: "Failed to delete Mineral.",
    });

    deletePromise.then(() => {
      dispatch(removeMineral(id));
      closeModal();
    });
  }, [id]);

  return (
    <>
      <TrashBinIcon className="h-4 w-4 cursor-pointer" onClick={openModal} />
      <Modal onClose={closeModal} isOpen={isOpen} className="max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Confirm deletion
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Are you sure you want to delete this document?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              disabled={loading}
              loading={loading}
              type="submit"
              size="sm"
              onClick={handleDelete}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
});
