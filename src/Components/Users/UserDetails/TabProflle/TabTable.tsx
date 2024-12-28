import { User as UserType } from "@/Types/Layout";
import { Table } from "reactstrap";

const TabTable = ({ user }: { user: UserType }) => {
  if (!user) return null;
  return (
    <div className="tab-pane fade show active">
      <h5 className="f-w-600 f-16">Profile</h5>
      <div className="table-responsive profile-table">
        <Table className="table-responsive">
          <tbody>
            <tr>
              <td>First Name:</td>
              <td>{user?.first_name}</td>
            </tr>
            <tr>
              <td>Last Name:</td>
              <td>{user?.last_name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>Mobile Number:</td>
              <td>{user?.phone_number || "-"}</td>
            </tr>
            <tr>
              <td>Role:</td>
              <td>{user?.role || "-"}</td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>{user?.gender || "-"}</td>
            </tr>
            <tr>
              <td>DoB:</td>
              <td>{user?.date_of_birth + "" || "-"}</td>
            </tr>
            <tr>
              <td>Flat/Plot:</td>
              <td>{user?.flat_plot || "-"}</td>
            </tr>
            <tr>
              <td>Address:</td>
              <td>{user?.address || "-"}</td>
            </tr>
            <tr>
              <td>Country:</td>
              <td>{user?.country || "-"}</td>
            </tr>
            <tr>
              <td>Region/State:</td>
              <td>{user?.region_state || "-"}</td>
            </tr>
            <tr>
              <td>City:</td>
              <td>{user?.city || "-"}</td>
            </tr>
            <tr>
              <td>Zip Code:</td>
              <td>{user?.zip_code || "-"}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TabTable;
