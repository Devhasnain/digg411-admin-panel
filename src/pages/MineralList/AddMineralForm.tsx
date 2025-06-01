import React, { ChangeEvent, memo, useState } from "react";
import TodoInput from "../../components/ui/todoInput/TodoInput";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import SelectLocation from "./SelectLocation";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { MultiSelect } from "primereact/multiselect";
import { useSelector } from "react-redux";
import { getLocations } from "../../store/slices/locationsSlice";

const cities = [
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
];

let initialInputValues = {
  name: "",
  email: "",
  zipcode: "",
  number: "",
  address: "",
  location: { label: "", value: "" },
  description: "",
};

let initialArrayValues = {
  emails: [],
  numbers: [],
  addresses: [],
};

const AddMineralForm = () => {
  const location = useSelector(getLocations);
  const [formInputs, setFormInputs] = useState(initialInputValues);
  const [formArray, setFormArray] = useState(initialArrayValues);

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

  return (
    <form className="flex flex-col gap-4">
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
          name="location"
          value={formInputs.location}
          onChange={handleOnChange}
        />
        <div className="">
          <Label htmlFor="counties">Counties</Label>
          <MultiSelect
            placeholder="Select Counties"
            options={location?.filter((item)=>item?.type === "county" && item?.state?.name === formInputs.location.label)}
            optionLabel="name"
            filter={true}
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
          required={true}
          rows={10}
          placeholder="Description"
          name="description"
          value={formInputs.description}
          onChange={handleOnChange}
        />
      </div>
      <Button className="self-start" size="sm">
        Submit
      </Button>
    </form>
  );
};

export default memo(AddMineralForm);
