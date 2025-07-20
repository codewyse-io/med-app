// ConsultNotesTab.tsx or ConsultNotesTab.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
} from "@mui/icons-material";
import TextareaAutosize from "@mui/material/TextareaAutosize"; // Fix: from material not base
import axios from "axios";
import ApiConfig from "../../../ApiConfig/ApiConfig";

// Suppress ResizeObserver warning in dev
const suppressResizeObserverWarning = () => {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("ResizeObserver loop completed")
    ) {
      return;
    }
    originalError(...args);
  };
};

suppressResizeObserverWarning();

const sections = [
  {
    title: "Chief Complaint",
    content:
      "Patient reports worsening persistent headache over the past 3 days, primarily frontal and temporal, rated 7/10 at its peak. Reports a throbbing sensation, aggravated by light and sound.",
  },
  {
    title: "Assessment",
    content:
      "45-year-old female presenting with acute exacerbation of headache, consistent with probable migraine or tension-type headache, possibly stress-induced. Red flag symptoms for secondary headache causes are absent on initial assessment. Headache characteristics align with previous migraine episodes but with increased severity and frequency. Differential includes cluster headache, but presentation is atypical.",
  },
  {
    title: "History of Present Illness",
    content:
      "History of migraines since adolescence, typically well-controlled with Sumatriptan 50mg PRN. Denies recent fevers, neck stiffness, visual changes, or focal neurological deficits. No recent head trauma. Patient notes increased work-related stress over the past month. Last menstrual period 2 weeks ago. No new medications or supplements started recently. Family history of migraines present.",
  },
  {
    title: "Plan",
    content:
      "1. Continue current migraine prophylactic (Topiramate 50mg BID). 2. Prescribe Sumatriptan 100mg (12 tabs, not 6) for acute migraine attacks. 3. Suggest Ibuprofen 600mg PRN for less severe tension headaches. 4. Advise stress reduction techniques, including daily mindfulness exercises and regular physical activity. 5. If headaches persist, worsen, or develop new neurological symptoms, consider brain MRI. 6. Educate on migraine triggers and appropriate use of acute medications.",
  },
];

const SectionCard = ({ title, initialContent, setFormattedContent }) => {
  console.log("initialContent in SectionCard", initialContent);
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef(null);
  const [hasSelection, setHasSelection] = useState(false);

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      setHasSelection(selectionStart !== selectionEnd);
    }
  };

  const handleFormat = (formatType) => {
    if (!textareaRef.current || !hasSelection) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = selectedText;

    switch (formatType) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "bullet":
        formattedText = selectedText
          .split("\n")
          .map((line) => (line.trim() ? `• ${line.trim()}` : ""))
          .join("\n");
        break;
      default:
        return;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);

    setContent(newContent);
    // convert this string back to formatted content of array of objects of speaker and text
    const formattedContentArray = newContent.split("\n\n").map((item) => {
      const speaker = item.split(":")[0].trim();
      const text = item.split(":")[1].trim();
      return { speaker, text };
    });
    setFormattedContent(formattedContentArray);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      setHasSelection(false);
    }, 0);
  };

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  return (
    <Card
      variant="outlined"
      sx={{ width: "100%", padding: "10px", overflow: "hidden" }}
    >
      <CardContent>
        <Typography fontWeight={600} gutterBottom>
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 1,
            background: "#F5F5F5",
            borderRadius: "6px",
            padding: "6px",
            width: "fit-content",
          }}
        >
          <Tooltip title="Bold">
            <IconButton
              onClick={() => handleFormat("bold")}
              size="small"
              disabled={!hasSelection}
              sx={{ opacity: hasSelection ? 1 : 0.5 }}
            >
              <FormatBold fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton
              onClick={() => handleFormat("italic")}
              size="small"
              disabled={!hasSelection}
              sx={{ opacity: hasSelection ? 1 : 0.5 }}
            >
              <FormatItalic fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton
              onClick={() => handleFormat("underline")}
              size="small"
              disabled={!hasSelection}
              sx={{ opacity: hasSelection ? 1 : 0.5 }}
            >
              <FormatUnderlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bulleted List">
            <IconButton
              onClick={() => handleFormat("bullet")}
              size="small"
              disabled={!hasSelection}
              sx={{ opacity: hasSelection ? 1 : 0.5 }}
            >
              <FormatListBulleted fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#fafafa",
            overflow: "auto",
            width: "100%",
            minHeight: "120px",
          }}
        >
          <TextareaAutosize
            ref={textareaRef}
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleTextSelection}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: "1.5",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const ConsultNotesTab = ({ appointmentData }) => {
  console.log("appointmentData", appointmentData);
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

  const [formattedContent, setFormattedContent] = useState([]);

  const fetchFormattedContent = async () => {
    try {
      const response = await axios.get(
        `${ApiConfig.getConsultNotes}/${appointmentData?.id}`
      );
      const data = response.data;
      if (response.status === 200) {
        console.log("data", data);
        const initialContent = data?.data?.formattedTranscript
          ?.map((note) => `${note.speaker}: ${note.text}`)
          .join("\n\n");
        console.log("initialContent", initialContent);
        setFormattedContent(initialContent);
      }
    } catch (error) {
      console.error("Error fetching formatted content:", error);
    }
  };

  useEffect(() => {
    fetchFormattedContent();
  }, []);

  // const handleSaveNotes = async () => {
  //   try {

  //     const response = await axios.post(
  //       `${ApiConfig.saveConsultNotes}/${appointmentData?.id}`,
  //       { notes: formattedContent }
  //     );
  //     if (response.status === 200) {
  //       console.log("Notes saved successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error saving notes:", error);
  //   }
  // };
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Patient:</strong> {appointmentData?.patientName}
            </Typography>
            <Typography variant="subtitle1">
              <strong>DOB:</strong> {new Date(appointmentData?.patient?.dateOfBirth).toISOString().split("T")[0]}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Age:</strong>{" "}
              {calculateAge(appointmentData?.patient?.dateOfBirth)} years old
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1">
            <strong>Date:</strong>{" "}
            {new Date(appointmentData?.slot.date).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Time:</strong>{" "}
            {new Date(appointmentData?.slot.date).toLocaleTimeString()}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Type:</strong> {appointmentData?.type}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Last Saved: {appointmentData?.lastSaved}
          </Typography>
        </Box>
      </Box>

      {/* Sections */}
      <Box width="100%">
        <SectionCard
          title={"Video Consultation Notes"}
          initialContent={formattedContent}
          setFormattedContent={setFormattedContent}
        />
      </Box>

      {/* Buttons */}
      <Divider sx={{ my: 4 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* <Button
          sx={{
            border: "1px solid gray",
            fontWeight: "bold",
            borderRadius: "10px",
            textTransform: "none",
            px: 4,
          }}
        >
          Save Draft
        </Button> */}
        <Button
          sx={{
            fontWeight: "bold",
            borderRadius: "10px",
            textTransform: "none",
            px: 6,
            color: "#fff",
            background: "#2e5ad5",
            "&:hover": {
              backgroundColor: "#1a4bc8",
            },
          }}
        >
          Finalize Note
        </Button>
        {/* <Button
          sx={{
            border: '1px solid gray',
            fontWeight: 'bold',
            borderRadius: '10px',
            textTransform: 'none',
            px: 4,
          }}
        >
          Print
        </Button> */}
      </Box>
    </Box>
  );
};

export default ConsultNotesTab;
