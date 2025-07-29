import { useCallback, useState } from "react";

import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { TrashBinIcon } from "../../icons";
import FileDropZone from "./FileDropZone";


const UploadMineralFile = () => {
  const [data, setData] = useState<any>([]);
  const handleUpload = useCallback(()=>{
    // const promise = 
  },[data]);

  return (
    <>
        <FileDropZone />
    </>
  );
};

export default UploadMineralFile;
