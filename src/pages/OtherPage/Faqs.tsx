import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import Tile from "../../components/common/Tile";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Accordion from "../../components/ui/accordion/Accordion";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { PencilIcon } from "../../icons";
import {
  addFaq,
  deleteFaq,
  getFaqs,
  setFaqs,
  updateFaq,
} from "../../store/slices/faqSlice";
import { useQuery } from "../../hooks/useQuery";
import baseApi, { endpoints } from "../../config/api";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import NoResults from "../../components/NoResults";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useMutation } from "../../hooks/useMutation";
import { getToken } from "../../store/slices/authSlice";

const Faqs = () => {
  const { isOpen, closeModal, openModal } = useModal();
  const token = useSelector(getToken);
  const faqs = useSelector(getFaqs);
  const dispatch = useDispatch();
  const [selectedFaq, setSelecedFaq] = useState<any | null>(null);

  const { data, loading, error, request } = useQuery(
    endpoints.getFaqs,
    "",
    !faqs?.length
  );

  const handleSelectFaq = useCallback(
    (item: any) => {
      setSelecedFaq(item);
      openModal();
    },
    [selectedFaq, faqs]
  );

  const handleDeleteFaq = useCallback(async (id: string) => {
    try {
      await baseApi.delete(`${endpoints.deleteFaqs}?id=${id}`, {
        headers: { Authorization: token ?? "" },
      });
      dispatch(deleteFaq(id));
      toast.success("Faq has been deleted.");
    } catch (error) {
      toast.error(GetApiErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setFaqs(data?.faqs ?? []));
    }
  }, [data, dispatch]);

  return (
    <>
      <PageMeta title="Faqs |" description="" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Faqs
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <button
              onClick={request}
              className="relative flex items-center justify-center !text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ArrowPathIcon
                height={20}
                width={20}
                className={`!text-gray-500 transition-colors ${
                  loading && "animate-spin"
                } ease-in-out`}
              />
            </button>
          </li>
          <li>
            <Button onClick={openModal} size="sm">
              Add new
            </Button>
          </li>
        </ol>
      </div>

      {faqs?.length ? (
        <Tile>
          {faqs?.map((item, index) => (
            <Accordion
              key={index}
              title={item?.title}
              description={item?.description}
              btns={
                <>
                  <button onClick={() => handleDeleteFaq(item?._id)}>
                    <TrashIcon
                      className="dark:text-gray-200"
                      height={18}
                      width={18}
                    />
                  </button>
                  <button onClick={() => handleSelectFaq(item)}>
                    <PencilIcon
                      className="dark:text-gray-200"
                      height={20}
                      width={20}
                    />
                  </button>
                </>
              }
            />
          ))}
        </Tile>
      ) : (
        <NoResults title="No faq's has been added yet!" />
      )}

      <AddFaq
        isOpen={isOpen}
        closeModel={closeModal}
        selectedFaq={selectedFaq}
        setSelectedFaq={setSelecedFaq}
      />
    </>
  );
};

type AddFaqProps = {
  selectedFaq: any | null;
  setSelectedFaq: (val: any) => void;
  isOpen: boolean;
  closeModel: () => void;
};

const AddFaq = ({
  isOpen,
  closeModel,
  selectedFaq,
  setSelectedFaq,
}: AddFaqProps) => {
  const [form, setForm] = useState({ title: "", description: "" });
  const token = useSelector(getToken);
  const dispatch = useDispatch();
  const { loading, request, clearData } = useMutation(endpoints.createFaqs);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value, name } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
    },
    [form]
  );

  const handleOnSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const data = await request(
        form,
        selectedFaq?._id
          ? `${endpoints?.updateFaqs}?id=${selectedFaq?._id}`
          : null,
        token ?? ""
      );
      dispatch(
        selectedFaq
          ? updateFaq({ ...form, _id: selectedFaq?._id })
          : addFaq(data?.faq)
      );
      toast.success(
        selectedFaq ? "Faq has been updated." : "New Faq has been created."
      );
      handleOnClose();
      clearData();
    } catch (error) {
      toast.error(GetApiErrorMessage(error));
    }
  };

  const handleOnClose = () => {
    setForm({ title: "", description: "" });
    setSelectedFaq(null);
    closeModel();
  };

  useEffect(() => {
    if (selectedFaq) {
      setForm({
        title: selectedFaq?.title ?? "",
        description: selectedFaq?.description ?? "",
      });
    }
  }, [selectedFaq]);

  return (
    <Modal className="max-w-[700px]" isOpen={isOpen} onClose={handleOnClose}>
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Faq
          </h4>
        </div>
        <form className="flex flex-col gap-4 mt-5" onSubmit={handleOnSubmit}>
          <div className="">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              value={form?.title}
              required={true}
              placeholder="Title"
              id="title"
              name="title"
              min={3}
              onChange={handleOnChange}
            />
          </div>

          <div className="">
            <Label htmlFor="description">Description</Label>
            <TextArea
              value={form?.description}
              required={true}
              placeholder="Description"
              name="description"
              onChange={handleOnChange}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleOnClose}
            >
              Close
            </Button>
            <Button
              disabled={loading}
              loading={loading}
              type="submit"
              size="sm"
            >
              {selectedFaq ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Faqs;
