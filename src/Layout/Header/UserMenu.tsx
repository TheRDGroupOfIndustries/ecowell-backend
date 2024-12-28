"use client";

import { ImagePath } from "@/Constants";
import { useAppSelector } from "@/Redux/Hooks";
// import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

const UserMenu = () => {
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);

  const handleLogOut = () => {
    // Cookies.remove("token");
    signOut();
    router.push(`/${i18LangStatus}/auth/login`);
  };
  const { data: session, status } = useSession();

  // console.log(session);
  if (status === "unauthenticated") {
    router.replace(`/${i18LangStatus}/auth/login`);
  }

  return (
    <Fragment>
      <li className="onhover-dropdown">
        <div className="media align-items-center">
          <Image
            src={session?.user?.image || `${ImagePath}/admin.png`}
            alt="header-user"
            width={200}
            height={200}
            className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded"
            style={{ width: "18px", height: "50px" }}
          />
          <div className="dotted-animation">
            <span className="animate-circle"></span>
            <span className="main-circle"></span>
          </div>
        </div>
        <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
          <li>
            <Link href={`/${i18LangStatus}/settings/profile`}>
              <i data-feather="user"></i>Edit Profile
            </Link>
          </li>
          {/* <li>
            <Link href={Href}>
              <i data-feather="settings"></i>Settings
            </Link>
          </li> */}
          <li>
            <div onClick={handleLogOut}>
              <i data-feather="log-out"></i>Logout
            </div>
          </li>
        </ul>
      </li>
    </Fragment>
  );
};

export default UserMenu;
