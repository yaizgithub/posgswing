import React, { useEffect, useState } from "react";
import { Link, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import ChartOne from "../../../components/dashboard/ChartOne";
import StatisticOne from "../../../components/dashboard/StatisticOne";
import { Button } from "antd";
import PrintComponent from "./PrintComponent";
import PrinterSelection from "./PrinterSelection";


const Dashboard = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    dispatch(
      reduxUpdateTitle({
        rTitle: "Dashboard",
      })
    );
  }, [dispatch]);

  // const refreshToken = async () => {
  //     try {
  //         const res = await axios.get(baseUrl + "/token", {
  //             withCredentials: true,
  //         });
  //         // console.log(res.data);
  //         setToken(res.data.accessToken);
  //         const decoded = jwt_decode(res.data.accessToken);
  //         // console.log(decoded);
  //         setFirstName(decoded.first_name);
  //         setLastName(decoded.last_name);
  //     } catch (err) {
  //         // console.log(err);
  //         if (err.response) {
  //             navigate("/login");
  //         }
  //     }
  // };

  //   const showFCM = async () => {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `key=AAAAqn2xQeA:APA91bHjaG9N2f3JCJbZO22uoxId1ubaX89JY7KJWFo4gGQKh1xc5w4TyTxwTeBYmKtzWtW4rpRaH6m0lxPaM7RKTK__lwpJIpXJMqa-xto8ANi_xyFbcQmtRjnxaTLxuFNyXJO9qPmN`,
  //         // Tambahkan header lain jika diperlukan
  //       },
  //     };

  //     const data = {
  //       registration_ids: [
  //         "f5tEGXShp_ZKhUuOuYoMx4:APA91bHKiDZE3hcKUP_M6cvyhYphFiXlYR7tewgqF5U4Cu9L8oEyr0f_aUFfJJ6peQfF4Un822O38Vf2la4mov_G2K2hCPGY_MkLaof_1zfOZPrbVmGYz9tXUjSFciHKc8Hgj5vY0FfH",
  //       ],
  //       notification: {
  //         title: "Ini Judul",
  //         body: "Mantap Joy",
  //       },
  //     };

  //     await axios
  //       .post("https://fcm.googleapis.com/fcm/send", data, config)
  //       .then((res) => {
  //         // // Penanganan respons
  //         // console.log(res.data);
  //       })
  //       .catch((err) => {
  //         // Penanganan kesalahan
  //         console.error(err);
  //       });
  //   };
  

  return (
    <div>
      {/* Dashboard. Hi, */}
      {/* <Button>refreshToken</Button> */}
      {/* <div className="mb-3">
        <Button onClick={showFCM}>FCM</Button>
      </div> */}

{/* <PrintComponent /> */}
{/* <PrinterSelection /> */}

      <div className="mb-5">
        <StatisticOne />
      </div>
      <div>
        <ChartOne />
      </div>
    </div>
  );
};

export default Dashboard;
