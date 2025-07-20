import {
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  TableHead,
  CircularProgress,
  Button,
  IconButton,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/Auth";
import ApiConfig from "../../ApiConfig/ApiConfig";
import axios from "axios";
import moment from "moment";
import { ro } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import SubscribeUserList from "../SubscribeUserList/SubscribeUserList";
import { BsCloudDownloadFill } from "react-icons/bs";
import { getBase64 } from "../../utils";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

const Record = () => {
  const navigate = useNavigate();
  const handleAppoinmet = () => {
    navigate("/appointment-user");
  };
  const auth = useContext(AuthContext);
  const userData = auth?.userData;
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [value, setValue] = React.useState(1);

  const pdfDownload = async (row) => {
    const logoBase64 = await getBase64("Images/uhuruMedHDLogo.jpeg");
    // const parsedReport = JSON.parse(medicalReport || '[]'); // Step 1: Parse JSON string

    const medicineRows = userData?.medical_report?.map((med, index) => [
      `${index + 1}`,
      `${med.name} (${med.id})`, // Medicine name and ID
      med.description || "N/A", // Description
    ]);

    // console.log("DSgsfdgfsd", medicineRows);
    const docDefinition = {
      content: [
        {
          columns: [
            {
              image: logoBase64,
              width: 40,
              alignment: "center",
              margin: [0, 0, 0, 20],
              style: "logos",
            },
            {
              text: "UhuruMed",
              style: "invoiceTitle",
            },
            {
              text: [
                {
                  text: `Appointment: ${
                    row?.consultation?.appointmentId || "--"
                  }`,
                  bold: true,
                  fontSize: 10,
                  alignment: "right",
                },
                {
                  text: "\n",
                },
                {
                  text: `Date: ${moment(row?.created_at).format("DD-MM-YYYY")}`,
                  bold: true,
                  fontSize: 10,
                  alignment: "right",
                  // margin: [60, 0, 30, 0],
                },
              ],
              style: "invoiceTitle",
            },
          ],
        },

        {
          text: "Patient Information:",
          style: "sectionHeader",
          margin: [0, 20, 0, 8],
        },

        {
          table: {
            widths: ["25%", "75%"],
            body: [
              [
                { text: "Full Name:", fontSize: 10 },
                {
                  text: row?.patient?.firstName || "--",
                  fontSize: 10,
                },
              ],
              [
                { text: "Email Id:", fontSize: 10 },
                {
                  text: row?.patient?.email || "--",
                  fontSize: 10,
                },
              ],
              [
                { text: "Patient ID:", fontSize: 10 },
                {
                  text: row?.patient?.id || "--",
                  fontSize: 10,
                },
              ],
              [
                { text: "Phone Number:", fontSize: 10 },
                {
                  text: row?.patient?.phone || "--",
                  fontSize: 10,
                },
              ],
             
            ],
          },

          layout: "noBorders",
        },

        {
          text: "Doctor Information:",
          style: "sectionHeader",
          margin: [0, 20, 0, 8],
        },
        {
          table: {
            widths: ["25%", "75%"],
            body: [
              [
                { text: "Name:", fontSize: 10 },
                {
                  text: row?.doctorName || "--",
                  fontSize: 10,
                },
              ],
              [
                { text: "Specialization:", fontSize: 10 },
                {
                  text: row?.specialization || "--",
                  fontSize: 10,
                },
              ],
              [
                { text: "license ID:", fontSize: 10 },
                {
                  text: row?.doctor?.licenseNumber || "--",
                  fontSize: 10,
                },
              ],
              [
                { text: "Clinic/Hospital Name:", fontSize: 10 },
                {
                  text: "UhuruMed" || "--",
                  fontSize: 10,
                },
              ],
            ],
          },

          layout: "noBorders",
        },
        {
          text: "Chief Complaints:",
          style: "sectionHeader",
          margin: [0, 20, 0, 8],
        },
        {
          table: {
            widths: ["75%"],
            body: [
              [
                {
                  text: row?.symptoms || "--",
                  fontSize: 10,
                },
              ],
            ],
          },
          layout: "noBorders",
        },
        {
          text: "Medical History:",
          style: "sectionHeader",
          margin: [0, 20, 0, 8],
        },
        {
          table: {
            widths: ["25%", "75%"],
            body: [
              [
                { text: "Medical History:", fontSize: 10 },
                {
                  text: row?.patient?.medicalHistory || "--",
                  fontSize: 10,
                },
              ],
              [
                { text: "Allergiesy:", fontSize: 10 },
                {
                  text: row?.patient?.allergies || "--",
                  fontSize: 10,
                },
              ],
            ],
          },
          layout: "noBorders",
        },
        {
          text: "Prescribed Medications:",
          style: "sectionHeader",
          margin: [0, 10, 0, 10], // left, top, right, bottom
        },
        {
          table: {
            widths: ["25%", "75%"],
            body: [
              [
                { text: "Prescription:", fontSize: 10, margin: [0, 0, 0, 0] },
                {
                  text: row?.consultation?.prescription || "--",
                  fontSize: 10,
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                { text: "Notes:", fontSize: 10, margin: [0, 0, 0, 0] },
                {
                  text: row?.consultation?.notes || "--",
                  fontSize: 10,
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                { text: "Date:", fontSize: 10, margin: [0, 0, 0, 0] },
                {
                  text:
                    moment(row?.consultation?.createdAt).format("LLL") || "--",
                  fontSize: 10,
                  margin: [0, 10, 0, 10], // left, top, right, bottom
                },
              ],
            ],
          },
          layout: {
            paddingTop: () => 5,
            paddingBottom: () => 0,
            paddingLeft: () => 10,
            paddingRight: () => 0,
          },
        },

        {
          table: {
            widths: ["25%", "75%"],
            body: [
              [
                {
                  text: "Follow-up Date:",
                  fontSize: 10,
                  margin: [0, 10, 0, 10], // left, top, right, bottom
                },
                {
                  text:
                    moment(row?.consultation?.followUpDate).format("lll") ||
                    "--",
                  fontSize: 10,
                  margin: [0, 10, 0, 10], // left, top, right, bottom
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
      footer: function (currentPage, pageCount) {
        return {
          margin: [40, 10],
          fontSize: 8,
          alignment: "center",
          stack: [
            {
              text: "Hospital Policies: All patients must carry a valid photo ID. Claims must be submitted within 30 days of treatment. Pre-authorization required for planned procedures. Emergency cases must be reported within 24 hours. Incomplete forms may delay processing. Policies may change without notice.\n Address: 19 Kofi Annan Street, Airport Residential Area, Accra, Ghana \n Phone: 0537587588 \n Email: info@uhurucare.com",
            },
          ],
        };
      },
      styles: {
        invoiceTitle: {
          fontSize: 22,
          bold: true,
          color: "#00077CC",
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: "#154360",
        },
        footer: {
          fontSize: 11,
          italics: true,
          color: "#7D6608",
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("Invoice.pdf");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const birthday = userData?.dateOfBirth
    ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
    : "";

  const patientData = {
    "Patient Name": userData?.firstName ?? "__",
    "Date of Birth": birthday ?? "__",
    Gender: userData?.gender,
    Email: userData?.email,
    Phone: userData?.phone,
    Address: userData?.address,
  };

  const visitData = {
    Medical: userData?.medicalHistory,
    Allergies: userData?.allergies,
    "Blood Group": userData?.bloodGroup,
    Height: userData?.height,
    Weight: userData?.weight,
  };

  const insuranceData = {
    Provider: "Blue Cross",
    Plan: "Premium Plus",
    "Member ID": "BC12345678",
    "Valid Until": "12/31/2025",
  };

  // Additional data for right side papers
  const medicationData = {
    "Medication Name": "Atorvastatin",
    Dosage: "10 mg",
    Frequency: "Once daily",
    Duration: "6 months",
    "Start Date": "01/01/2025",
    "Prescribing Doctor": "Dr. John Smith",
    Pharmacy: "Main Street Pharmacy",
    "Refills Left": 2,
    Instructions: "Take with food in the evening",
    "Side Effects": "Muscle pain, dizziness",
    Severity: "Moderate",
  };

  const rows = [{}];

  const allergyData = {
    Allergies: "Penicillin",
    Reaction: "Rash",

    "Last Reaction Date": "04/15/2023",
    Plan: "Premium Plus",
    "Medication Status": "Active",
  };

  const paperStyle = {
    borderColor: "#c6d9ec",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    marginTop: "10px",
  };

  const headerBoxStyle = {
    backgroundColor: "#e6f0fb",
    padding: "10px 16px",
    borderBottom: "1px solid #c6d9ec",
  };

  const labelValueBoxStyle = {
    display: "flex",
    justifyContent: "space-between",
    paddingY: "4px",
    gap: { xs: "4rem", md: "20rem" },
  };

  const handleRowClick = (row) => {
    setSelectedDoctor(row);
  };

  useEffect(() => {
    if (doctors?.length > 0) {
      setSelectedDoctor(doctors[0]);
    }
  }, [doctors]);

  const getAllDoctors = async () => {
    const token = window.localStorage.getItem("UhuruMedToken");
    setLoading(true);

    try {
      const response = await axios({
        method: "GET",
        url: ApiConfig.appointmentUserList,
        headers: {
          authorization: `Bearer ${token}`,
        },
        // params: {
        //   page: page,
        //   limit: 200,
        //   search: searchQuery,
        // },
      });
      console.log("successsuccess", response?.data?.success);
      if (response?.data?.error === "false") {
        setLoading(false);

        console.log("responseresponse", response);
        setDoctors(response?.data?.data);
        // setTotalPages(response?.data?.data?.[0]?.count);
      }
    } catch (error) {
      setDoctors([]);
      setLoading(false);

      console.log("errorerror", error);
      return error?.response;
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <Container maxWidth="xxl">
      <Box mb={3} sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="ELECTRONIC MEDICAL RECORD" />
          <Tab label="MEDICAL REPORT" />
        </Tabs>
      </Box>
      {value === 1 ? (
        <>
          <SubscribeUserList />
        </>
      ) : (
        <>
          <Box>
            <Box
              mb={2.5}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: "30px",
                  fontWeight: "700",
                  fontFamily: "rubik",
                }}
              >
                {value === 1 ? "Medical Report" : "Electronic Medical Record"}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {/* Left column */}
              <Grid item xs={12} sm={6} md={6}>
                {/* Patient Profile */}
                <Paper variant="outlined" sx={paperStyle}>
                  <Box sx={headerBoxStyle}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#1a1a1a" }}
                    >
                      Patient Profile
                    </Typography>
                  </Box>

                  <Box sx={{ padding: "16px" }}>
                    {Object.entries(patientData).map(([label, value]) => (
                      <Box key={label} sx={labelValueBoxStyle}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#333",
                            fontWeight: 400,
                            fontSize: "14px",
                          }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#000",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          {value != null ? value : "N/A"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* Medical History */}
                <Paper variant="outlined" sx={paperStyle}>
                  <Box sx={headerBoxStyle}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#1a1a1a" }}
                    >
                      Medical History
                    </Typography>
                  </Box>

                  <Box sx={{ padding: "16px" }}>
                    {Object.entries(visitData).map(([label, value]) => (
                      <Box key={label} sx={labelValueBoxStyle}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#333",
                            fontWeight: 400,
                            fontSize: "14px",
                          }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#000",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          {value != null ? value : "N/A"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Right column */}
              <Grid item xs={12} sm={6} md={6}>
                {/* Medication Details */}
                <Paper variant="outlined" sx={paperStyle}>
                  <Box sx={headerBoxStyle}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#1a1a1a" }}
                    >
                      Medication Details
                    </Typography>
                  </Box>
                  <TableContainer
                    component={Paper}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#fff",
                      borderRadius: "8px",
                      overflow: "auto",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
                            Doctor Name
                          </TableCell>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
                            Appointment Date
                          </TableCell>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
                            Amount
                          </TableCell>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
                            Slot Time
                          </TableCell>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
                            Specialization
                          </TableCell>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <CircularProgress size={24} />
                            </TableCell>
                          </TableRow>
                        ) : doctors?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No data found
                            </TableCell>
                          </TableRow>
                        ) : (
                          doctors?.slice(0, 4)?.map((row, idx) => (
                            <TableRow
                              key={idx}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.1)",
                                cursor: "pointer",
                              }}
                              onClick={() => handleRowClick(row)} // <-- Your click handler
                              hover
                            >
                              <TableCell sx={{ color: "#000" }}>
                                {row?.doctorName?.length > 12
                                  ? `${row.doctorName.slice(0, 12)}...`
                                  : row?.doctorName}
                              </TableCell>

                              <TableCell sx={{ color: "#000" }}>
                                {moment(row?.scheduledTime).format("lll")}
                              </TableCell>
                              <TableCell sx={{ color: "#000" }}>
                                {row?.paymentAmount}
                              </TableCell>
                              <TableCell sx={{ color: "#000" }}>
                                {row?.slotTime}
                              </TableCell>

                              <TableCell sx={{ color: "#000" }}>
                                {row?.specialization?.length > 12
                                  ? `${row.specialization.slice(0, 12)}...`
                                  : row?.specialization}
                              </TableCell>
                              <TableCell sx={{ color: "#000" }}>
                                <IconButton onClick={() => pdfDownload(row)}>
                                  <BsCloudDownloadFill color="#000" size={20} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* <Box sx={{ padding: "16px" }}>
            {Object.entries(medicationData).map(([label, value]) => (
              <Box key={label} sx={labelValueBoxStyle}>
                <Typography
                  variant="body2"
                  sx={{ color: "#333", fontWeight: 400, fontSize: "14px" }}
                >
                  {label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#000", fontWeight: 500, fontSize: "14px" }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box> */}
                </Paper>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "5px",
                  }}
                >
                  <Button
                    style={{ color: "#2e5ad5" }}
                    onClick={handleAppoinmet}
                  >
                    View More
                  </Button>
                </Box>

                <Paper variant="outlined" sx={paperStyle}>
                  <Box sx={headerBoxStyle}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#1a1a1a" }}
                    >
                      SOAP Note
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Symptoms :
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#000",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                      >
                        {selectedDoctor?.symptoms}
                        {/* {doctors?.[0]?.symptoms} */}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Consultation :
                      </Typography>
                      {/* <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: 500, fontSize: "14px" }}
              >
                Diagnosis : {selectedDoctor?.consultation?.diagnosis ?? "__"}
              </Typography> */}
                      <Box mt={1} sx={{ maxWidth: "470px" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#000",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Notes : {selectedDoctor?.consultation?.notes ?? "__"}
                        </Typography>
                      </Box>
                      <Box mt={1} sx={{ maxWidth: "470px" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#000",
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Prescription :{" "}
                          {selectedDoctor?.consultation?.prescription ?? "__"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {selectedDoctor?.consultation?.diagnosis && (
                        <a
                          href={selectedDoctor?.consultation?.diagnosis}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Avatar
                            src={selectedDoctor?.consultation?.diagnosis}
                            alt="User"
                            sx={{
                              width: 120,
                              height: 120,
                              objectFit: "fill",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          />
                        </a>
                      )}
                      {selectedDoctor?.consultation?.diagnosis && (
                        <Typography
                          component="a"
                          href={selectedDoctor?.consultation?.diagnosis} // replace with your desired URL
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "14px",
                            textAlign: "center",
                            color: "#2e5ad5",
                            textDecoration: "underline",
                            cursor: "pointer",
                            display: "block", // ensures textAlign works properly
                          }}
                        >
                          Click here
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
                {/* Allergy Information */}
                {/* <Paper variant="outlined" sx={paperStyle}>
          <Box sx={headerBoxStyle}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#1a1a1a" }}
            >
              Allergy Information
            </Typography>
          </Box>

          <Box sx={{ padding: "16px" }}>
            {Object.entries(allergyData).map(([label, value]) => (
              <Box sx={{ marginTop: "1.5px" }}>
                <Box key={label} sx={labelValueBoxStyle}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#333", fontWeight: 400, fontSize: "14px" }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#000", fontWeight: 500, fontSize: "14px" }}
                  >
                    {value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper> */}
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Record;
