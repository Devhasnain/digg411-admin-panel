import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Tile,
  InputField as Input,
  Label,
  Select,
  PageMeta,
  IconButton,
  Modal,
} from "../components/index";
import { useModal } from "../hooks/useModal";
import toast from "react-hot-toast";
import GetApiErrorMessage from "../utils/GetApiErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "../hooks/useMutation";
import { endpoints } from "../config/api";
import { getToken } from "../store/slices/authSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useQuery } from "../hooks/useQuery";
import {
  addLocation,
  deleteLocation,
  getLocations,
  setLocations,
} from "../store/slices/locationsSlice";
import SelectLocation from "./MineralList/SelectLocation";
import { TrashBinIcon } from "../icons";
import { useDeleteRequest } from "../hooks/useDeleteRequest";

const Locations = () => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const locations = useSelector(getLocations);
  const { isOpen, openModal, closeModal } = useModal();
  const [globalFilter, setGlobalFilter] = useState("");
  const { request, data, loading } = useQuery(
    endpoints.getLocations,
    token ?? "",
    !locations?.length
  );
  const deleteLocApi = useDeleteRequest();

  const renderHeader = () => {
    return (
      <div className="flex justify-end">
        <form>
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <MagnifyingGlassIcon height={18} width={18} />
            </span>
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
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

  const handleDeleteLocation = useCallback((id: string) => {
    if (!id) return;
    const deletePromise = toast.promise(
      deleteLocApi.request({ path: `${endpoints.deleteLocation}?id=${id}` }),
      {
        loading: "Deleting location...",
        success: "Location deleted successfully!",
        error: "Failed to delete location.",
      }
    );

    deletePromise.then(() => {
      dispatch(deleteLocation(id));
    });
  }, []);

  useEffect(() => {
    if (data?.locations?.length) {
      dispatch(setLocations(data?.locations));
    }
  }, [data]);

  return (
    <>
      <PageMeta title={"Locations | Petro411"} description="" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Locations
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
            <Button size="sm" onClick={openModal}>
              Add new
            </Button>
          </li>
        </ol>
      </div>
      <Tile>
        <AddNewLocation isOpen={isOpen} closeModal={closeModal} />

        <div className="w-full overflow-x-hidden">
          <DataTable
            value={locations}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            globalFilterFields={["name", "code", "type", "state", ""]}
            header={renderHeader}
            emptyMessage="No locations found."
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
              field="code"
              header={
                <span className="text-gray-500 text-sm font-normal">Code</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.code}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="type"
              header={
                <span className="text-gray-500 text-sm font-normal">Type</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.type}
                </span>
              )}
              style={{ minWidth: "12rem" }}
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
            />
            <Column
              field=""
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  <TrashBinIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleDeleteLocation(rowData?._id)}
                  />
                </span>
              )}
              style={{ minWidth: "0.5rem" }}
            />
          </DataTable>
        </div>
      </Tile>
    </>
  );
};

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

const initialValues = {
  name: "",
  type: "",
  code: "",
  location: { label: "", value: "" },
};

const AddNewLocation = memo(({ isOpen, closeModal }: Props) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const addLocApi = useMutation(endpoints.addLocation);

  const [form, setForm] = useState(initialValues);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      try {
        e.preventDefault();
        const res = await addLocApi.request(
          {
            ...form,
            state: { name: form.location.label, code: form.location.value },
          },
          null,
          token ?? ""
        );
        dispatch(addLocation(res.location));
        setForm(initialValues);
        toast.success("New location has been added.");
        closeModal();
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [form]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
        <form onSubmit={handleSubmit} className="p-8 mt-10 flex flex-col gap-3">
          <div className="">
            <Label htmlFor="name">Name</Label>
            <Input
              placeholder="Name"
              name="name"
              value={form.name}
              required={true}
              onChange={onChange}
              min={2}
              type="text"
            />
          </div>
          <div className="">
            <Label htmlFor="type">Type</Label>
            <Select
              options={[
                {
                  label: "County",
                  value: "county",
                },
                {
                  label: "State",
                  value: "state",
                },
              ]}
              required={true}
              name="type"
              onChange={onChange}
            />
          </div>

          {form.type === "state" && (
            <div className="">
              <Label htmlFor="code">Code</Label>
              <Input
                placeholder="Code"
                name="code"
                required={true}
                value={form.code}
                onChange={onChange}
                min={1}
                type="text"
              />
            </div>
          )}

          {form.type === "county" && (
            <SelectLocation
              required={true}
              placeholder="State"
              className="top-0"
              name="location"
              value={form.location}
              onChange={onChange}
            />
          )}

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
              disabled={addLocApi.loading}
              loading={addLocApi.loading}
              type="submit"
              size="sm"
            >
              Add
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
});

export default memo(Locations);
