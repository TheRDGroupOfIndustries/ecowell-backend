"use clients";

import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
// import Cookies from "js-cookie";
import { useAppSelector } from "@/Redux/Hooks";
import { toast } from "react-toastify";

const SocialMediaIcons = () => {
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);

  const handleOAuthGoogle = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await signIn("google");
    // Cookies.set("token", JSON.stringify(true));
    // toast.success("Logged in with google!");
    // router.push(`/${i18LangStatus}/dashboard`);
  };
  return (
    <ul className="social">
      <li>
        <button
          onClick={handleOAuthGoogle}
          style={{
            backgroundColor: "transparent",
            border: "none",
            font: "25px",
            cursor: "pointer",
          }}
        >
          <i className="icon-google"></i>
        </button>
      </li>
    </ul>
  );
};

export default SocialMediaIcons;
