import { redirect } from "next/navigation";

export default function CoupunsPage() {
  redirect("/en/coupons/list-coupons");
  return <div>CoupunsPage</div>;
}
