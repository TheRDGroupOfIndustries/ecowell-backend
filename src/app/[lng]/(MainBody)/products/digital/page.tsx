import { redirect } from "next/navigation";

export default function DigitalProductPage() {
  redirect("/en/products/digital/digital-product-list");
  return <div>DigitalProductPage</div>;
}
