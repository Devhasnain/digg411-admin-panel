import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useDispatch, useSelector } from "react-redux";
import { addUser, getUsers, setUsers } from "../../store/slices/usersSlice";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useQuery } from "../../hooks/useQuery";
import { endpoints } from "../../config/api";
import { getToken, getUser } from "../../store/slices/authSlice";
import Button from "../../components/ui/button/Button";
import { TableBody, TableCell, TableRow } from "../../components/ui/table";
import { Plans } from "../../config/subscriptionPlans";
import { Link } from "react-router";
import AddUserModel from "../../components/UserProfile/AddUserModel";
import { useModal } from "../../hooks/useModal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import IconButton from "../../components/ui/iconButton/IconButton";
import toast from "react-hot-toast";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useMutation } from "../../hooks/useMutation";

const Customers = () => {
  const auth = useSelector(getUser);
  const users = useSelector(getUsers);
  const token = useSelector(getToken);
  const dispatch = useDispatch();

  const { data, loading, error, request } = useQuery(
    endpoints.getUsers,
    token ?? "",
    !users?.length
  );

  useEffect(() => {
    if (data) {
      dispatch(setUsers(data?.users ?? []));
    }
  }, [data, dispatch]);

  const getActivePlanName = useCallback(
    (id: string) => {
      return Plans.find((item) => item.stripePriceId === id)?.name ?? "-";
    },
    [users]
  );

  return (
    <>
      <PageMeta title={"Users | Petro411"} description="" />
      <Header isLoading={loading} onReload={request} />
      <BasicTableOne head={["User", "Role", "Subscription"]}>
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {users.map((user) => (
            <TableRow key={user?._id}>
              <TableCell className="px-5 py-4 sm:px-6 text-start">
                <Link
                  to={
                    user?._id === auth?._id ? "/profile" : `/user/${user?._id}`
                  }
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 overflow-hidden rounded-full border flex flex-col items-center justify-center">
                    {user?.picture ? (
                      <img
                        width={40}
                        height={40}
                        src={user.picture}
                        alt={"user image"}
                      />
                    ) : (
                      <span>{user?.name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {user?.name}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {user?.email}
                    </span>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {user?.role[0]?.toUpperCase()}
                {user?.role?.slice(1)}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {getActivePlanName(user?.subscription?.priceId)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </BasicTableOne>
    </>
  );
};

type HeaderProps = {
  isLoading: boolean;
  onReload: () => void;
};

const Header = ({ isLoading, onReload }: HeaderProps) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const { isOpen, openModal, closeModal } = useModal();
  const {request,loading} = useMutation(endpoints.createUser);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    bio: "",
  });
  const [haveChanges, setHaveChanges] = useState(false);

  const handleOnChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
      if (!haveChanges) setHaveChanges(!haveChanges);
    },
    [form]
  );

  const handleSave = useCallback(
    async (e: any) => {
      try {
        e.preventDefault();
        const res = await request(form, null, token ?? "");
        dispatch(addUser(res?.user));
        setHaveChanges(false);
        toast.success("New user has been added.");
        setForm({
          name:"",
          email:"",
          bio:"",
          phone:"",
          password:"",
          role:""
        })
        closeModal();
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [form]
  );
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Users
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <IconButton onClick={onReload} loading={isLoading}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <Button onClick={openModal} size="sm">
              Add new
            </Button>
          </li>
        </ol>
      </div>
      <AddUserModel
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={handleSave}
        form={form}
        onChange={handleOnChange}
        haveChanges={haveChanges}
        loading={loading}
        buttonTitle="Save"
      />
    </>
  );
};

export default Customers;
