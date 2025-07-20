import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import ApiConfig from "../../../ApiConfig/ApiConfig";
// const visitsData = [
//   {
//     doctor: "Dr. Emily Chen",
//     specialty: "Cardiology",
//     date: "2023-11-15T09:30",
//     notes: "Routine check-up, discussed blood pressure management. Patient reported stable condition.",
//   },
//   {
//     doctor: "Dr. David Lee",
//     specialty: "Dermatology",
//     date: "2023-10-28T14:00",
//     notes: "Evaluation of skin rash on arm. Prescribed topical cream for inflammation.",
//   },
//   {
//     doctor: "Dr. Sarah Miller",
//     specialty: "Pediatrics",
//     date: "2023-09-20T11:00",
//     notes: "Annual physical for child. Vaccinations administered. Discussed developmental milestones.",
//   },
//   {
//     doctor: "Dr. Robert Johnson",
//     specialty: "Orthopedics",
//     date: "2023-08-10T15:45",
//     notes: "Follow-up on knee injury. Patient reported significant improvement after physical therapy.",
//   },
//   {
//     doctor: "Dr. Emily Chen",
//     specialty: "Cardiology",
//     date: "2023-07-01T08:00",
//     notes: "Initial consultation for new patient. Reviewed medical history and ordered lab tests.",
//   },
// ];

export default function PreviousVisits({ appointmentData }) {
  const [search, setSearch] = useState("");
  const date = new Date();
  const [dateFilter, setDateFilter] = useState(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`); // yyyy-mm-dd
  const [doctorFilter, setDoctorFilter] = useState("");

  const [visitsData, setVisitsData] = useState([]);
  useEffect(() => {
    // setDateFilter(`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);
    console.log(dateFilter); // 2025-7-8
  }, [dateFilter]);

  useEffect(() => {
    console.log("doctorFilter", doctorFilter)
    if (doctorFilter) {
      const visites = visitsData.filter((visit) => visit.doctor.firstName + " " + visit.doctor.lastName === doctorFilter);
      setVisitsData(visites);
    }
  }, [doctorFilter]);

  useEffect(() => {
    const fetchVisits = async () => {
      const token = window.localStorage.getItem("UhuruMedToken");
      console.log(appointmentData?.patient?.id);
      try {
        const response = await axios.get(ApiConfig.doctorAppointmentList, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            patientId: appointmentData?.patient?.id,
            toDate: dateFilter,
          },
        });
        console.log("PreviousVisits", response.data);
        setVisitsData(response.data.data.docs);
      } catch (error) {
        console.error("Error fetching visits:", error);
      }
    };
    fetchVisits();
  }, [appointmentData, dateFilter]);

  const filteredVisits =
    visitsData?.length > 0
      ? visitsData.filter((visit) => {
          return (
            visit.doctor?.firstName.toLowerCase().includes(search.toLowerCase()) ||
            visit.doctor?.lastName.toLowerCase().includes(search.toLowerCase())   ||
            (doctorFilter === "" || visit.doctor === doctorFilter) &&
            (dateFilter === "" || visit.date.startsWith(dateFilter))
          );
        })
      : [];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>
        Previous Visits
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "no-wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          label="Search visits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search visits..."
          sx={{
            height: 48,
            minWidth: { xs: "100%", sm: 400 },
            "& .MuiInputBase-root": {
              height: 48,
              fontSize: "14px",
              color: "#333",
              padding: "0 14px",
              borderRadius: 2,
            },
            "& .MuiInputBase-input": {
              fontSize: "15px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0077cc",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0077cc",
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              color: "#555",
            },
          }}
        />

        <TextField
          label="Pick a date"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            height: 48,
            minWidth: { xs: "100%", sm: 250 },
            "& .MuiInputBase-root": {
              height: 48,
              fontSize: "14px",
              color: "#333",
              padding: "0 14px",
              borderRadius: 2,
            },
            "& .MuiInputBase-input": {
              fontSize: "15px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0077cc",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0077cc",
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              color: "#555",
            },
          }}
        />

        <FormControl
          sx={{
            height: 48,
            minWidth: { xs: "100%", sm: 300 },
            flexGrow: { xs: 1, sm: 0 },
            marginLeft: { xs: "0px", md: "-0.5rem" },
          }}
        >
          <Autocomplete
            value={doctorFilter || null}
            onChange={(event, newValue) => setDoctorFilter(newValue)}
            options={[...new Set(visitsData.map((v) => v.doctor.firstName + " " + v.doctor.lastName))]} // Extract doctor names
            getOptionLabel={(option) => option || ""}
            sx={{
              "& .MuiInputBase-root": {
                height: 48,
                fontSize: "14px",
                color: "#333",
                borderRadius: 2,
              },
              "& .MuiInputBase-input": {
                fontSize: "15px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0077cc",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0077cc",
              },
              "& .MuiInputLabel-root": {
                fontSize: "14px",
                color: "#555",
              },
            }}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 4],
                    },
                  },
                ],
              },
              paper: {
                sx: {
                  "& .MuiAutocomplete-option": {
                    color: "#000000DE",
                    fontSize: "16px",
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Filter by Doctor"
                sx={{
                  height: 48,
                  "& .MuiInputBase-root": {
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                  },
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            fullWidth
          />
        </FormControl>
      </Box>
      <Box
        variant="outlined"
        sx={{
          position: "relative",
          borderRadius: "10px",
          padding: "30px",
          border: "1px solid gray",
        }}
      >
        {filteredVisits.map((visit, index) => (
          <Box key={index} sx={{ position: "relative", pl: 3 }}>
            {/* Blue dot */}
            <Box
              sx={{
                position: "absolute",
                top: 18,
                left: 0,
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "blue",
              }}
            />

            <Card variant="outlined" sx={{ mb: 3, borderRadius: "10px" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    Dr. {visit.doctor?.firstName} {visit.doctor?.lastName} ({visit.doctor?.specialization || 'General'})
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {new Date(visit.scheduledTime).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
                <Typography variant="body1">{visit.notes}</Typography>
                {/* <Box mt={1}>
            <Button size="small">More Details</Button>
          </Box> */}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
