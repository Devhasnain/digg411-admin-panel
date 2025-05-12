import { useState } from "react";
import { ChevronDownIcon } from "../../../icons";

type AccordionProps = {
  title: string;
  description: string;
  editBtn?: any;
};

const Accordion: React.FC<AccordionProps> = ({
  title,
  description,
  editBtn,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-2xl mb-2">
      <div className="w-full text-left p-4 flex justify-between items-center">
        <h4
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer text-lg font-medium flex-1"
        >
          {title}
        </h4>
        <div className="flex flex-row items-center justify-end gap-3">
          {editBtn ? editBtn : <></>}
          <span className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <ChevronDownIcon
              height={18}
              width={18}
              className={`${
                isOpen ? "rotate-180" : "rotate-0"
              } transition-all duration-200`}
            />
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="p-4 border-t bg-gray-50 text-sm text-gray-700">
          {description}
        </div>
      )}
    </div>
  );
};

export default Accordion;
