import { memo, useEffect, useState } from "react";
import { Label } from "../../components/index";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../store/slices/authSlice";
import { getLocations, setLocations } from "../../store/slices/locationsSlice";
import AsyncSelect from "react-select/async";

type Props = {
  required?: boolean;
  className?: string;
  name: string;
  value: any;
  placeholder?: string;
  onChange: (e: any) => void;
};

const SelectLocation = ({
  required = false,
  name,
  onChange,
  placeholder = "Location",
}: Props) => {
  const [select, setSelect] = useState<any>(null);
  const locations = useSelector(getLocations)?.filter((item)=>item?.type==="state")?.map((item) => {
    return { label: item?.name, value: item?.code };
  });
  const token = useSelector(getToken) ?? "";
  const dispatch = useDispatch();

  const filteredLocations = (inputValue: string) => {
    return locations?.filter((item) =>
      inputValue?.trim()?.length
        ? item?.label?.toLowerCase()?.includes(inputValue?.toLowerCase())
        : true
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filteredLocations(inputValue));
      }, 1000);
    });

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

  useEffect(() => {
    if (select?.value && name) {
      onChange({ target: { name, value: select, test: select } });
    }
  }, [select]);

  return (
    <div className="relative">
      <Label>{placeholder}</Label>
      <AsyncSelect
        className="!h-11"
        isMulti={false}
        onChange={(e) => setSelect(e)}
        cacheOptions
        required={required}
        defaultOptions
        isLoading={loading}
        loadOptions={promiseOptions}
      />
    </div>
  );
};

export default memo(SelectLocation);
