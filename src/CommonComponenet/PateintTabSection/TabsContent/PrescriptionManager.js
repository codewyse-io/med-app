import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ApiConfig from "../../../ApiConfig/ApiConfig";

const dummyDrugs = [
  {
    name: "Amoxicillin",
    strength: "500mg Capsule",
    dosage: "1 capsule",
    frequency: "3x daily",
    duration: "7 days",
    route: "Oral",
    notes: "Take with food.",
  },
  {
    name: "Paracetamol",
    strength: "500mg Tablet",
    dosage: "2 tablets",
    frequency: "As needed (max 4x daily)",
    duration: "5 days",
    route: "Oral",
    notes: "For fever.",
  },
  {
    name: "Diclofenac",
    strength: "50mg Tablet",
    dosage: "1 tablet",
    frequency: "2x daily",
    duration: "3 days",
    route: "Oral",
    notes: "For pain.",
  },
  {
    name: "Ciprofloxacin",
    strength: "250mg Tablet",
    dosage: "1 tablet",
    frequency: "2x daily",
    duration: "10 days",
    route: "Oral",
    notes: "Complete full course.",
  },
  {
    name: "Prednisolone",
    strength: "5mg Tablet",
    dosage: "1 tablet",
    frequency: "Once daily",
    duration: "5 days",
    route: "Oral",
    notes: "Taper off as directed.",
  },
  {
    name: "Salbutamol",
    strength: "100mcg Inhaler",
    dosage: "2 puffs",
    frequency: "As needed",
    duration: "Until finished",
    route: "Inhaled",
    notes: "For asthma relief.",
  },
];

const PrescriptionManager = ({ appointmentData, patientId }) => {
  const [selectedDrug, setSelectedDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [route, setRoute] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [drugsList, setDrugsList] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const handleSearchDrug = async () => {
    const token = window.localStorage.getItem("UhuruMedToken");
    try {
      const response = await axios.get(ApiConfig.searchDrug, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          query: selectedDrug,
        },
      });
      if (response.status === 200) {
        response.data.drugGroup.conceptGroup?.forEach((drugGroup) => {
          drugGroup.conceptProperties?.forEach((drug) => {
            setDrugsList((prev) => [...prev, drug.synonym]);
          });
        });
      }
    } catch (error) {
      console.error("Error fetching drug:", error);
    }
  };

  useEffect(() => {
    handleSearchDrug();
  }, [selectedDrug]);

  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const addToPrescription = async () => {
    const token = window.localStorage.getItem("UhuruMedToken");
    const data = {
      doctorId: userData?.id,
      patientId: patientId,
      appointmentId: appointmentData?.id,
      instructions: notes,
      eSign: true,
      drugs: [
        {
          drugName: selectedDrug,
          dosage: dosage,
          frequency: frequency,
          route: route,
          duration: duration,
          instructions: notes,
        },
      ],
    };
    console.log("data", data);
    try {
      const response = await axios({
        method: "post",
        url: ApiConfig.postPrescription,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      });
      if (response.status === 200) {
        console.log(response.data);
        fetchPrescriptions();
      }
    } catch (error) {
      console.error("Error Adding prescription:", error);
    }
  };

  const fetchPrescriptions = async () => {
    const token = window.localStorage.getItem("UhuruMedToken");
    try {
      const response = await axios.get(ApiConfig.getPrescriptions, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          doctorId: userData?.id,
          patientId: patientId,
          appointmentId: appointmentData?.id,
        },
      });
      console.log("response", response.data);
      if (response.status === 200) {
        setPrescriptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [appointmentData]);

  const handleDelete = async (drug) => {
    const token = window.localStorage.getItem("UhuruMedToken");
    try {
      const response = await axios.delete(
        `${ApiConfig.deletePrescriptionDrug}/${drug.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response.data);
      if (response.status === 200) {
        fetchPrescriptions();
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const [prescriptionId, setPrescriptionId] = useState(null);

  // Set the first available prescription ID when prescriptions change
  useEffect(() => {
    if (prescriptions.length > 0 && !prescriptionId) {
      prescriptions.map((prescription) => {
        prescription.drugs.map((drug) => {
          console.log("prescriptionId", drug?.prescriptionId);
          if (drug?.prescriptionId) {
            setPrescriptionId(drug?.prescriptionId);
          }
        });
      });
    }
  }, [prescriptions, prescriptionId]);

  const handleGeneratePrescription = async () => {
    if (!prescriptionId) {
      console.error("No prescription ID available");
      return;
    }
    
    const token = window.localStorage.getItem("UhuruMedToken");
    try {
      const response = await axios(
        `${ApiConfig.generatePrescription}/${prescriptionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/pdf',
          },
        }
      );
      
      if (response.status === 200) {
        // Create a blob from the PDF stream
        const file = new Blob([response.data], { type: 'application/pdf' });
        // Create a URL for the blob
        const fileURL = URL.createObjectURL(file);
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `prescription-${prescriptionId}.pdf`);
        // Append to body, trigger click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Revoke the blob URL
        URL.revokeObjectURL(fileURL);
        
        fetchPrescriptions();
      }
    } catch (error) {
      console.error("Error generating prescription:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={4}>
        {/* LEFT PANEL */}
        <Grid item size={5}>
          <Typography variant="h6" mb={2}>
            Prescription Entry
          </Typography>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Drug Search
              </Typography>
              <Autocomplete
                freeSolo
                options={drugsList}
                value={selectedDrug}
                onChange={(event, newValue) => {
                  setSelectedDrug(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setSelectedDrug(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search for drug (e.g., 'Amoxicillin 500mg Capsule')"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Prescription Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Dosage</InputLabel>
                    <Select
                      value={dosage}
                      label="Dosage"
                      onChange={(e) => setDosage(e.target.value)}
                    >
                      <MenuItem value="1 capsule">1 capsule</MenuItem>
                      <MenuItem value="2 tablets">2 tablets</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={frequency}
                      label="Frequency"
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <MenuItem value="Once daily">Once daily</MenuItem>
                      <MenuItem value="2x daily">2x daily</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Route</InputLabel>
                    <Select
                      value={route}
                      label="Route"
                      onChange={(e) => setRoute(e.target.value)}
                    >
                      <MenuItem value="Oral">Oral</MenuItem>
                      <MenuItem value="Inhaled">Inhaled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={duration}
                      label="Duration"
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <MenuItem value="5 days">5 days</MenuItem>
                      <MenuItem value="7 days">7 days</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={12}>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="e.g., Take with food, complete full course"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Grid>
                {/* <Grid item size={12}>
                  <Button
                    sx={{
                      border: "1px solid gray",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "10px 24px",
                      color: "text.primary",
                      width: "max-content",
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "#000",
                      },
                    }}
                  >
                    Auto-fill dose
                  </Button>
                </Grid> */}
                <Grid item size={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: "#42a5f5" }}
                    onClick={addToPrescription}
                  >
                    Add to Prescription
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT PANEL */}
        <Grid item size={7}>
          <Typography variant="h6" mb={2}>
            Prescribed Drugs
          </Typography>
          <Grid container spacing={2}>
            {prescriptions.map((prescription) => {

              return prescription.drugs.map((drug, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1">
                          {drug.drugName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: "#e0f7fa",
                            px: 1,
                            py: 0.3,
                            borderRadius: 1,
                            fontWeight: "bold",
                          }}
                        >
                          Active
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {drug.strength}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Dosage:</strong> {drug.dosage}
                        <br />
                        <strong>Frequency:</strong> {drug.frequency}
                        <br />
                        <strong>Route:</strong> {drug.route}
                        <br />
                        <strong>Duration:</strong> {drug.duration}
                        <br />
                        <strong>Notes:</strong> {drug.notes}
                      </Typography>

                      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                        {/* <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton> */}
                        <IconButton
                          onClick={() => handleDelete(drug)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ));
            })}
          </Grid>

          {/* E-sign Button */}
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleGeneratePrescription}
              sx={{ backgroundColor: "#42a5f5", color: "#fff" }}
            >
              E-sign & Generate PDF
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrescriptionManager;
