import React, { useEffect, useRef, useState, useCallback } from "react";
import AudioRecorder from "../../components/AudioRecorder/AudioRecorder";
import ApiConfig from "../../ApiConfig/ApiConfig";

const JitsiComponent = ({ meetingId, displayName = "User", appointmentId }) => {
  const apiRef = useRef(null);
  const containerRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState(null);

  // Handle recording completion
  const handleRecordingComplete = useCallback(async (blob) => {
    console.log("Meeting recording complete", blob);
    setRecordingBlob(blob);
    // Convert blob to File
    const fileName = `audio_recording_${Date.now()}.wav`;
    const file = new File([blob], fileName, { type: blob.type });
    console.log("Created file:", file);

    // Download the file locally
    // const url = URL.createObjectURL(file);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = fileName;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);

    // Upload file to backend
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('UhuruMedToken');
      const userType = localStorage.getItem('userType');
      const userData = JSON.parse(localStorage.getItem('userData'));
      const url = userType?.toLowerCase() === 'doctor' ? ApiConfig.doctorAudioRecording : ApiConfig.patientAudioRecording;
      if (userType?.toLowerCase() === 'doctor') {
        formData.append('doctorId', userData?.id);
      } else {
        formData.append('patientId', userData?.id);
      }
      formData.append('appointmentId', appointmentId);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("Response", response);
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      console.log('Upload successful:', result);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }, []);

  // Handle meeting end
  const handleMeetingEnd = useCallback(() => {
    console.log("Meeting ended, stopping recording...");
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stopRecording();
    }
    setIsMeetingStarted(false);
  }, []);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = (error) => {
        console.error("Failed to load Jitsi script", error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  };

  const startMeeting = async () => {
    if (!meetingId) {
      console.error("No meeting ID provided");
      return;
    }

    try {
      await loadScript("https://meet.jit.si/external_api.js");

      if (apiRef.current) {
        apiRef.current.dispose();
      }

      const domain = "meet.jit.si";
      const options = {
        roomName: meetingId,
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        userInfo: {
          displayName: displayName || "Anonymous",
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true,
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          
        },
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      // Set up event listeners
      // apiRef.current.on('readyToClose', handleMeetingEnd);
      // apiRef.current.on('videoConferenceLeft', handleMeetingEnd);
      // apiRef.current.on('disposed', handleMeetingEnd);

      // Start meeting
      setIsMeetingStarted(true);
      console.log("Meeting has started");

      // Log participant join events
      apiRef.current.on('participantJoined', (data) => {
        console.log("Participant joined", data);
      });

    } catch (error) {
      console.error("Failed to start Jitsi meeting", error);
    }
  };

  // Start recording when meeting starts
  useEffect(() => {
    if (isMeetingStarted && audioRecorderRef.current) {
      console.log("Starting recording...");
      audioRecorderRef.current.startRecording();
    }
  }, [isMeetingStarted]);

  useEffect(() => {
    if (meetingId) {
      startMeeting();
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [meetingId]);

  // Clean up recording URL when component unmounts
  useEffect(() => {
    return () => {
      if (recordingBlob) {
        URL.revokeObjectURL(recordingBlob);
      }
    };
  }, [recordingBlob]);

  // UI state for progress/status
  const [isRecording, setIsRecording] = useState(true);
  const [progressText, setProgressText] = useState('Recording...');

  // Stop recording handler
  const handleStopRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stopRecording();
      setIsRecording(false);
      setProgressText('Processing...');
    }
  };

  // Update progress when recording completes
  useEffect(() => {
    if (recordingBlob) {
      setProgressText('Recording complete!');
    }
  }, [recordingBlob]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          flex: 1,
          minHeight: "500px",
          position: "relative",
        }}
      />

      {/* Fixed bottom-center recording controls */}
      {isRecording && (
        <div style={{
          position: 'fixed',
          left: '50%',
          bottom: 32,
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          borderRadius: 20,
          padding: '16px 32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>{progressText}</div>
          <button
            onClick={handleStopRecording}
            style={{
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: 16,
              padding: '8px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              marginTop: 4
            }}
          >
            Stop Recording
          </button>
        </div>
      )}

      <AudioRecorder
        ref={audioRecorderRef}
        autoStart={true}
        onRecordingComplete={(blob) => {
          handleRecordingComplete(blob);
          setIsRecording(false);
          setProgressText('Recording complete!');
        }}
      />
    </div>
  );
};

export default JitsiComponent;