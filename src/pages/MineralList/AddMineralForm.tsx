import React, { ChangeEvent, useState } from "react";
import TodoInput from "../../components/ui/todoInput/TodoInput";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

let initialInputValues = {
  name: "",
  email: "",
  number: "",
  address:""
};

let initialArrayValues = {
  emails: [],
  numbers: [],
  addresses:[]
};

const AddMineralForm = () => {
  const [formInputs, setFormInputs] = useState(initialInputValues);
  const [formArray, setFormArray] = useState(initialArrayValues);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
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
          label="Emails"
          placeholder="Emails"
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
          label="Phone numbers"
          placeholder="Phone numbers"
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
          label="Addresses"
          placeholder="Addresses"
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
    </form>
  );
};

export default AddMineralForm;
