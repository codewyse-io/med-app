import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../ApiConfig/ApiConfig";
import { Box, CircularProgress } from "@mui/material";
import Btn from "../../CommonComponenet/CommonButtons/Btn";

const Appointments = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      console.error("Reference not found in URL");
      return;
    }

    const token = window.localStorage.getItem("UhuruMedToken");

    setLoader(true); // Show loader before API call

    fetch(
      `${API_BASE_URL}api/v1/appointment/payment/verify?reference=${reference}&provider=PAYSTACK`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setLoader(false);
        console.log("API Response:", data);

        if (data?.data?.token) {
          setLoader(false);
          localStorage.setItem("UhuruMedToken", data.data.token);
          // navigate('/dashboard');
        } else {
          setLoader(false);
          console.error("JWT Token not found in API response");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error("Error calling API:", error);
      })
      .finally(() => {
        setLoader(false); // Hide loader after success or error
      });
  }, [searchParams, navigate]);

  //   useEffect(() => {
  //     const reference = searchParams.get("reference");

  //     if (!reference) {
  //       console.error("Reference not found in URL");
  //       return;
  //     }

  //     const token = window.localStorage.getItem("UhuruMedToken");

  // setLoader(true);
  //     fetch(
  //       `${API_BASE_URL}api/v1/appointment/payment/verify?reference=${reference}&provider=paystack`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Correct format
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("API Response:", data);

  //         if (data?.data?.token) {
  //           localStorage.setItem("UhuruMedToken", data.data.token);
  //           // localStorage.setItem("userData", JSON.stringify(data.data));
  //           // Optional redirect:
  //           // navigate('/dashboard');
  //         } else {
  //           console.error("JWT Token not found in API response");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error calling API:", error);
  //       });
  //   }, [searchParams, navigate]);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.icon}>
          {loader ? (
            <CircularProgress size={35} style={{ color: "#10b981" }} />
          ) : (
            <svg viewBox="0 0 24 24" style={styles.svg}>
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M8 12l2 2 4-4"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <h1 style={styles.heading}>
          {loader ? "Please wait..." : "Your appointment has been confirmed"}
        </h1>
        <p style={styles.paragraph}>
          Thank you for your payment. Your doctor’s appointment has been
          successfully booked!
        </p>
        <Box mt={2}>
          <Btn label="Okay" onClick={() => navigate("/")} />
        </Box>
      </div>
    </div>
  );
};

const styles = {
  body: {
    backgroundColor: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    textAlign: "center",
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "90%",
  },
  icon: {
    width: "64px",
    height: "64px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
  },
  svg: {
    width: "100%",
    height: "100%",
  },
  heading: {
    fontSize: "28px",
    color: "#111827",
    marginBottom: "16px",
  },
  paragraph: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "4px 0",
    lineHeight: "25px",
  },
  button: {
    marginTop: "30px",
    padding: "12px 24px",
    fontSize: "16px",
    color: "white",
    background: "linear-gradient(to right, #0077CC, #0077CC)",
    border: "none",
    borderRadius: "8px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default Appointments;
