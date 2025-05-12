import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useParams } from "react-router";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../store/slices/authSlice";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import { useModal } from "../../hooks/useModal";

export default function UserDetails() {
  const { id } = useParams();
  const token = useSelector(getToken);
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const { data, loading, error } = useQuery(
    `${endpoints.getUser}?id=${id}`,
    token ?? ""
  );
  const { isOpen, openModal, closeModal } = useModal();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    role:""
  });

  const [haveChanges, setHaveChanges] = useState(false);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
      if (!haveChanges) setHaveChanges(!haveChanges);
    },
    [form]
  );

  const handleSave = useCallback(() => {}, [form, data]);

  useEffect(() => {
    if (data?.user) {
      setUser(data?.user);
      setForm({
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        bio: user?.bio,
        role : user?.role
      });
    }
  }, [data, dispatch]);

  return (
    <>
      <PageMeta title={`${user?.name} | Petro411`} description="" />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserMetaCard
            user={user}
            openModal={openModal}
            isOpen={isOpen}
            closeModal={closeModal}
            onSubmit={handleSave}
            form={form}
            onChange={handleOnChange}
            haveChanges={haveChanges}
            loading={loading}
          />
          <UserInfoCard user={user} />
        </div>
      </div>
    </>
  );
}
