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
            src="/images/logo/logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <img
            className=""
            src="/images/logo/logo-name.png"
            alt="Logo"
            width={150}
            height={40}
          />
        </div>
      ) : (
        <img src="/images/logo/logo.png" alt="Logo" width={40} height={40} />
      )}
    </>
  );
};

export default memo(Logo);
