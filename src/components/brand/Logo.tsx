import { memo } from "react";


type Props = {
  condition?: boolean;
};

const Logo = ({ condition = true }: Props) => {
  return (
    <>
      {condition ? (
        <div className="flex flex-row items-end gap-2">
          <img
            className=""
            src="/images/logo/logo-name.png"
            alt="Logo"
            width={200}
            height={40}
          />
        </div>
      ) : (
        <img
            className=""
            src="/images/logo/logo-name.png"
            alt="Logo"
            width={100}
            height={100}
          />
      )}
    </>
  );
};

export default memo(Logo);
