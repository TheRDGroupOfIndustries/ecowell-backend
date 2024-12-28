import UserDetail from "@/Components/Users/UserDetails";
import React from "react";

export default function UserDetailPage({
  params,
}: {
  params: { _id: string };
}) {
  return <UserDetail _id={params._id} />;
}
