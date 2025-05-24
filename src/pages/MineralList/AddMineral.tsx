import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Tile from "../../components/common/Tile";
import AddMineralForm from "./AddMineralForm";
import UploadMineralFile from "./UploadMineralFile";

const AddMineral = () => {
    const [activeTab,setActiveTab] = useState("manual")
  return (
    <>
      <PageMeta title="Add Mineral |" description="" />
      <PageBreadcrumb pageTitle="Add Mineral" />
      <Tile>
        <div className="flex flex-row items-center">
            <button onClick={()=>setActiveTab("manual")} className={`px-10 pb-2 border-b-2 ${activeTab === "manual" ? 'border-blue-400 dark:text-white' : 'border-gray-200 dark:border-gray-800 dark:text-gray-400'}`}>Manual</button>
            <button onClick={()=>setActiveTab("upload")} className={`px-10 pb-2 border-b-2 ${activeTab === "upload" ? 'border-blue-400 dark:text-white' : 'border-gray-200 dark:border-gray-800 dark:text-gray-400'}`}>Upload file</button>
        </div>
        <div className="py-10">

        {
            activeTab === "manual" && <AddMineralForm/>
        }
        {
            activeTab === "upload" && <UploadMineralFile/>
        }
        </div>

      </Tile>
    </>
  );
};

export default AddMineral;
