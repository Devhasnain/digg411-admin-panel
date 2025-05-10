import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgetpasswordForm from "../../components/auth/ForgetpasswordForm";

const ForgetPassword = () => {
  return (
    <>
      <PageMeta title="Petro411 | Forget password" description="" />
      <AuthLayout>
        <ForgetpasswordForm />
      </AuthLayout>
    </>
  );
};

export default ForgetPassword;
