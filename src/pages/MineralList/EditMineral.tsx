import React, {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import TodoInput from "../../components/ui/todoInput/TodoInput";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import SelectLocation from "./SelectLocation";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { MultiSelect } from "primereact/multiselect";
import { useDispatch, useSelector } from "react-redux";
import { getLocations } from "../../store/slices/locationsSlice";
import { useMutation } from "../../hooks/useMutation";
import toast from "react-hot-toast";
import { endpoints } from "../../config/api";
import { getToken } from "../../store/slices/authSlice";
import { setMinerals, updateMineral } from "../../store/slices/mineralsSlice";
import { PageMeta, Tile } from "../../components";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useParams } from "react-router";
import { useQuery } from "../../hooks/useQuery";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useMutationPut } from "../../hooks/useMutationPut";

let initialInputValues = {
  name: "",
  email: "",
  zipcode: "",
  number: "",
  address: "",
  state: { label: "", value: "" },
  description: "",
};

let initialArrayValues = {
  emails: [],
  numbers: [],
  addresses: [],
  counties: [],
};

const EditMineral = () => {
  const { id } = useParams();

  const getMineralDetails = useQuery(
    `${endpoints.getMinerals}?id=${id}`,
    null,
    true
  );

  const dispatch = useDispatch();
  const location = useSelector(getLocations);
  const [formInputs, setFormInputs] = useState(initialInputValues);
  const [formArray, setFormArray] = useState(initialArrayValues);
  const { request, loading } = useMutationPut(
    `${endpoints.editMineral}?id=${id}`
  );

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormInputs((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleResetInput = (name: string) => {
    setFormInputs((pre) => ({ ...pre, [name]: "" }));
  };

  const handleOnChangeArray = (e: any) => {
    setFormArray((pre) => ({ ...pre, [e.fieldName]: e.value }));
  };

  const handleArrayRemoveItem = (e: { fieldName: string; value: any }) => {
    setFormArray((pre) => ({ ...pre, [e.fieldName]: e.value }));
  };

  const handleOnSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const payload = {
        ...formArray,
        name: formInputs.name,
        zipcode: formInputs.zipcode,
        description: formInputs.description,
        state: {
          name: formInputs.state?.label,
          code: formInputs?.state?.value,
        },
      };

      toast.promise(request(payload, null), {
        loading: "Submitting...",
        success: (res) => {
          dispatch(updateMineral({ payload, _id: id }));
          return "Submitted successfully!";
        },
        error: (err) => {
          console.error("Error:", err);
          return "Submission failed!";
        },
      });
    },
    [formArray, formInputs]
  );

  useEffect(() => {
    if (getMineralDetails?.data?.mineral) {
      const data = getMineralDetails?.data?.mineral;
      setFormInputs({
        ...initialInputValues,
        name: data?.name,
        zipcode: data?.zipcode,
        state: { label: data?.state?.name, value: data?.state?.code },
        description: data?.description,
      });
      setFormArray({
        emails: data?.emails ?? [],
        numbers: data?.numbers ?? [],
        counties: data?.counties ?? [],
        addresses: data?.addresses ?? [],
      });
    }
  }, [getMineralDetails?.data?.mineral, id]);

  return (
    <>
      <PageMeta title="Edit mineral" description="" />
      <PageBreadcrumb
        pageTitle="Edit mineral"
        previousTitle="Mineral list"
        previousLink="/mineral"
      />
      <Tile>
        <form
          className="flex flex-col gap-4 relative"
          onSubmit={handleOnSubmit}
        >
          {getMineralDetails.loading && (
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[4px] z-1 flex flex-col items-center justify-center">
              <ArrowPathIcon height={22} width={22} className="animate-spin" />
              <span>Loading</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            <div className="">
              <Label htmlFor="name">Name</Label>
              <Input
                placeholder="Name"
                name="name"
                id="name"
                value={formInputs.name}
                onChange={handleOnChange}
              />
            </div>
            <TodoInput
              type="email"
              label="Email"
              placeholder="Email"
              fieldName="emails"
              name="email"
              value={formInputs.email}
              items={formArray.emails}
              onChange={handleOnChange}
              addItem={handleOnChangeArray}
              resetInput={handleResetInput}
              removeItem={handleArrayRemoveItem}
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <TodoInput
              label="Phone number"
              placeholder="Phone number"
              fieldName="numbers"
              name="number"
              type="number"
              value={formInputs.number}
              items={formArray.numbers}
              onChange={handleOnChange}
              addItem={handleOnChangeArray}
              resetInput={handleResetInput}
              removeItem={handleArrayRemoveItem}
            />
            <TodoInput
              label="Address"
              placeholder="Address"
              fieldName="addresses"
              name="address"
              type="text"
              value={formInputs.address}
              items={formArray.addresses}
              onChange={handleOnChange}
              addItem={handleOnChangeArray}
              resetInput={handleResetInput}
              removeItem={handleArrayRemoveItem}
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <SelectLocation
              name="state"
              label="State"
              placeholder="Select state"
              value={formInputs.state}
              onChange={handleOnChange}
            />
            <div className="">
              <Label htmlFor="counties">Counties</Label>
              <MultiSelect
                placeholder="Select Counties"
                options={location?.filter(
                  (item) =>
                    item?.type === "county" &&
                    item?.state?.name === formInputs.state.label
                )}
                optionLabel="name"
                optionValue="name"
                filter={true}
                value={formArray.counties}
                onChange={(e) =>
                  handleOnChangeArray({
                    fieldName: "counties",
                    value: e.target.value,
                  })
                }
                className="w-full !rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="">
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input
                placeholder="Zipcode"
                type="number"
                name="zipcode"
                value={formInputs.zipcode}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1">
            <Label htmlFor="description">Description</Label>
            <TextArea
              minLength={10}
              required={true}
              rows={10}
              placeholder="Description"
              name="description"
              value={formInputs.description}
              onChange={handleOnChange}
            />
          </div>
          <Button
            disabled={loading}
            className="self-start"
            size="sm"
            type="submit"
          >
            Update
          </Button>
        </form>
      </Tile>
    </>
  );
};

export default memo(EditMineral);
