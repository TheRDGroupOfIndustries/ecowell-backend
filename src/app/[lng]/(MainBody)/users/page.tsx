import { redirect } from "next/navigation";

export default function UsersPage() {
  redirect("/en/users/list-user");
  return <div>UsersPage</div>;
}
