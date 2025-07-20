import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  Container,
  Grid,
  InputAdornment,
  Divider,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import { ExpandMore, Search, Science } from "@mui/icons-material";
import axios from "axios";
import ApiConfig from "../../../ApiConfig/ApiConfig";
const testSections = [
  {
    key: "bloodTests",
    title: "Blood Tests",
    description: "Select blood test options here",
  },
  {
    key: "radiology",
    title: "Radiology",
    description: "Select radiology test options here",
  },
  {
    key: "cardiology",
    title: "Cardiology",
    description: "Select cardiology test options here",
  },
];

const ClinicalWorks = ({ appointmentData }) => {
  const token = window.localStorage.getItem("UhuruMedToken");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [testsCategoryData, setTestsCategoryData] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [query, setQuery] = useState("");

  const handleQuerySearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ApiConfig.getLabOrder, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          query: query,
        },
      });
      console.log("response", response);
      if (response.status === 200) {
        setSearchResults(response?.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleQuerySearch();
  }, [query]);

  const fetchTestsCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ApiConfig.getLabtests, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response);
      if (response.status === 200) {
        setTestsCategoryData(response?.data?.categories);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestsCategory();
  }, []);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleTestSelect = (test) => {
    setSelectedTests((prev) => [...prev, test]);
  };

  const handleTestRemove = (test) => {
    setSelectedTests((prev) => prev.filter((t) => t.id !== test.id));
  };

  const handlePreviewOrderPDF = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        ApiConfig.postLabOrderPDF,
        {
          patientId: appointmentData?.patient?.id,
          tests: selectedTests,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      if (response.status === 200) {
        const url = response?.data?.pdfUrl;
        if (url) {
          window.open(url, "_blank");
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        ApiConfig.createLabOrder,
        {
          patientId: appointmentData?.patient?.id,
          tests: selectedTests,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      if (response.status === 200) {
        setSearchResults(response?.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ minHeight: "100vh", minWidth: "50vw" }}>
      {/* Header */}
      {/* <Container maxWidth="xl" sx={{ py: 3 }}> */}
      <Box sx={{ py: 3 }}>
        {/* Main Title and Patient Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Lab & Imaging Order
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Patient: {appointmentData?.patient?.firstName}{" "}
              {appointmentData?.patient?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DOB: {new Date(appointmentData?.patient?.dateOfBirth).toISOString().split("T")[0]}
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              freeSolo
              options={searchResults || []}
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : option.description || option.code || ""
              }
              filterOptions={(x) => x} // disable built-in filtering, use API results
              value={query}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setQuery(newValue);
                } else if (
                  newValue &&
                  (newValue.description || newValue.code)
                ) {
                  setQuery(newValue.description || newValue.code);
                } else {
                  setQuery("");
                }
              }}
              onInputChange={(event, newInputValue) => {
                setQuery(newInputValue);
              }}
              loading={loading}
              renderOption={(props, option) => (
                <li
                  {...props}
                  key={option.code || option.description}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 8,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {option.code}
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "0.96rem",
                      color: "#444",
                    }}
                  >
                    {option.description}
                  </span>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search ICD-10 or Lab Panels..."
                  fullWidth
                  variant="outlined"
                  sx={{ minWidth: "400px" }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {/* {loading ? <span style={{ marginRight: 8 }}>Loading...</span> : null} */}
                        <InputAdornment position="end">
                          <Search color="action" />
                        </InputAdornment>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              getOptionDisabled={(option) =>
                !option || (!option.description && !option.code)
              }
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Left Column - Select Tests by Category */}
          <Grid item size={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "fit-content",
                maxHeight: 500,
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Select Tests by Category
              </Typography>

              {testsCategoryData.map((category) => (
                <Accordion
                  key={category.id}
                  expanded={expanded === category.id}
                  onChange={handleChange(category.id)}
                  sx={{ mb: 1, boxShadow: "none", border: "1px solid #e0e0e0" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <Typography>{category.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">
                      {category.description}
                    </Typography>
                    {Array.isArray(category.tests) &&
                      category.tests.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {category.tests.map((test, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 8,
                                cursor: "pointer",
                              }}
                            >
                              <Checkbox
                                checked={selectedTests.some(
                                  (t) => t.loincCode === test.loincCode
                                )}
                                onChange={() => {
                                  const selected = selectedTests.some(
                                    (t) => t.loincCode === test.loincCode
                                  );
                                  if (selected) {
                                    handleTestRemove(test);
                                  } else {
                                    handleTestSelect(test);
                                  }
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                onClick={() => handleTestSelect(test)}
                                sx={{ cursor: "pointer" }}
                              >
                                {test.name} - {test.loincCode}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item size={5}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                height: "500px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Order Summary ({selectedTests.length})
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Empty State */}
              {selectedTests.length === 0 ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Science
                    sx={{
                      fontSize: 80,
                      color: "#2196f3",
                      mb: 2,
                      opacity: 0.7,
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No tests added yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Search or select from categories to add tests.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    textAlign: "center",
                  }}
                >
                  {selectedTests.map((test, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "18px", fontWeight: 500 }}
                        className="truncate"
                      >
                        {test.name} - {test.loincCode}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: "none" }}
                        onClick={() => handleTestRemove(test)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  //   variant="outlined"
                  sx={{
                    border: "1px solid gray",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    textTransform: "none",
                    padding: "10px 24px",
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",
                    },
                  }}
                  onClick={handlePreviewOrderPDF}
                >
                  Preview Order PDF
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none" }}
                >
                  Add to List
                </Button> */}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {/* </Container> */}
    </Box>
  );
};

export default ClinicalWorks;
