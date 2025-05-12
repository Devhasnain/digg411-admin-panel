import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Tile from "../../components/common/Tile";
import { Editor } from "primereact/editor";
import Button from "../../components/ui/button/Button";

const PrivacyPolicy = () => {
  const [text, setText] = useState<any>("");
  return (
    <>
      <PageMeta title="Privacy Policy |" description="" />
      <PageBreadcrumb pageTitle="Privacy Policy" />
      <Tile>
        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue)}
          className="h-[60vh]"
        />
        <Button size="sm" className="mt-20">Save</Button>
      </Tile>
    </>
  );
};

export default PrivacyPolicy;
