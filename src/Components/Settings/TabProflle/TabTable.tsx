"use client";

import { capitalizeHeader } from "@/lib/utils";
import { AdminValues } from "@/Types/Layout";
import { useSession } from "next-auth/react";
import { Input, Table } from "reactstrap";
import { useState } from "react";
import { passwordPattern } from "@/Layout/Login/LoginTabs/LoginForm";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const TabTable = () => {
  const { data: session, update } = useSession();
  const user = session?.user as AdminValues;
  const [isEditing, setIsEditing] = useState(false); // Changed to false by default
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string) => {
    return passwordPattern.test(password);
  };

  const hasChanges = () => {
    const originalData = {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
    };

    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.email !== originalData.email ||
      formData.phone_number !== originalData.phone_number ||
      formData.newPassword !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any fields have been modified
    if (!hasChanges()) {
      toast.info("No changes detected!");
      return;
    }

    setIsSaving(true);

    if (formData.newPassword && !validatePassword(formData.newPassword)) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      setIsSaving(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      setIsSaving(false);
      return;
    }

    try {
      const updateData = {
        user_id: user._id,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone_number: formData.phone_number,
        ...(formData.newPassword && { password: formData.newPassword }),
      };

      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        await update();
        setIsEditing(false);
      } else {
        toast.error(data.error || "Failed to update profile");
        // Reset form data to previous values on error
        setFormData({
          firstName: user?.name?.split(" ")[0] || "",
          lastName: user?.name?.split(" ")[1] || "",
          email: user?.email || "",
          phone_number: user?.phone_number || "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="tab-pane fade show active">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="f-w-600 f-16">Profile</h5>
        <button
          type="button"
          className="btn btn-link text-primary"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaEdit size={20} />
        </button>
      </div>
      <div className="table-responsive profile-table">
        <form onSubmit={handleSubmit}>
          <Table className="table-responsive">
            <tbody>
              <tr>
                <td>Role:</td>
                <td>{capitalizeHeader(user?.role)}</td>
              </tr>
              <tr>
                <td>First Name:</td>
                <td>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  ) : (
                    formData.firstName
                  )}
                </td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    formData.lastName
                  )}
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  ) : (
                    formData.email
                  )}
                </td>
              </tr>
              <tr>
                <td>Mobile Number:</td>
                <td>
                  {isEditing ? (
                    <Input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    formData.phone_number
                  )}
                </td>
              </tr>
              {isEditing && (
                <tr>
                  <td>New Password:</td>
                  <td>
                    <div className="position-relative mb-2">
                      <Input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Leave blank to keep current password"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                      >
                        {showPasswords.new ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </button>
                    </div>
                    {formData.newPassword && (
                      <div className="position-relative">
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                        >
                          {showPasswords.confirm ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {isEditing && (
            <div className="d-flex gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TabTable;
