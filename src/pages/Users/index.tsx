import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setUsers } from "../../store/slices/usersSlice";
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
                  <div className="w-10 h-10 overflow-hidden rounded-full">
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
  const { isOpen, openModal, closeModal } = useModal();
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
        // await request(form, null, token ?? "");
        // dispatch(updateUser(form));
        // setHaveChanges(false);
        // toast.success("Profile updated.");
        closeModal();
      } catch (error) {
        // toast.error(GetApiErrorMessage(error));
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
            <button
              onClick={onReload}
              className="relative flex items-center justify-center !text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <i
                className={`pi pi-sync !text-gray-500 transition-colors bg-white ${
                  isLoading && "animate-spin"
                } ease-in-out`}
              ></i>
              {/* <PiReload
                height={18}
                width={18}
                className={`!text-gray-500 transition-colors bg-white ${
                  isLoading && "animate-spin"
                } ease-in-out`}
              /> */}
            </button>
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
        loading={false}
        buttonTitle="Save"
      />
    </>
  );
};

export default Customers;
