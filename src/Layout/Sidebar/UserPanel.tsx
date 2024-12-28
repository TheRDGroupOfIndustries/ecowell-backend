"use client";

import { useSession } from "next-auth/react";
import { ImagePath } from "@/Constants";

const UserPanel = () => {
  const { data: session } = useSession();
  return (
    <div>
      <div className="sidebar-user text-center">
        <div>
          <img
            className="img-60 rounded-circle lazyloaded blur-up"
            src={session?.user?.image || `${ImagePath}/dashboard/man.png`}
            alt="#"
          />
        </div>
        <h6 className="mt-3 f-14">{session?.user?.name}</h6>
        <p>{session?.user?.email}</p>
      </div>
    </div>
  );
};

export default UserPanel;
