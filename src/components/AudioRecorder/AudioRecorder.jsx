import React, { forwardRef, useImperativeHandle, useState, useRef, useCallback } from 'react';
import { AudioRecorder as VoiceRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { Box, CircularProgress, Typography } from '@mui/material';

const AudioRecorder = forwardRef(({ onRecordingComplete, autoStart = false }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const recorderControls = useAudioRecorder();
  const recorderRef = useRef(null);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    startRecording: () => {
      if (recorderControls.startRecording) {
        recorderControls.startRecording();
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },
    stopRecording: () => {
      if (recorderControls.stopRecording) {
        recorderControls.stopRecording();
        return true;
      }
      return false;
    },
    isRecording: () => isRecording
  }));

  // Handle recording state changes
  React.useEffect(() => {
    setIsRecording(recorderControls.isRecording);
  }, [recorderControls.isRecording]);

  // Auto-start if needed
  React.useEffect(() => {
    if (autoStart && recorderControls.startRecording) {
      recorderControls.startRecording();
    }
  }, [autoStart, recorderControls]);

  // Handle recording completion
  const handleRecordingComplete = useCallback((blob) => {
    console.log('Recording complete, blob size:', blob.size);
    if (onRecordingComplete) {
      onRecordingComplete(blob);
    }
  }, [onRecordingComplete]);

  // This is a background component, so we don't render any UI
  return (
    <div style={{ display: 'none' }}>
      <VoiceRecorder
        ref={recorderRef}
        onRecordingComplete={handleRecordingComplete}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        onStartRecording={recorderControls.startRecording}
        onStopRecording={recorderControls.stopRecording}
        recorderControls={recorderControls}
      />
    </div>
  );
});

export default AudioRecorder;
