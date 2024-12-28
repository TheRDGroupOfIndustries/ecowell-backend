import { capitalizeHeader } from "@/lib/utils";
import { AdminValues } from "@/Types/Layout";
import { useSession } from "next-auth/react";
import { Table } from "reactstrap";

const TabTable = () => {
  const { data: session } = useSession();
  const user = session?.user as AdminValues;

  if (!user) return null;
  return (
    <div className="tab-pane fade show active">
      <h5 className="f-w-600 f-16">Profile</h5>
      <div className="table-responsive profile-table">
        <Table className="table-responsive">
          <tbody>
            <tr>
              <td>Role:</td>
              <td>{session?.user && capitalizeHeader(user?.role)}</td>
            </tr>
            <tr>
              <td>First Name:</td>
              <td>{user?.name?.split(" ")[0]}</td>
            </tr>
            <tr>
              <td>Last Name:</td>
              <td>{user?.name?.split(" ")[1]}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{user?.email}</td>
            </tr>
            {/* <tr>
              <td>Gender:</td>
              <td>Male</td>
            </tr> */}
            <tr>
              <td>Mobile Number:</td>
              <td>{user?.phone_number || "-"}</td>
            </tr>
            {/* <tr>
              <td>DOB:</td>
              <td>Dec, 15 1993</td>
            </tr> 
             <tr>
              <td>Location:</td>
              <td>USA</td>
            </tr> */}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TabTable;
