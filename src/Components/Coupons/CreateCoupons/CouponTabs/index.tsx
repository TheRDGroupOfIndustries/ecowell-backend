"use client";

import { Session as NextAuthSession } from "next-auth";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import GeneralCouponForm from "./GeneralCouponForm";
import RestrictionCouponForm from "./RestrictionCouponForm";
import UsageCouponForm from "./UsageCouponForm";
import "react-datepicker/dist/react-datepicker.css";

interface ExtendedSession extends NextAuthSession {
  user?: {
    _id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export interface GeneralCouponFormDataTypes {
  name: string;
  code: string;
  description: string;
  startDate: Date;
  endDate: Date;
  discountType: "Percent" | "Fixed" | string;
  discountValue: number;
  quantity: number;
  freeShipping: boolean;
  status: boolean;
}
export interface RestrictionCouponFormDataTypes {
  productName: string;
  category: string;
  minSpend: number;
  maxSpend: number;
}
export interface UsageCouponFormDataTypes {
  perLimit: number;
  perCustomer: number;
}

const CouponTabs = () => {
  const { data: session } = useSession();
  const admin_id = (session as ExtendedSession)?.user?._id || "";
  // console.log(admin_id);

  const [generalFormData, setGeneralFormData] =
    useState<GeneralCouponFormDataTypes>({
      name: "",
      code: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      discountType: "",
      discountValue: 0,
      quantity: 1,
      freeShipping: false,
      status: false,
    });

  const [restrictionFormData, setRestrictionFormData] =
    useState<RestrictionCouponFormDataTypes>({
      productName: "",
      category: "",
      minSpend: 1,
      maxSpend: 1,
    });

  const [usageFormData, setUsageFormData] = useState<UsageCouponFormDataTypes>({
    perLimit: 0,
    perCustomer: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCouponSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!admin_id) {
      return toast.error("Login first!");
    }

    const {
      name,
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
      description,
      quantity,
      freeShipping,
      status,
    } = generalFormData;
    const { productName, category, minSpend, maxSpend } = restrictionFormData;
    const { perLimit, perCustomer } = usageFormData;

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!code) missingFields.push("code");
    if (!discountType) missingFields.push("discount type");
    if (!startDate) missingFields.push("start date");
    if (!endDate) missingFields.push("end date");

    if (missingFields.length > 0) {
      return toast.error(`Please provide: ${missingFields.join(", ")}`);
    }

    const couponData = {
      admin_id,

      name,
      code,
      description,
      startDate,
      endDate,
      discountType,
      discountValue,
      quantity,
      freeShipping,
      status,

      productName,
      category,
      minSpend,
      maxSpend,

      perLimit,
      perCustomer,
    };

    const createCoupon = async () => {
      setIsLoading(true);
      // console.log(couponData);

      try {
        const response = await fetch("/api/coupons/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        });

        if (!response.ok) {
          throw new Error("Something went wrong, please try again");
        }

        const result = await response.json();

        if (result.status === 400) {
          console.log(result.error);
          throw new Error(result.error);
        }

        return "Coupon created successfully!";
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        // throw new Error("Something went wrong, please try again");
      } finally {
        setIsLoading(false);
      }
    };

    toast.promise(createCoupon(), {
      pending: "Creating Coupon...",
      success: {
        render({ data }) {
          return data || "Coupon created successfully!";
        },
      },
      error: {
        render({ data }: { data?: { message: any } }) {
          return data?.message || "Something went wrong, please try again!";
        },
      },
    });
  };

  return (
    <Fragment>
      <Tabs>
        <TabList className="nav nav-tabs tab-coupon">
          <Tab className="nav-link">General</Tab>
          <Tab className="nav-link">Restriction</Tab>
          <Tab className="nav-link">Usage</Tab>
        </TabList>
        <TabPanel>
          <div className="tab-pane fade active show">
            <GeneralCouponForm
              generalFormData={generalFormData}
              setGeneralFormData={setGeneralFormData}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <RestrictionCouponForm
            restrictionFormData={restrictionFormData}
            setRestrictionFormData={setRestrictionFormData}
          />
        </TabPanel>
        <TabPanel>
          <UsageCouponForm
            usageFormData={usageFormData}
            setUsageFormData={setUsageFormData}
          />
        </TabPanel>
      </Tabs>
      <div className="pull-right">
        <Button
          type="button"
          onClick={handleCreateCouponSubmit}
          disabled={isLoading}
        >
          Save
        </Button>
      </div>
    </Fragment>
  );
};

export default CouponTabs;
