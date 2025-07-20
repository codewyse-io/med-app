import { Box, Button, Collapse } from "@mui/material";
import React from "react";
import VideoCallSection from "../../CommonComponenet/VideoCallSection/VideoCallSection";
import PateintTabSection from "../../CommonComponenet/PateintTabSection/PateintTabSection";
import JitsiComponent from "../../CommonComponenet/VideoCallSection/JitsiMeetComponent";
import { Menu } from "@mui/icons-material";

const VideoCallConsultation = () => {
  const searchQuery = new URLSearchParams(window.location.search);
  const meetingUrl = searchQuery.get("meetingUrl");
  const attendee = searchQuery.get("attendee");
  const appointmentId = searchQuery.get("appointmentId");
  const patientId = searchQuery.get("patientId");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userType = localStorage.getItem("userType");

  const meetingId = meetingUrl.split("/").pop();
  console.log("meetingIdmeetingId", meetingId);
  const [openPatientTab, setOpenPatientTab] = React.useState(false);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f5fa", py: 4, px: 0 }}>
      <Box
        sx={{
          mx: "auto",
          maxWidth: 1440,
          display: "flex",
          flexDirection: "row",
          gap: 2,
          position: "relative",
          minHeight: 600, // adjust as needed for your Jitsi area
        }}
      >
        <JitsiComponent
          meetingId={meetingId}
          appointmentId={appointmentId}
          displayName={userType === "doctor" ? `Dr. ${userData?.firstName} ${userData?.lastName}` : `${userData?.firstName} ${userData?.lastName}`}
        />
        {attendee === "doctor" && (
          <>
            <Button
  onClick={() => setOpenPatientTab((prev) => !prev)}
  sx={{ position: "absolute", top: 16, right: 16, zIndex: 1201 }}
  variant="contained"
  startIcon={<Menu />}
>
  {openPatientTab ? "Hide Patient Information & History" : "Show Patient Information & History"}
</Button>
            <Collapse in={openPatientTab} unmountOnExit>
              <Box
                sx={{
                  position: "absolute",
                  top: 60,
                  right: 16,
                  zIndex: 1200,
                  width: 1400,
                  maxHeight: "80vh",
                  overflowY: "auto",
                  bgcolor: "#fff",
                  boxShadow: 6,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <PateintTabSection
                  patientId={patientId}
                  appointmentId={appointmentId}
                />
              </Box>
            </Collapse>
          </>
        )}
      </Box>
    </Box>
  );
};

export default VideoCallConsultation;
