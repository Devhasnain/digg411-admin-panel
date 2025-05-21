import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Tile from "../../components/common/Tile";
import IconButton from "../../components/ui/iconButton/IconButton";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/button/Button";

const data = [
  {
    id: 1000,
    name: "James Butt",
    email: "example@gmail.com",
    phone: "03470047605",
    message: "hello",
  },
  {
    id: 1001,
    name: "Hasnin",
    email: "example@gmail.com",
    phone: "03470047605",
    message: "hello",
  },
];

interface Representative {
  name: string;
  image: string;
}

interface Country {
  name: string;
  code: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function MineralList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [representatives] = useState<Representative[]>([
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ]);
  const [statuses] = useState<string[]>([
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ]);

  const getSeverity = (status: string) => {
    switch (status) {
      case "unqualified":
        return "danger";

      case "qualified":
        return "success";

      case "new":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;
    }
  };

  useEffect(() => {
    // CustomerService.getCustomersMedium().then((data: Customer[]) => {
    setCustomers(getCustomers(data));
    setLoading(false);
    // });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCustomers = (data: Customer[]) => {
    return [...(data || [])].map((d) => {
      // @ts-ignore
      d.date = new Date(d.date);

      return d;
    });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-end">
        <form>
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              //   ref={inputRef}
              type="text"
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

  //   const countryBodyTemplate = (rowData: Customer) => {
  //     return (
  //       <div className="flex align-items-center gap-2">
  //         <img
  //           alt="flag"
  //           src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
  //           className={`flag flag-${rowData.country.code}`}
  //           style={{ width: "24px" }}
  //         />
  //         <span>{rowData.country.name}</span>
  //       </div>
  //     );
  //   };

  //   const representativeBodyTemplate = (rowData: Customer) => {
  //     const representative = rowData.representative;

  //     return (
  //       <div className="flex align-items-center gap-2">
  //         <img
  //           alt={representative.name}
  //           src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
  //           width="32"
  //         />
  //         <span>{representative.name}</span>
  //       </div>
  //     );
  //   };

  const representativesItemTemplate = (option: Representative) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          width="32"
        />
        <span>{option.name}</span>
      </div>
    );
  };

  // const statusBodyTemplate = (rowData: Customer) => {
  //   return (
  //     <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  //   );
  // };

  const statusItemTemplate = (option: string) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  //   const verifiedBodyTemplate = (rowData: Customer) => {
  //     return (
  //       <i
  //         className={classNames("pi", {
  //           "true-icon pi-check-circle": rowData.verified,
  //           "false-icon pi-times-circle": !rowData.verified,
  //         })}
  //       ></i>
  //     );
  //   };

  const representativeRowFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e: MultiSelectChangeEvent) =>
          options.filterApplyCallback(e.value)
        }
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: "14rem" }}
      />
    );
  };

  const statusRowFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e: DropdownChangeEvent) =>
          options.filterApplyCallback(e.value)
        }
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const verifiedRowFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e: TriStateCheckboxChangeEvent) =>
          options.filterApplyCallback(e.value)
        }
      />
    );
  };

  const header = renderHeader();

  return (
    <>
      <PageMeta title="Mineral List |" description="" />
      <PageBreadcrumb pageTitle="Mineral List" />
      <Tile>
        <div className="w-full overflow-x-hidden">
          <DataTable
            value={customers}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            globalFilterFields={["name", "email", "phone", "message"]}
            header={header}
            emptyMessage="No customers found."
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
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.message}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
          </DataTable>
        </div>
      </Tile>
    </>
  );
}
