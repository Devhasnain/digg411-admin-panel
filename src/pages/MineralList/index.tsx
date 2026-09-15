import { ArrowPathIcon, MagnifyingGlassIcon, } from "@heroicons/react/24/outline";
import { ChangeEvent, memo, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MultiSelect } from "primereact/multiselect";
import toast from "react-hot-toast";

import { Button, IconButton, Label, InputField as Input, AgGridTable, DeleteConfirmation, } from "../../components";
import { createActionsColumn, createSelectColumn, createTextColumn, } from "../../libs";
import { useDeleteMineral, useFetchMinerals } from "../../hooks";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useModal } from "../../hooks/useModal";
import { useLocationStore } from "../../store";
import { navItems } from "../../layout/Routes";
import SelectLocation from "./SelectLocation";


export default function MineralList() {
  const [delMineralId, setDelMineralId] = useState<string | null>(null);
  const { isOpen, closeModal, openModal } = useModal();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    state: { label: "", value: "" },
    counties: [],
  });
  const [showSearch, setShowSearch] = useState(false);
  const pathname = useLocation()?.pathname;
  const pageTitle = useMemo(() => {
    if (pathname?.includes("/mineral"))
      return (
        navItems.find((item) => item.id === "mineral")?.name || "Mineral Owners"
      );
    return "";
  }, [pathname]);
  const {
    data,
    isPending: loading,
    refetch,
  } = useFetchMinerals({
    page,
    rows: 10,
    name: form.name,
    stateCode: form.state.value,
    counties: form.counties?.join(",") || "",
  });
  const { mutate: deleteMineral, isPending: isDeleting } = useDeleteMineral();

  const toggleSearch = () => setShowSearch((pre) => !pre);

  const confirmDeletion = (id: string) => {
    setDelMineralId(id);
    openModal();
  };

  const onCancelDel = () => {
    setDelMineralId(null);
    closeModal();
  };

  const onConfirmDeletion = () => {
    if (!delMineralId) {
      closeModal();
      return;
    }
    deleteMineral(delMineralId, {
      onSuccess: () => {
        setDelMineralId(null);
        toast.success("User deleted succesfully");
        closeModal();
      },
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };

  const columnDefs = useMemo(
    () => [
      createTextColumn("names", "Name", { flex: 3.5 }),
      createTextColumn("emails", "Email", { flex: 3.5 }),
      createTextColumn("numbers", "Number", { flex: 3.5 }),
      createTextColumn("state.name", "State", { flex: 3.5 }),
      createSelectColumn("counties", "Counties", 3),
      createTextColumn("addresses", "Address", { flex: 3 }),
      createActionsColumn({
        onView: (data: any) => navigate(`/mineral/${data?._id}`),
        onEdit: (data: any) => navigate(`/edit-mineral/${data?._id}`),
        onDelete: (data: any) => confirmDeletion(data?._id || ""),
      }),
    ],
    []
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {pageTitle}
        </h2>
        <ol className="flex items-center gap-2">
          <li>
            <IconButton onClick={toggleSearch}>
              <MagnifyingGlassIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <IconButton onClick={refetch} loading={loading}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
        </ol>
      </div>

      {showSearch && (
        <SearchForm form={form} setForm={setForm} loading={loading} />
      )}

      <AgGridTable
        rowData={data?.minerals || []}
        columnDefs={columnDefs}
        page={page}
        total={data?.total}
        loading={loading}
        limit={10}
        onPageChange={setPage}
      />
      <DeleteConfirmation
        isOpen={isOpen}
        onCancel={onCancelDel}
        onConfirm={onConfirmDeletion}
        loading={isDeleting}
      />
    </>
  );
}

const SearchForm = memo(
  ({
    form,
    setForm,
    loading,
  }: {
    form: any;
    setForm: (val: any) => void;
    loading: boolean;
  }) => {
    const location = useLocationStore((s) => s.locations);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setForm((pre: any) => ({ ...pre, [e.target.name]: e.target.value }));
    };

    const handleArrayChange = (e: { name: string; value: any }) => {
      setForm((pre: any) => ({ ...pre, [e.name]: e.value }));
    };

    const onClearSearch = () => {
      if (loading) return;
      setForm({
        name: "",
        state: { label: "", value: "" },
        counties: [],
      });
    };

    return (
      <form className="mb-8 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-5">
          <SelectLocation
            name="state"
            label="State"
            placeholder="Select state"
            value={form.state}
            onChange={handleOnChange}
          />
          <div className="">
            <Label htmlFor="counties">Counties</Label>
            <MultiSelect
              placeholder="Select Counties"
              options={location?.filter(
                (item) =>
                  item?.type === "county" &&
                  item?.state?.name === form.state.label
              )}
              optionLabel="name"
              optionValue="name"
              filter={true}
              value={form.counties}
              onChange={(e) =>
                handleArrayChange({
                  name: "counties",
                  value: e.target.value,
                })
              }
              className="w-full rounded-lg!"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="">
            <Label htmlFor="name">Name</Label>
            <Input
              placeholder="Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 mt-3">
          <Button
            disabled={loading}
            onClick={onClearSearch}
            type="button"
            variant="outline"
            size="sm"
          >
            Clear
          </Button>
        </div>
      </form>
    );
  }
);
