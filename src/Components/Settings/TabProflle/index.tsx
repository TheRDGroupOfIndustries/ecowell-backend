"use client";

import { useSession } from "next-auth/react";
import { Settings, Unlock, User } from "react-feather";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import TabTable from "./TabTable";
import { AdminValues } from "@/Types/Layout";
import RegisterForm from "@/Layout/Login/LoginTabs/RegisterForm";
import AdminsList from "./AdminsList";

const TabProfile = () => {
  const { data: session } = useSession();
  const user = session?.user as AdminValues;
  console.log(user?.role);

  return (
    <div>
      <Tabs>
        <TabList className="nav nav-tabs tab-coupon">
          <Tab className="nav-link">
            <User className="me-2" />
            Profile
          </Tab>
          {user?.role === "super-admin" && (
            <>
              <Tab className="nav-link">
                <Unlock className="me-2" />
                Create New Admins
              </Tab>
              <Tab className="nav-link">
                <Settings className="me-2" />
                Admins list
              </Tab>
            </>
          )}
        </TabList>
        <TabPanel>
          <TabTable />
        </TabPanel>
        {user?.role === "super-admin" && (
          <>
            <TabPanel>
              <RegisterForm />
            </TabPanel>

            <TabPanel>
              <AdminsList />
            </TabPanel>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TabProfile;
