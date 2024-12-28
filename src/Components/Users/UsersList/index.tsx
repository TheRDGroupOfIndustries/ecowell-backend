"use client";

import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import Datatable from "@/CommonComponents/DataTable";
// import { UserListData } from "@/Data/Users";
import { User } from "@/Types/Layout";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Container } from "reactstrap";

const UserList = () => {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/get-users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    "_id",
    "profile_image",
    "first_name",
    // "role",
    "email",
    "phone_number",
  ];

  const filteredUserData = users.map((user) => {
    const filteredUser: any = {};
    columns.forEach((column) => {
      filteredUser[column] = user[column as keyof User];
    });
    return filteredUser;
  });

  return (
    <Fragment>
      <CommonBreadcrumb title="User List" parent="Users" />
      <Container fluid>
        <Card>
          <CardHeader>
            <h5>Users</h5>
          </CardHeader>
          <CardBody>
            {/* <div className="btn-popup pull-right">
              <Button
                color="secondary"
                onClick={() => router.push("/en/users/create-user")}
              >
                Create User
              </Button>
            </div> */}
            {/* <div className="clearfix"></div> */}
            <div
              id="batchDelete"
              className="category-table user-list order-table coupon-list-delete"
            >
              <Datatable
                showId={false}
                // multiSelectOption={true}
                myData={filteredUserData}
                loading={loading}
                pageSize={10}
                pagination={true}
                class="-striped -highlight"
                onClickField="first_name"
                handleOnClick={(row: any) =>
                  router.push(`/en/users/user-detail/${row._id}`)
                }
              />
            </div>
          </CardBody>
        </Card>
      </Container>
    </Fragment>
  );
};

export default UserList;
