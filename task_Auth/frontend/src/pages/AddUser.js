import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";

const AddUser = () => {
  const [isAuth, setIsAuth] = useState(false);
  const navigator = useNavigate();
  const [companyes, setCompanyes] = useState();
  const [users, setUsers] = useState();
  const [pickCompany, setPickCompany] = useState();
  const [pickUser, setPickUser] = useState();
  const [infoData, setInfoData] = useState();

  const CheckToken = async (token) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/add-user-to-org",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        setIsAuth(true);
      }
    } catch (e) {
      setIsAuth(false);
      e.response && alert(e.response.data.msg);
      navigator("/signin");
    }
  };
  const getUsers = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/");
      setUsers(response.data.email_addresses);
      setCompanyes(response.data.company_names);
    } catch (e) {
      console.log(e);
    }
  };
  const click = async () => {
    let tokenTemp = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/add-user-to-org",
        {
          pickCompany: pickCompany,
          pickUser: pickUser,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenTemp.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setInfoData(response.data.users);
      console.log(response.data);
    } catch (e) {
      setIsAuth(false);
      e.response && alert(e.response.data.msg);
      navigator("/signin");
    }
  };

  useEffect(() => {
    let tokenTemp = JSON.parse(localStorage.getItem("userInfo"));

    tokenTemp && CheckToken(tokenTemp.access_token);
    getUsers();
  }, []);

  return (
    <div>
      {isAuth ? (
        <MDBContainer className="mt-5 ">
          <label>
            Pick a company:
            <select
              name="companynames"
              onChange={(e) => setPickCompany(e.target.value)}
            >
              {companyes && companyes.map((i) => <option key={i}>{i}</option>)}
            </select>
          </label>
          <label className="p-5">
            add user:
            <select name="users" onChange={(e) => setPickUser(e.target.value)}>
              {users &&
                users.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
            </select>
          </label>
          <MDBBtn type="submit" onClick={() => click()}>
            add
          </MDBBtn>
          {infoData && infoData.map((i) => <div key={i}>{i}</div>)}
        </MDBContainer>
      ) : (
        <div>not avilable</div>
      )}
    </div>
  );
};

export default AddUser;
