import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useLocation, useNavigate, NavLink } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const isSignin = location.pathname === "/signin";
  const navigate = useNavigate();

  const click = async () => {
    console.log(email, password);

    try {
      let resp;
      if (isSignin) {
        resp = await axios.post(process.env.REACT_APP_API_URL + "/signin", {
          email,
          password,
        });

        localStorage.setItem("userInfo", JSON.stringify(resp.data));
        navigate("/create-org");
      } else {
        resp = await axios.post(process.env.REACT_APP_API_URL + "/signup", {
          email,
          password,
        });
        localStorage.setItem("userInfo", JSON.stringify(resp.data));
        navigate("/create-org");
      }
    } catch (e) {
      e.response && alert(e.response.data.error);
    }
  };

  return (
    <div>
      <MDBContainer fluid>
        <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol
                md="10"
                lg="6"
                className="order-2 order-lg-1 d-flex flex-column align-items-center"
              >
                <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                  {isSignin ? " user login" : "user registration"}
                </p>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="envelope me-3" size="lg" />
                  <MDBInput
                    label="Your Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="lock me-3" size="lg" />
                  <MDBInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {isSignin ? (
                  <div>
                    no account? <a href="/signup">Registration</a>
                  </div>
                ) : (
                  <div>
                    account exist? <a href="/signin">apply</a>
                  </div>
                )}
                <MDBBtn className="mb-4" size="lg" onClick={() => click()}>
                  {isSignin ? "Apply" : "Registration"}
                </MDBBtn>
              </MDBCol>

              <MDBCol
                md="10"
                lg="6"
                className="order-1 order-lg-2 d-flex align-items-center"
              >
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                  fluid
                />
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default AuthPage;
