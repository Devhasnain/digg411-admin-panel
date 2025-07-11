import { useCallback, useState } from "react";

import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { TrashBinIcon } from "../../icons";
import FileDropZone from "./FileDropZone";


const UploadMineralFile = () => {
  const [data, setData] = useState<any>([]);
  const handleUpload = useCallback(()=>{
    // const promise = 
  },[data])
  
  return (
    <>
      {data?.length ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-row items-center justify-end gap-5">
            <Button onClick={()=>setData([])} size="sm" variant="outline">
              Clear
            </Button>
            <Button disabled={!data?.length} size="sm" onClick={handleUpload}>
              Save
            </Button>
          </div>
          {data?.map((item: any, index: number) => (
            <div
              className="dark:text-white border dark:border-gray-800 p-5 rounded-xl flex flex-col gap-3"
              key={index}
            >
              <div className="flex flex-row items-center justify-between">
                <span className="font-medium">{item?.name}</span>
                <TrashBinIcon className="dark:text-white cursor-pointer" />
              </div>
              <div className="">
                <Label className="mb-0">Email</Label>
                <div className="flex flex-row items-center justify-start gap-4">
                  {item?.emails?.map((email: string, id: number) => (
                    <span key={id} className="text-[14px]">{email}</span>
                  ))}
                </div>
              </div>
              <div className="">
                <Label className="mb-0">Number</Label>
                <div className="flex flex-row items-center justify-start gap-4">
                  {item?.numbers?.map((num: string, id: number) => (
                    <span key={id} className="text-[14px]">{num}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <Label className="mb-0">State</Label>
                <div className="flex flex-row items-center justify-start gap-4">
                  <span className="text-[14px]">{item?.state?.name} ({item?.state?.code})</span>
                </div>
              </div>
              <div className="flex flex-col">
                <Label className="mb-0">City</Label>
                <div className="flex flex-row items-center justify-start gap-4">
                  <span className="text-[14px]">{item?.city}</span>
                </div>
              </div>
              <div className="">
                <Label className="mb-0">Counties</Label>
                <div className="flex flex-col">
                  {item?.counties?.map((county: string, id: number) => (
                    <span key={id} className="text-[14px]">{county}</span>
                  ))}
                </div>
              </div>
              <div className="">
                <Label className="mb-0">Address</Label>
                <div className="flex flex-col">
                  {item?.addresses?.map((adr: string, id: number) => (
                    <span key={id} className="text-[14px]">{adr}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <Label className="mb-0">Description</Label>
                <div className="flex flex-row items-center justify-start gap-4">
                  <span className="text-[14px]">{item?.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <FileDropZone setData={setData} />
      )}
    </>
  );
};

export default UploadMineralFile;
