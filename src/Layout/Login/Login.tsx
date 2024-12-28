"use client";

import { Fragment } from "react";
import { Container, Row } from "reactstrap";
import LoginTabs from "./LoginTabs";
import LoginSlider from "./LoginSlider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/Redux/Hooks";

const Login = () => {
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);

  const { status } = useSession();

  // console.log(session);
  if (status === "authenticated") {
    router.push(`/${i18LangStatus}/dashboard`);
  }

  return (
    <Fragment>
      <div className="page-wrapper">
        <div className="authentication-box">
          <Container>
            <Row>
              <LoginSlider />
              <LoginTabs />
            </Row>
          </Container>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
