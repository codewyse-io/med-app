import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Avatar,
  Button,
  Grid,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import CancelBtn from "./CancelBtn"; // Make sure this is implemented
import { AuthContext } from "../../Context/Auth";
import axios from "axios";
import ApiConfig from "../../ApiConfig/ApiConfig";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";

const today = new Date();
const minDate = new Date(
  today.getFullYear() - 90,
  today.getMonth(),
  today.getDate()
);
const maxDate = new Date(
  today.getFullYear() - 12,
  today.getMonth(),
  today.getDate()
);

// const validationSchema = Yup.object({
//   firstName: Yup.string().required("First name is required"),
//   lastName: Yup.string().required("Last name is required"),
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   mobile: Yup.string().required("Mobile number is required"),
//   birthday: Yup.string()
//     .required("Date of birth is required")
//     .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
//     .test("is-valid-date", "Invalid date", (value) => {
//       const date = new Date(value);
//       return !isNaN(date.getTime());
//     })
//     .test(
//       "is-between-ages",
//       "You must be between 12 and 90 years old",
//       (value) => {
//         const date = new Date(value);
//         return date >= minDate && date <= maxDate;
//       }
//     ),
//   maritalStatus: Yup.string().required("Marital status is required"),
//   Gender: Yup.string().required("Gender is required"),
//   bloodGroup: Yup.string().required("Blood group is required"),
//   weight: Yup.number().required("Weight is required"),
//   height: Yup.number().required("Height is required"),
//   address: Yup.string().required("Address is required"),
//   // insuranceProvider: Yup.string().required("Insurance is required"),
//   // insurancePolicyId: Yup.string().required("Insurance policy Id is required"),
// });
const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z\s'-]+$/, "First name must contain only letters")
    .required("First name is required"),

  lastName: Yup.string()
    .matches(/^[A-Za-z\s'-]+$/, "Last name must contain only letters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  mobile: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid mobile number")
    .required("Mobile number is required"),

  birthday: Yup.string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .test("is-valid-date", "Invalid date", (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test("is-between-ages", "You must be between 12 and 90 years old", (value) => {
      const date = new Date(value);
      return date >= minDate && date <= maxDate;
    }),

  // maritalStatus: Yup.string()
  //   .matches(/^(Single|Married|Divorced|Widowed)$/i, "Invalid marital status")
  //   .required("Marital status is required"),

  Gender: Yup.string()
    .matches(/^(Male|Female|Other)$/i, "Invalid gender")
    .required("Gender is required"),

  bloodGroup: Yup.string().required("Blood group is required"),

  weight: Yup.number()
    .min(1, "Weight must be more than 0")
    .max(500, "Weight must be realistic")
    .required("Weight is required"),

  height: Yup.number()
    .min(30, "Height must be more than 30 cm")
    .max(300, "Height must be realistic")
    .required("Height is required"),

  address: Yup.string().required("Address is required"),

  // insuranceProvider: Yup.string().required("Insurance is required"),
  // insurancePolicyId: Yup.string().required("Insurance policy Id is required"),
});


export default function EditProfile({ open, onClose }) {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [storeImage, setStoreImage] = useState(null);
  console.log("sfgafsgfas", storeImage);

  const userData = auth.userData;

  const birthday = userData?.dateOfBirth
    ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
    : "";
  const patientData = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    mobile: userData?.phone || "",
    birthday: birthday ?? "",
    maritalStatus: userData?.meritalStatus ?? "",
    Gender: userData?.gender ?? "",
    bloodGroup: userData?.bloodGroup ?? "",
    weight: userData?.weight ?? "",
    height: userData?.height ?? "",
    address: userData?.address ?? "",
    history: "",
    insuranceProvider: userData?.allergies ?? "",
    insurancePolicyId: userData?.medicalHistory ?? "",
    doctor: {
      name: "Tiger Nixon",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  };

  useEffect(() => {
    if (userData) {
      setStoreImage(userData?.profilePic);
    }
  }, [userData]);

  const fields = [
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["mobile", "Mobile No."],
    ["email", "Email"],
    ["birthday", "Date of Birth"],
    // ["maritalStatus", "Marital Status"],
    ["Gender", "Gender"],
    ["bloodGroup", "Blood Group"],
    ["weight", "Patient Weight"],
    ["height", "Patient Height"],
    ["address", "Address"],
    ["insuranceProvider", "Allergies"],
    ["insurancePolicyId", "Medical History"],
  ];

  const fieldPairs = Array.isArray(fields)
    ? Array.from({ length: Math.ceil(fields.length / 2) }, (_, i) =>
      fields?.slice(i * 2, i * 2 + 2)
    )
    : [];

  const uploadDataHanlder = async (image) => {
    console.log("dsagasdgsad", image);
    if (!image) return;
    const token = window.localStorage.getItem("adminToken");
    setLoading(true);

    const formData = new FormData();
    formData.append("files", image);

    try {
      const response = await axios.post(ApiConfig.uploadFile, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.error === "false") {
        toast.success(response?.data?.message);
        setStoreImage(response?.data?.data?.secureUrl);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const EditProfileHandler = async (values) => {
    const token = window.localStorage.getItem("UhuruMedToken");
    setLoading(true);
    try {
      const response = await axios({
        method: "PUT",
        url: ApiConfig.updateProfile,
        headers: { authorization: `Bearer ${token}` },
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          phone: values?.mobile,
          countryCode:values?.countryCode,
          // bio: values?.history,
          dateOfBirth: values?.birthday,
          gender: values?.Gender,
          bloodGroup: values?.bloodGroup,
          profilePic: storeImage,
          height: values?.height,
          weight: values?.weight,
          address: values?.address,
          medicalHistory: "ddgsadgsadgs",
          // meritalStatus: values?.maritalStatus,
          ...(values.insurancePolicyId && {
            medicalHistory: values.insurancePolicyId,
          }),
          ...(values.insuranceProvider && {
            allergies: values.insuranceProvider,
          }),
        },
      });
      console.log("successsuccess", response?.data?.success);
      if (response?.data?.error === "false") {
        setLoading(false);

        console.log("jwtTokenjwtToken", response?.data?.data);
        toast.success(response.data.message);
        auth.getProfileData();
        onClose();
        console.log("responseresponse", response);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response.data.message);
      setLoading(false);
      console.log("errorerror", error);
      return error?.response;
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ px: 3, py: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={
              storeImage ||
              "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740"
            }
          />
          <Typography variant="h6">
            {userData?.firstName} {userData?.lastName}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={patientData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          EditProfileHandler(values);
          console.log("Submitted values:", values);
        }}
      >
        {({
          errors,
          touched,
          handleChange,
          handleBlur,
          values,
          setFieldValue,
        }) => (
          <Form>
            <Box mb={3}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    border: "1px solid #e5e5e5",
                    borderRadius: "50%",
                    width: "130px",
                    height: "130px",
                  }}
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  {loading ? (
                    // Show loader
                    <Box
                      display="flex"
                      justifyContent="center"
                      paddingTop="40px"
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Avatar
                      src={
                        storeImage ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740"
                      }
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>

                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => uploadDataHanlder(e.target.files[0])}

                // onChange={(e) => {
                //   const file = e.target.files[0];
                //   if (file) {
                //     setImagePreview(URL.createObjectURL(file));
                //     setFieldValue("image", file);
                //   }
                // }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: "center", paddingTop: "10px" }}
              >
                Upload Profile Photo
              </Typography>
            </Box>
            <DialogContent dividers sx={{ px: 3 }}>
              <Box>
                {fieldPairs?.map((pair, idx) => (
                  <Grid
                    container
                    key={idx}
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 5 }}
                  >
                    {pair?.map(([field, label]) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 1, mt: 1 }}
                        >
                          {label}
                        </Typography>

                        {field === "mobile" ? (
                          <PhoneInput
                            country={"us"}
                            value={values[field]}
                            onChange={(phone, country) => {
                              setFieldValue(field, phone);
                              setFieldValue("countryCode", country.dialCode); // optional, if needed
                            }}
                            inputProps={{
                              name: field,
                              required: true,
                              autoFocus: false,
                              placeholder: "Enter phone number",
                            }}
                            specialLabel=""
                            containerStyle={{ width: "100%" }}
                            inputStyle={{
                              width: "250px",
                              height: "40px",
                              background: "#fff",
                              fontSize: "14px",
                              padding: "0 1px 0 45px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <Field
                            as={TextField}
                            fullWidth
                            variant="outlined"
                            name={field}
                            type={field === "birthday" ? "date" : "text"}
                            value={values[field]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched[field] && Boolean(errors[field])}
                            helperText={touched[field] && errors[field]}
                            FormHelperTextProps={{ style: { marginLeft: 0 } }}
                            InputLabelProps={
                              field === "birthday" ? { shrink: true } : {}
                            }
                            sx={{
                              "& .MuiInputBase-root": {
                                height: 40,
                                fontSize: "14px",
                                width: "250px",
                              },
                              "& fieldset": {
                                borderColor: "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#14B8A6",
                              },
                            }}
                          />
                        )}
                      </Grid>
                    ))}

                  </Grid>
                ))}
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <CancelBtn label="Close" onClick={onClose} />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#2e5ad5",
                  padding: 1,
                  width: "150px",
                  "&:hover": { backgroundColor: "#2e5ad5" },
                  color: "#fff",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}