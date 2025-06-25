import {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Tile from "../../components/common/Tile";
import { Editor } from "primereact/editor";
import Button from "../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { getPages, setPage, updatePage } from "../../store/slices/pageSlice";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { getToken } from "../../store/slices/authSlice";
import { useMutation } from "../../hooks/useMutation";
import toast from "react-hot-toast";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";

const TermsAndConditions = () => {
  const pages = useSelector(getPages);
  const currentPage = pages.find((item) => item.slug === "terms");
  const dispatch = useDispatch();

  const { data } = useQuery(
    `${endpoints.getPage}?slug=terms`,
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
      <PageMeta title="Terms & Conditions |" description="" />
      <PageBreadcrumb pageTitle="Terms & Conditions" />
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

const PageEditor = memo(({ currentPage }: PageEditorProps) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [text, setText] = useState(currentPage.content || "");
  const { loading, request } = useMutation(`${endpoints.updatePage}`);

  const handleOnSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        const payload = {
          title: "Terms & Conditions",
          slug: "terms",
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

  // Passive event for smoother scroll behavior (this part is okay)
  useEffect(() => {
    const handler = (e: TouchEvent) => {};
    window.addEventListener("touchstart", handler, { passive: true });
    return () => window.removeEventListener("touchstart", handler);
  }, []);

  // Only update text if it changes externally
  useEffect(() => {
    if (currentPage?.content) {
      setText(currentPage.content);
    }
  }, [currentPage?.content]);

  return (
    <form onSubmit={handleOnSubmit} className="relative">
      {/* Hidden input for HTML5 form validation (not really needed if not using native validation) */}
      <input
        type="text"
        className="absolute opacity-0 pointer-events-none"
        required
        value={text}
        readOnly
      />
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue??"")}
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
});

export default TermsAndConditions;
