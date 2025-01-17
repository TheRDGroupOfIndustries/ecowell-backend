import CategoryDigital from "@/Components/Products/Digital/CategoryDigital";
import { unstable_noStore as noStore } from "next/cache";
export const dynamic = "force-dynamic";

const DigitalCategoryContainer = () => {
  noStore();
  return <CategoryDigital />;
};

export default DigitalCategoryContainer;
