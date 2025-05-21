import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Input from "../../form/input/InputField";
import { ChangeEvent, memo, useCallback } from "react";
import Label from "../../form/Label";

type Props = {
  type?: string;
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetInput: (name: string) => void;
  fieldName: string;
  items: string[];
  addItem: (val: any) => void;
  removeItem: (val: any) => void;
};

const TodoInput = ({
  type,
  label,
  placeholder,
  name,
  value,
  onChange,
  resetInput,
  items,
  fieldName,
  addItem,
  removeItem,
}: Props) => {
  const handleDeleteItem = useCallback(
    (id: any) => {
      removeItem({
        fieldName,
        value: items?.filter((_, index) => index !== id),
      });
    },
    [items, value]
  );

  const handleAddItem = useCallback(() => {
    if (!value?.trim().length) return;
    addItem({ fieldName: fieldName, value: [...items, value] });
    resetInput(name);
  }, [items, value]);

  return (
    <div className="w-full">
      <Label htmlFor="">{label}</Label>
      <div className="grid grid-cols-12 items-center gap-1">
        <div className="col-span-11">
          <Input
            type={type}
            name={name}
            className=""
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
        <button type="button" className="p-1 col-span-1">
          <PlusIcon
            onClick={handleAddItem}
            height={20}
            width={20}
            className="dark:text-white"
          />
        </button>
      </div>
      {items?.length ? (
        <div className="mt-2 max-h-52 overflow-y-auto p-2 flex flex-col gap-2 no-scrollbar">
          {items?.map((item, index) => (
            <div className="flex flex-row items-center gap-3" key={index}>
              <span className="text-gray-500 text-[15px] dark:text-gray-400">
                {item}
              </span>
              <TrashIcon
                onClick={() => handleDeleteItem(index)}
                height={16}
                width={16}
                className="dark:text-white cursor-pointer"
              />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default memo(TodoInput);
