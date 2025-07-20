import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
  Chip,
  Divider,
  SvgIcon,
} from "@mui/material";
import axios from "axios";
import ApiConfig from "../../ApiConfig/ApiConfig";
import PateintDetailsTab from "./TabsContent/PateintDetailsTab";
import ConsultNotesTab from "./TabsContent/ConsultNotesTab";
import PreviousVisits from "./TabsContent/PreviousVisits";
import PrescriptionManager from "./TabsContent/PrescriptionManager";
import ClinicalWorks from "./TabsContent/ClinicalWorks";

const PateintTabSection = ({ patientId, appointmentId }) => {
  const tabLabels = [
    "Patient Info",
    "Consult Notes",
    "Previous Visits",
    "Prescriptions",
    "Lab Results",
  ];
  const [appointmentData, setAppointmentData] = useState({});
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState(0);

  useEffect(() => {
    console.log("appointmentIdappointmentId", appointmentId);
    if (appointmentId) {
      getAppointmentDetails();
    }
  }, [appointmentId]);

  const getAppointmentDetails = async () => {
    const token = window.localStorage.getItem("UhuruMedToken");
    setLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: ApiConfig.doctorAppointmentDetails,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          id: appointmentId,
        },
      });
      console.log("successsuccess", response?.data?.success);
      if (response?.data?.error === "false") {
        setLoading(false);
        setAppointmentData(response?.data?.data);
        console.log("response?.data?.data", response?.data?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log("errorerror", error);
      return error?.response;
    }
  };
  return (
    <Box
      sx={{
        width: "70vw",
        bgcolor: "#fff",
        p: 2,
        borderRadius: 3,
        ml: 3,
        minHeight: 450,
        boxShadow: 1,
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2, background: "#F7F7F7FF", borderRadius: "6px" }}
      >
        {tabLabels.map((label, index) => (
          <Tab sx={{}} key={index} label={label} />
        ))}
      </Tabs>

      {/* Tab 0: Patient Info */}
      {tab === 0 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <PateintDetailsTab appointmentData={appointmentData} />
          </CardContent>
        </Card>
      )}

      {/* Placeholder tabs - replace with actual content later */}
      {tab === 1 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <ConsultNotesTab appointmentData={appointmentData}/>
            {/* <Typography variant="body1">Consult Notes go here...</Typography> */}
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <PreviousVisits appointmentData={appointmentData} />
            {/* <Typography variant="body1">Previous Visits details...</Typography> */}
          </CardContent>
        </Card>
      )}

      {tab === 3 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <PrescriptionManager appointmentData={appointmentData} patientId={patientId} />
            {/* <Typography variant="body1">Prescription history...</Typography> */}
          </CardContent>
        </Card>
      )}

      {tab === 4 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <ClinicalWorks appointmentData={appointmentData} />
            {/* <Typography variant="body1">Lab Results listed here...</Typography> */}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PateintTabSection;
