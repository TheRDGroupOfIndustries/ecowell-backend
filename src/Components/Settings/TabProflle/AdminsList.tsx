"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminValues } from "@/Types/Layout";
import { Container } from "reactstrap";
import Datatable from "@/CommonComponents/DataTable";

const AdminsList = () => {
  const router = useRouter();

  const [admins, setAdmins] = useState<AdminValues[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/auth/get-all-admins", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (row: any) => {
    try {
      const response = await fetch(`/api/auth/delete-admins/${row._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      // toast.success("Admin deleted successfully");
      // Refresh the admin list
      await fetchAdmins();
      return true;
    } catch (error) {
      console.error("Error deleting admin:", error);
      // toast.error("Error deleting admin");
      return false;
    }
  };

  const columns = ["_id", "image", "name", "role", "email", "phone_number"];

  const filteredAdminData = admins.map((admin) => {
    const filteredAdmin: any = {};
    columns.forEach((column) => {
      filteredAdmin[column] = admin[column as keyof AdminValues];
    });
    return filteredAdmin;
  });

  // console.log(filteredAdminData);

  return (
    <Fragment>
      <Container fluid>
        <div
          id="batchDelete"
          className="category-table user-list order-table coupon-list-delete"
        >
          <Datatable
            showId={false}
            // multiSelectOption={true}
            myData={filteredAdminData}
            loading={loading}
            pageSize={10}
            pagination={true}
            onDelete={handleDelete}
            isDelete={true}
            class="-striped -highlight"
            onClickField="first_name"
            handleOnClick={(row: any) =>
              router.push(`/en/users/user-detail/${row._id}`)
            }
          />
        </div>
      </Container>
    </Fragment>
  );
};

export default AdminsList;
