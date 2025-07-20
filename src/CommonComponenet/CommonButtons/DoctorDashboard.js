import React, { useContext, useEffect, useState } from "react";
import { Grid, Box, Container, Typography, Chip } from "@mui/material";
import DashboardCard from "./DashboardCard";
import {
  SentimentSatisfied,
  ContentCut,
  PersonAdd,
  LocalAtm,
} from "@mui/icons-material";
import DashboardSection from "./DashboardSection";
import Appointment from "../../Pages/Appointment/Appointment";
import { AuthContext } from "../../Context/Auth";
import axios from "axios";
import ApiConfig from "../../ApiConfig/ApiConfig";
import AppointmentUserlist from "../../Pages/AppointmentUserlist";
import AppointMentDash from "../../Pages/AppointMentDash";
import DashboardAppointment from "../../Pages/DashboardAppointment";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DoctorNewSection from "./DoctorNewSection";
import DoctorTodatApppoint from "../../Pages/DoctorTodayAppointmnet/DoctorTodatApppoint";

const cardData = [
  {
    title: "Appointments",
    value: "650",
    icon: <SentimentSatisfied />,
    color: "#7B61FF",
  },
  {
    title: "Operations",
    value: "54",
    icon: <ContentCut />,
    color: "#FF6B2C",
  },
  {
    title: "New Patients",
    value: "129",
    icon: <PersonAdd />,
    color: "#3DAA54",
  },
  {
    title: "Earning",
    value: "$20,125",
    icon: <LocalAtm />,
    color: "#0E9AF7",
  },
];

const DoctorDashboard = () => {
  const auth = useContext(AuthContext);
  const userData = auth.userData;
  const [loading, setLoading] = useState(false);
  const [allDashData, setAllDashData] = useState({});

  useEffect(() => {
    const dashboardCount = async () => {
      const token = window.localStorage.getItem("UhuruMedToken");
      setLoading(true);
      try {
        const response = await axios.get(ApiConfig.adminDashboard, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response?.data?.error === "false") {
          setAllDashData(response?.data?.data || {});
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    dashboardCount();
  }, []);

  const cardData = [
    {
      title: "Total Users",
      value: allDashData?.totalUser || 0,
      icon: <SentimentSatisfied />,
      color: "#7B61FF",
    },
    {
      title: "Active Users",
      value: allDashData?.userActive || 0,
      icon: <ContentCut />,
      color: "#FF6B2C",
    },
    {
      title: "Total Doctors",
      value: allDashData?.totalDoctor || 0,
      icon: <PersonAdd />,
      color: "#3DAA54",
    },
    {
      title: "Active Doctors",
      value: allDashData?.doctorActive || 0,
      icon: <LocalAtm />,
      color: "#0E9AF7",
    },
  ];

  return (
    <Container maxWidth="xxl">
      {/* <Box>
        <DoctorNewSection allDashData={allDashData} />
      </Box> */}
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
          '@media (max-width:767px)': {
            fontSize: "22px",
          }
        }}>
          Welcome, Dr. {userData?.firstName} {userData?.lastName}
        </Typography>
        <Box mt={2} mb={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              gap: "20px",
              gap: { xs: "10px" },
              // padding: "0px 1rem",
            }}
          >
            <Box
              sx={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "100%",
                maxWidth: "350px",
                display: "flex",
                flexDirection: "column",
                gap: "25px",
                '@media (max-width:676px)': {
                  width: "48%",
                    justifyContent: "space-between",
                }
              }}
            >
              <Typography sx={{ fontSize: "18px", fontWeight: "700",
                  '@media (max-width:676px)': {
                  fontSize: "14px",
                }
               }}>
                Total Complete Appointments
              </Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
                {allDashData?.totalCompletedAppointment || "0"}
              </Typography>
            </Box>
            <Box
              sx={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "100%",
                maxWidth: "350px",
                                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
                gap: "25px",
                   '@media (max-width:676px)': {
                  width: "48%",
                    justifyContent: "space-between",
                }
              }}
            >
              <Typography sx={{ fontSize: "18px", fontWeight: "700",
                 '@media (max-width:676px)': {
                  fontSize: "14px",
                }
               }}>
                Total Earning
              </Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "600", }}>
                {allDashData?.totalEarning || "0"}
              </Typography>
            </Box>
            <Box
              sx={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "100%",
                maxWidth: "350px",
                height: "150px",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                gap: "25px",
                   '@media (max-width:676px)': {
                  width: "48%",
                    justifyContent: "space-between",
                }
              }}
            >
              <Typography sx={{ fontSize: "18px", fontWeight: "700",
                 '@media (max-width:676px)': {
                  fontSize: "14px",
                }
               }}>
                Upcoming Appointment
              </Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
                {allDashData?.upcomingAppointment || "0"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={4}>
        <Typography
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#0077CC",
            paddingLeft: "20px",
          }}
        >
          Today's Appointment
        </Typography>
        <DoctorTodatApppoint />
      </Box>
      <Box mt={4}>
        <Typography
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#0077CC",
            paddingLeft: "20px",
          }}
        >
          Upcoming Appointments
        </Typography>
        <DashboardAppointment />
      </Box>
      {/* <AppointMentDash /> */}
    </Container>
  );
};

export default DoctorDashboard;
