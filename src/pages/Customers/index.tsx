import { ArrowDownTrayIcon, EyeIcon } from "@heroicons/react/24/outline";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import toast from "react-hot-toast";
import { Link } from "react-router";

import { getCustomers, removeCustomers, setCustomers, } from "../../store/slices/customersSlice";
import { DownloadUserInvoice, formatToDMY } from "../../utils/DateFormate";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { Button, Modal, PageMeta } from "../../components";
import { getToken } from "../../store/slices/authSlice";
import baseApi, { endpoints } from "../../config/api";
import { useModal } from "../../hooks/useModal";
import { TrashBinIcon } from "../../icons";


const Customers = () => {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const customers = useSelector(getCustomers);
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await baseApi.get(
        `${endpoints.getCustomers}?page=${page}&limit=${rows}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      dispatch(setCustomers(res.data?.users || []));
      setTotal(res.data?.total || 0);
    } catch (error) {
      toast.error("Failed to load minerals");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  }, [page, rows, token]);

  useEffect(() => {
    fetchCustomers();
  }, [page, rows, fetchCustomers]);

  return (
    <>
      <PageMeta title="Customers |" description="" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Customers
        </h2>
      </div>
      <div className="rounded-2xl min-w-[800px] max-w-[1050px] overflow-x-auto border border-gray-200 bg-white p-5">
        <DataTable
          value={customers}
          size="normal"
          className="!w-full"
          paginator
          rows={rows}
          totalRecords={total}
          first={(page - 1) * rows}
          lazy
          loading={loading}
          onPage={(e) => {
            setPage((e.page ?? 0) + 1); // default page = 0
            setRows(e.rows ?? rows); // keep old rows if undefined
          }}
          rowsPerPageOptions={[10, 20, 40, 100]}
          globalFilterFields={[
            "name",
            "email",
            "role",
            "customer_id",
            "subscription",
            "createdAt",
            "actions",
          ]}
          emptyMessage="No results found!"
          scrollable={true}
          scrollHeight="65vh"
          paginatorDropdownAppendTo={"self"}
        >
          <Column
            field="name"
            filter={true}
            headerClassName="!bg-transparent !py-3"
            header={
              <span className="text-gray-500 text-sm font-normal">Name</span>
            }
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="email"
            filter={true}
            headerClassName="!bg-transparent !py-3"
            header={
              <span className="text-gray-500 text-sm font-normal">Email</span>
            }
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="role"
            filter={true}
            header={
              <span className="text-gray-500 text-sm font-normal">Role</span>
            }
            style={{ minWidth: "7rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            field="customer_id"
            filter={true}
            header={
              <span className="text-gray-500 text-sm font-normal">
                Customer
              </span>
            }
            style={{ minWidth: "12rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            field="subscription"
            filter={true}
            header={
              <span className="text-gray-500 text-sm font-normal">
                Subscription
              </span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal">
                {rowData?.subscription?.amount ? "$" : "-"}
                {rowData?.subscription?.amount
                  ? (rowData?.subscription?.amount / 100).toFixed(2)
                  : ""}
              </span>
            )}
            style={{ minWidth: "10rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            field="createdAt"
            filter={true}
            header={
              <span className="text-gray-500 text-sm font-normal !line-clamp-2">
                Created at
              </span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal line-clamp-2">
                {formatToDMY(rowData?.createdAt)}
              </span>
            )}
            style={{ minWidth: "12rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            body={(rowData) => (
              <div className="text-gray-500 text-sm font-normal flex flex-row items-center gap-3">
                <DownloadInvoice data={rowData} />
                <Link to={`/user/${rowData?._id}`}>
                  <EyeIcon className="h-5 w-5 cursor-pointer" />
                </Link>
                <DeleteConfirmation id={rowData?._id} />
              </div>
            )}
            style={{ minWidth: "4rem" }}
          />
        </DataTable>
      </div>
    </>
  );
};

const DeleteConfirmation = memo(({ id }: any) => {
  const dispatch = useDispatch();
  const { isOpen, closeModal, openModal } = useModal();
  const token = useSelector(getToken);

  const handleDelete = useCallback(async () => {
    closeModal();
    const promise = toast.promise(
      baseApi.delete(`${endpoints.deleteUser}?id=${id}`, {
        headers: { Authorization: token },
      }),
      {
        loading: "Deleting user...",
      }
    );
    promise.then(() => {
      dispatch(removeCustomers(id));
      toast.dismiss();
      toast.success("User deleted successfully");
    });
    promise.catch((error) => {
      toast.dismiss();
      toast.error(GetApiErrorMessage(error));
    });
  }, [id, dispatch]);

  return (
    <>
      <TrashBinIcon className="h-5 w-5 cursor-pointer" onClick={openModal} />
      <Modal onClose={closeModal} isOpen={isOpen} className="max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Confirm deletion
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Are you sure you want to delete this user?
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
              // disabled={loading}
              // loading={loading}
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

const DownloadInvoice = memo(({ data }: any) => {
  const handleDownloadInvoice = useCallback(() => {
    DownloadUserInvoice({
      email: data?.email,
      name: data?.name,
      monthlyDownloadLimit: data?.subscription?.monthlyDownloadLimit,
      totalDownloads: data?.subscription?.totalDownloads,
      start_date: formatToDMY(data?.subscription?.start_date),
      expires_at: formatToDMY(data?.subscription?.expires_at),
      amount: (data?.subscription?.amount || 0 / 100).toFixed(2),
      downloads_list: data?.subscription?.downloads_list || [],
    });
  }, [data]);

  return (
    <>
      <ArrowDownTrayIcon
        onClick={handleDownloadInvoice}
        className="h-5 w-5 cursor-pointer"
      />
    </>
  );
});

export default Customers;
