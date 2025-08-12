import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { z } from "zod";


const validObject = {
  name: "John Doe",
  emails: ["john@example.com", "doe@example.com"],
  numbers: ["+1234567890"],
  addresses: ["123 Main St"],
  counties: ["Travis County"],
  zipcode: "78701",
  description: "Mineral rights owner",
  state: {
    name: "Texas",
    code: "TX",
  },
  city: "Austin",
};
export const mineralSchema = z.object({
  name: z.string().min(1),
  emails: z.array(z.string().email()).nonempty(),
  numbers: z.array(z.string().min(1)).nonempty(),
  addresses: z.array(z.string().min(1)).nonempty(),
  counties: z.array(z.string().min(1)).nonempty(),
  zipcode: z.string().min(1),
  description: z.string().optional(),
  city: z.string().min(1),
  state: z.object({
    name: z.string().min(1),
    code: z.string().min(1),
  }),
});
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../components";
import { Panel } from "primereact/panel";
import { useMutation } from "../../hooks/useMutation";
import { endpoints } from "../../config/api";

const FileDropZone = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const { request, loading} = useMutation();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateData = (data: any[]): boolean => {
    let errors: string[] = [];

    data.forEach((item, index) => {
      const result = mineralSchema.safeParse(item);
      if (!result.success) {
        const issues = result.error.issues.map(
          (i) => `Row ${index + 1}: ${i.path.join(".")} - ${i.message}`
        );
        errors.push(...issues);
      }
    });

    setValidationErrors(errors);
    return errors.length < data.length; // at least one valid
  };

  async function uploadInChunks(data: any[]) {
  const chunks = chunkArray(data, 500);

  for (let i = 0; i < chunks.length; i++) {
    try {
      console.log(`Uploading chunk ${i + 1} of ${chunks.length}...`);
      await request({list:chunks[i] }, endpoints.uploadBulkMineral);
    } catch (err) {
      console.error(`Error uploading chunk ${i + 1}:`, err);
      break; // or continue to skip failed chunks
    }
  }
}


const onFileUpload =async (files: File[]) => {
  const file = files[0];
  if (!file) {
    toast.error("No file selected.");
    return;
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  setIsLoading(true);

  if (fileExtension === "csv") {
    // Parse CSV using PapaParse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete:async (results) => {
      //  setData(results.data);
      await uploadInChunks(results.data);
        toast.success("CSV file parsed and uploaded successfully.");

        setIsLoading(false);
      },
      error: () => {
        toast.error("Failed to parse CSV file.");
        setIsLoading(false);
      }
    });
  } 
  else if (fileExtension === "xlsx" || fileExtension === "xls") {
    // Parse Excel using XLSX
    const reader = new FileReader();
    reader.onload =async (event) => {
      try {
        const data = event.target?.result as string;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

      //  setData(jsonData);
      await uploadInChunks(jsonData);
        toast.success("Excel file parsed and uploaded successfully.");

      } catch {
        toast.error("Failed to parse Excel file.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  } 
  else {
    toast.error("Unsupported file type. Please upload CSV or Excel.");
    setIsLoading(false);
  }
};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: loading,
    multiple: false,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: onFileUpload,
    accept: {
      "text/csv": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
  });

  const handleEditorChange = (value: string | undefined) => {
    try {
      if (!value?.trim()?.length) {
        setData(null);
        return;
      }
      setData(value || "");
      const parsed = JSON.parse(value || "");
      if (Array.isArray(parsed)) {
        validateData(parsed);
      } else {
        setValidationErrors(["Top-level value must be an array"]);
      }
    } catch {
      setValidationErrors(["Invalid JSON"]);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      const mineralsArray = JSON.parse(data);
      if (Array.isArray(mineralsArray)) {
        mineralsArray?.forEach(async (item: any) => {
          const result = mineralSchema.safeParse(item);
          if (result.success) {
            await request({ ...result?.data }, endpoints.uploadBulkMineral);
          }
        });
      }
      toast.success("List uploaded successfully.");
      setData(null);
    } catch (err: any) {
      toast.error(err.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!data && (
        <div className="flex flex-col gap-7">
          <form
            {...getRootProps()}
            className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
            ${
              isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }
          `}
            id="demo-upload"
          >
            {/* Hidden Input */}
            <input {...getInputProps()} disabled={isLoading} />
            <div className="dz-message flex flex-col items-center m-0!">
              {/* Icon Container */}
              <div className="mb-[22px] flex justify-center">
                <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {isLoading ? (
                    <i className="pi pi-spinner !animate-spin "></i>
                  ) : (
                    <svg
                      className="fill-current"
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {/* Text Content */}
              <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
              </h4>
              <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                Drag and drop your CSV, or XLSX files here or browse
              </span>
              <div className="flex flex-row items-center justify-center gap-5">
                <span className="font-medium underline text-theme-sm text-brand-500 cursor-pointer">
                  Browse File
                </span>
                {/* <Tooltip position="right" target={".data-format"}>
                <span className="text-[13px]">
                  The file must be in CSV or XLSX format with the following
                  headers: name, emails, numbers, address, location,
                  description. Emails, numbers, and address should be
                  comma-separated in a single cell. Each row must represent one
                  mineral resource with all fields filled. Example: emails →
                  info@example.com,admin@example.com.
                </span>
              </Tooltip>
              <QuestionMarkCircleIcon
                className="data-format"
                color="gray"
                height={20}
                width={20}
              /> */}
              </div>
            </div>
          </form>
        </div>
      )}
{/*       
      {data && (
        <>
          <Editor
            height="500px"
            defaultLanguage="json"
            value={data}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              formatOnType: true,
              formatOnPaste: true,
            }}
          />
          {validationErrors.length > 0 && (
            <div className="bg-red-100 px-6 py-3 border border-red-400 rounded-xl text-red-700">
              <span className="font-medium">Validation Errors:</span>
              <ul className="list-disc list-inside">
                {validationErrors.map((err, idx) => (
                  <li className="text-sm" key={idx}>
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-row items-center gap-5 mt-5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setData(null)}
              disabled={isUploading}
            >
              Clear
            </Button>
            <Button
              size="sm"
              disabled={validationErrors.length || !data.length || isUploading}
              loading={isUploading}
              onClick={handleSubmit}
            >
              Upload
            </Button>
          </div>
        </>
      )} */}

      {/* <Panel
        header="Valid JSON Object Format (Preview)"
        toggleable
        className="mt-5"
      >
        <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded">
          {JSON.stringify(validObject, null, 2)}
        </pre>
      </Panel> */}
    </div>
  );
};



function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export default FileDropZone;


