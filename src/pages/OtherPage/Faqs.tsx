import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Tile from "../../components/common/Tile";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Accordion from "../../components/ui/accordion/Accordion";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { PencilIcon, RefreshIcon } from "../../icons";

const Faqs = () => {
  const { isOpen, closeModal, openModal } = useModal();
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
              //   onClick={onReload}
              className="relative flex items-center justify-center !text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <RefreshIcon
                height={18}
                width={18}
                className={`!text-gray-500 transition-colors bg-white ${
                  false && "animate-spin"
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

      <Tile>
        <Accordion
          title="What is React?"
          description="tes"
          editBtn={
            <button onClick={openModal}>
              <PencilIcon height={20} width={20} />
            </button>
          }
        />
      </Tile>

      <AddFaq isOpen={isOpen} closeModel={closeModal} />
    </>
  );
};

type AddFaqProps = {
  isOpen: boolean;
  closeModel: () => void;
};

const AddFaq = ({ isOpen, closeModel }: AddFaqProps) => {
  return (
    <Modal className="max-w-[700px]" isOpen={isOpen} onClose={closeModel}>
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Faq
          </h4>
        </div>
        <form className="flex flex-col gap-4 mt-5">
          <div className="">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              // value={form?.title}
              required={true}
              placeholder="Title"
              id="title"
              name="title"
              min={3}
              // onChange={onChange}
            />
          </div>

          <div className="">
            <Label htmlFor="description">Description</Label>
            <TextArea
              // value={form?.description}
              required={true}
              placeholder="Description"
              name="description"
              // onChange={onChange}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={closeModel}
            >
              Close
            </Button>
            <Button
              //   disabled={loading || !haveChanges}
              //   loading={loading}
              type="submit"
              size="sm"
            >
              Save
              {/* {buttonTitle} */}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Faqs;
