import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import toast from "react-hot-toast";

import { getCustomers, setCustomers } from "../../store/slices/customersSlice";
import { getToken } from "../../store/slices/authSlice";
import baseApi, { endpoints } from "../../config/api";
import { formatToDMY } from "../../utils/DateFormate";
import { PageMeta, Tile } from "../../components";


const Customers = () => {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const customers = useSelector(getCustomers);
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [loading,setLoading] = useState(false)
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
      <Tile className="lg:!p-0 w-[500px] overflow-x-auto">
        <DataTable
          value={customers}
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
            'customer_id',
            "subscription",
            "createdAt",
          ]}
          emptyMessage="No results found!"
          scrollable={true}
          scrollHeight="65vh" // 👈 makes table body scrollable
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
            style={{ minWidth: "14rem" }}
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
            style={{ minWidth: "12rem" }}
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
        </DataTable>
        {/* </di/v> */}
      </Tile>
    </>
  );
};

export default Customers;
