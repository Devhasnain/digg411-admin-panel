import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Tile from "../../components/common/Tile";
import { Editor } from "primereact/editor";
import Button from "../../components/ui/button/Button";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { getPages, setPage, updatePage } from "../../store/slices/pageSlice";
import toast from "react-hot-toast";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useMutation } from "../../hooks/useMutation";
import { getToken } from "../../store/slices/authSlice";

const PrivacyPolicy = () => {
  const pages = useSelector(getPages);
  const currentPage = pages.find((item) => item.slug === "privacy-policy");
  const dispatch = useDispatch();

  const { data } = useQuery(
    `${endpoints.getPage}?slug=privacy-policy`,
    "",
    !currentPage
  );

  useEffect(() => {
    if (data?.page) {
      dispatch(setPage(data.page));
    }
  }, [data, dispatch]);

  return (
    <>
      <PageMeta title="Privacy Policy |" description="" />
      <PageBreadcrumb pageTitle="Privacy Policy" />
      <Tile>
        {currentPage ? (
          <PageEditor currentPage={currentPage} />
        ) : (
          <p className="p-4 text-sm">Loading...</p>
        )}
      </Tile>
    </>
  );
};

type PageEditorProps = {
  currentPage: {
    _id: string;
    content: string;
    [key: string]: any;
  };
};

const PageEditor = ({ currentPage }: PageEditorProps) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [text, setText] = useState(currentPage.content || "");
  const { loading, request } = useMutation(`${endpoints.updatePage}`);

  const handleOnSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        const payload = {
          title: "Privacy Policy",
          slug: "privacy-policy",
          content: text,
          id: currentPage._id,
        };
        await request(payload, null, token ?? "");
        dispatch(updatePage({ ...currentPage, content: text }));
        toast.success("Page updated successfully.");
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [text, currentPage, dispatch, request, token]
  );

  // Optional: passive scroll handler (good to keep)
  useEffect(() => {
    const handler = (e: TouchEvent) => {};
    window.addEventListener("touchstart", handler, { passive: true });
    return () => window.removeEventListener("touchstart", handler);
  }, []);

  // Sync content if currentPage.content changes
  useEffect(() => {
    if (currentPage?.content && currentPage.content !== text) {
      setText(currentPage.content);
    }
  }, [currentPage?.content]);

  return (
    <form onSubmit={handleOnSubmit} className="relative">
      {/* Hidden required input for form validation */}
      <input
        type="text"
        className="absolute opacity-0 pointer-events-none"
        required
        value={text}
        readOnly
      />
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue ?? "")}
        className="h-[70vh]"
      />
      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        size="sm"
        className="mt-20"
      >
        Save
      </Button>
    </form>
  );
};

export default PrivacyPolicy;
