import { memo, useCallback, useEffect, useState } from "react";
import { Button, InputField, Label, PageMeta } from "../../components";
import ComponentCard from "../../components/common/ComponentCard";
import { useParams } from "react-router";
import TextArea from "../../components/form/input/TextArea";
import TodoInput from "../../components/ui/todoInput/TodoInput";
import { useMutationPut } from "../../hooks/useMutationPut";
import { endpoints } from "../../config/api";
import { useMutation } from "../../hooks/useMutation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import {
  addPlan,
  getPlans,
  setPlans,
  updatePlan,
} from "../../store/slices/planSlice";
import { useQuery } from "../../hooks/useQuery";
let initialValues = {
  title: "",
  subtitle: "",
  description: "",
  priceId: "",
  feature: "",
  features: [],
  amount: "",
};
const AddEditPlan = () => {
  const params = useParams();
  let planId = params?.id;
  const plans = useSelector(getPlans);
  const getPlanApi = useQuery(endpoints.getPlans, null, !plans.length);
  const dispatch = useDispatch();
  const updateApi = useMutationPut(endpoints.editPlan);
  const createApi = useMutation(endpoints.createPlan);
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (planId) {
          let payload = {
            ...formData,
            planId,
            amount: parseFloat(Number(formData.amount).toFixed(2)),
          };
          let res = await updateApi.request(payload);
          dispatch(updatePlan(res?.data));
          console.log(res);
          toast.success("Plan updated successfully.");
        } else {
          let payload = {
            ...formData,
            amount: parseFloat(Number(formData.amount).toFixed(2)),
          };
          let res = await createApi.request(payload);
          dispatch(addPlan(res?.data));
          toast.success("Plan created successfully.");
          setFormData(initialValues);
        }
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [formData, params]
  );

  useEffect(() => {
    if (!plans?.length) {
      if (getPlanApi.data?.plans) {
        dispatch(setPlans(getPlanApi.data?.plans));
      }
    } else {
      const plan = plans.find((item) => item._id === planId);
      setFormData({
        title: plan?.title ?? "",
        description: plan?.description ?? "",
        subtitle: plan?.subtitle ?? "",
        priceId: plan?.priceId ?? "",
        feature: "",
        features: plan?.features ?? [],
        amount: plan?.amount ?? [],
      });
    }
  }, [getPlanApi.data]);

  return (
    <>
      <PageMeta title="Stripe plan" description="" />
      <ComponentCard title={params?.id ? "Edit plan" : "Create plan"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <Label>Title</Label>
              <InputField
                min={3}
                required
                max={50}
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter plan title"
              />
            </div>

            <div className="">
              <Label>Subtitle</Label>
              <InputField
                min={3}
                required
                max={50}
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Enter plan subtitle"
              />
            </div>

            <div className="">
              <Label>Stripe price id</Label>
              <InputField
                min={5}
                max={200}
                required
                name="priceId"
                value={formData.priceId}
                onChange={handleChange}
                placeholder="Enter Stripe Price ID"
              />
            </div>

            <div className="">
              <Label>Amount</Label>
              <InputField
                min={0}
                step="0.01"
                max={10000}
                required
                name="amount"
                value={formData.amount}
                type="number"
                onChange={handleChange}
                placeholder="Enter Stripe Price amount"
              />
            </div>

            <div className="">
              <TodoInput
                type="text"
                label="Features"
                placeholder="Feature"
                fieldName="features"
                name="feature"
                value={formData.feature}
                items={formData.features}
                onChange={handleChange}
                addItem={(e) =>
                  setFormData((pre) => ({
                    ...pre,
                    [e.fieldName]: e.value,
                  }))
                }
                resetInput={(e) => {
                  setFormData((pre) => ({ ...pre, [e]: "" }));
                }}
                removeItem={(e) => {
                  setFormData((pre) => ({
                    ...pre,
                    [e.fieldName]: e.value,
                  }));
                }}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter plan description"
              rows={4}
              minLength={20}
              maxLength={500}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={createApi.loading || updateApi.loading}
              disabled={createApi.loading || updateApi.loading}
            >
              {params?.id ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
};

export default memo(AddEditPlan);
