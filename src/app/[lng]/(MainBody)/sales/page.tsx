import { redirect } from "next/navigation";

export default function SalesPage() {
  redirect("/en/sales/orders");
  return <div>SalesPage</div>;
}
