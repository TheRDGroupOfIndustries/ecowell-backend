"use client";

import { useRouter } from "next/navigation";
import { User } from "@/Types/Layout";
import { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import TabProfile from "./TabProflle";

const UserDetail = ({ _id }: { _id: string }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const res = await fetch(`/api/user/${_id}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetail();
  }, [_id]);
  // console.log(user);

  // if (!user) return null;
  return (
    <Fragment>
      <CommonBreadcrumb title="User Detail" parent="users" />
      <Container fluid>
        {user ? (
          <Row>
            <Col xl="4">
              <Card>
                <CardBody>
                  <div className="profile-details text-center">
                    <img
                      src={user?.profile_image || ""}
                      alt=""
                      className="img-fluid img-90 rounded-circle blur-up lazyloaded"
                    />
                    <h5 className="f-w-600 f-16 mb-0">
                      {user?.first_name + " " + user?.last_name}
                    </h5>
                    <span>{user?.email}</span>
                    {/* <div className="social">
                    <FormGroup className=" btn-showcase">
                      <a
                        target="_blank"
                        href="https://www.facebook.com/#"
                        className="btn social-btn btn-fb d-inline-flex"
                      >
                        <i className="fa fa-facebook"></i>
                      </a>
                      <a
                        target="_blank"
                        href="https://www.google.com/"
                        className="btn social-btn btn-twitter d-inline-flex"
                      >
                        <i className="fa fa-google"></i>
                      </a>
                      <a
                        target="_blank"
                        href="https://twitter.com/?lang=en"
                        className="btn social-btn btn-google d-inline-flex me-0"
                      >
                        <i className="fa fa-twitter"></i>
                      </a>
                    </FormGroup>
                  </div> */}
                  </div>
                  <hr />
                </CardBody>
              </Card>
            </Col>
            <Col xl="8">
              <Card className="profile-card">
                <CardBody>
                  <TabProfile user_id={_id} user={user} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          "Loading.."
        )}
      </Container>
    </Fragment>
  );
};

export default UserDetail;
