import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

const Customers = () => {
  return (
    <>
      <PageMeta title={"Users | Petro411"} description="" />
      <PageBreadcrumb pageTitle="Users" button={true} buttonTitle="Add user" />
      <BasicTableOne />
    </>
  );
};

export default Customers;
