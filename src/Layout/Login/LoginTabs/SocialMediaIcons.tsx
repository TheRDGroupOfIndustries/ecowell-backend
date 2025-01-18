"use client";

import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
// import Cookies from "js-cookie";
import { useAppSelector } from "@/Redux/Hooks";
import { toast } from "react-toastify";

const SocialMediaIcons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);

  const handleOAuthGoogle = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await signIn("google");
      console.log(session);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!session?.user) {
        toast.error("Authentication failed");
        setIsLoading(false);
        return;
      }

      toast.success("Logged in successfully!");
      router.push(`/${i18LangStatus}/dashboard`);
    } catch (error) {
      toast.error("Failed to login with Google");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ul className="social">
      <li>
        <button
          onClick={handleOAuthGoogle}
          disabled={isLoading}
          style={{
            backgroundColor: "transparent",
            border: "none",
            font: "25px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <i className="icon-google"></i>
        </button>
      </li>
    </ul>
  );
};

export default SocialMediaIcons;
