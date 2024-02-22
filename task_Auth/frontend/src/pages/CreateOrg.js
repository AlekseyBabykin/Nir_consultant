import axios from "axios";
import React, { useEffect, useState } from "react";
import { MDBInput, MDBBtn, MDBContainer } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

const CreateOrg = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const navigator = useNavigate();

  const CheckToken = async (token) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/create-org",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        alert(`Hello ${data.logged_in_as}`);
        setIsAuth(true);
      }
    } catch (e) {
      setIsAuth(false);
      e.response && alert(e.response.data.msg);
      navigator("/signin");
    }
  };

  const click = async () => {
    let tokenTemp = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const response = axios.post(
        process.env.REACT_APP_API_URL + "/create-org",
        {
          companyName,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenTemp.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Company name created");
    } catch (e) {
      setIsAuth(false);
      e.response && alert(e.response.data.msg);
      navigator("/signin");
    }
  };

  useEffect(() => {
    let tokenTemp = JSON.parse(localStorage.getItem("userInfo"));

    tokenTemp && CheckToken(tokenTemp.access_token);
  }, []);

  return (
    <div>
      <div>
        {isAuth ? (
          <MDBContainer>
            <MDBInput
              className="mb-2 mt-2"
              type="text"
              placeholder="Write name your company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <MDBBtn type="submit" onClick={click}>
              Create
            </MDBBtn>
          </MDBContainer>
        ) : (
          "You are not available"
        )}
      </div>
    </div>
  );
};

export default CreateOrg;
