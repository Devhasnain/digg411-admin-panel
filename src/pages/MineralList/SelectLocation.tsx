import { memo, useEffect, useMemo, useState } from "react";
import Label from "../../components/form/Label";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import Input from "../../components/form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../store/slices/authSlice";
import { getLocations, setLocations } from "../../store/slices/locationsSlice";
import { ChevronDownIcon } from "../../icons";

type Props = {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: any) => void;
};

const SelectLocation = ({
  name,
  value,
  onChange,
  placeholder = "Location",
}: Props) => {
  const { isOpen, openModal, closeModal } = useModal();
  const locations = useSelector(getLocations);
  const token = useSelector(getToken) ?? "";
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const filteredLocations = useMemo(() => {
    return locations?.filter((item) =>
      search?.trim()?.length
        ? item?.name?.toLowerCase()?.includes(search?.toLowerCase())
        : true
    );
  }, [search, locations]);

  const { data, error, loading } = useQuery(
    endpoints.getLocations,
    token,
    !locations.length
  );

  useEffect(() => {
    if (data) {
      dispatch(setLocations(data?.locations));
    }
  }, [data, locations]);

  return (
    <div className="relative">
      <Label>Location</Label>
      <div
        onClick={!isOpen && !loading ? openModal : () => {}}
        className="flex flex-row items-center justify-between cursor-pointer h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs text-gray-500 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 
             border-gray-300 dark:border-gray-700"
      >
        <span className="flex-1">
          {locations?.find((item) => item?._id === value)?.name ?? placeholder}
        </span>
        {loading ? (
          <i
            className="pi  pi-spinner !animate-spin"
            style={{ fontSize: "1rem" }}
          ></i>
        ) : (
          <ChevronDownIcon
            className={`${
              isOpen ? "rotate-180" : "rotate-0"
            } transition-all duration-300`}
            height={20}
            width={20}
          />
        )}
      </div>
      <Dropdown className="w-full p-5" isOpen={isOpen} onClose={closeModal}>
        <Input
          name="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search location"
        />

        <ul className="mt-3 h-[30vh] overflow-y-auto">
          {filteredLocations?.map((item, index) => (
            <li
              onClick={() => {
                onChange({ target: { name, value: item?._id } });
                closeModal();
              }}
              key={index}
              className="text-[14px] text-gray-500 border-b py-2 cursor-pointer hover:bg-gray-50 px-3"
            >
              {item?.name} ({item?.code})
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
};

export default memo(SelectLocation);
