import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosPublicInstance } from "../utils/axios";

const VerifyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSucessMsg] = useState("");
  useEffect(() => {
    async function verifyToken() {
      try {
        let { data } = await axiosPublicInstance.post(`/api/user/verify`, {
          token: searchParams.get("token"),
        });
        console.log(data);
        setSucessMsg(data);
      } catch (error) {
        console.log(error.response.data);
        setErrorMsg(error.response.data);
      }
    }
    verifyToken();
  }, []);
  return (
    <>
      <p>{errorMsg}</p>
      <p>{successMsg}</p>
    </>
  );
};

export default VerifyPage;
