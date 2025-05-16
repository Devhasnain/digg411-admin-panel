import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";
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
  const { data, loading, error } = useQuery(
    `${endpoints.getPage}?slug=terms`,
    "",
    !currentPage
  );

  useEffect(() => {
    if (data) {
      dispatch(setPage(data?.page ?? {}));
    }
  }, [data, dispatch]);
  return (
    <>
      <PageMeta title="Terms & Conditions |" description="" />
      <PageBreadcrumb pageTitle="Terms & Conditions" />
      <Tile>
        <Suspense fallback="Loading">
        <PageEditor currentPage={currentPage} />
        </Suspense>
      </Tile>
    </>
  );
};

type PageEditorProps = {
  currentPage: any;
};

const PageEditor = ({ currentPage }: PageEditorProps) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [text, setText] = useState<any>(currentPage?.content);
  const { loading, request } = useMutation(`${endpoints.updatePage}`);
  const handleOnSubmit = useCallback(
    async (e: FormEvent) => {
      try {
        e.preventDefault();
        const payload = {
          title: "Terms & Conditions",
          slug: "terms",
          content: text,
          id: currentPage?._id,
        };
        await request(payload, null, token ?? "");
        dispatch(updatePage({ ...currentPage, content: text }));
        toast.success("Page updated successfully.");
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [text]
  );

  useEffect(() => {
    if (currentPage) {
      setText(currentPage?.content);
    }
  }, [currentPage]);
  return (
    <form onSubmit={handleOnSubmit} className="relative">
      <input
        type="text"
        className="absolute !opacity-0 top-10 left-3"
        required={true}
        value={text}
      />
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue)}
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

export default TermsAndConditions;
