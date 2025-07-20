import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  Pagination,
  TextField,
  Avatar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  DialogContentText,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { MdModeEditOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { IoEyeSharp } from "react-icons/io5";
import { HiEye } from "react-icons/hi2";

import Btn from "../CommonComponenet/CommonButtons/Btn";
import { MdDelete } from "react-icons/md";
import { MdCancel } from "react-icons/md";

import SearchAppointmentBar from "../CommonComponenet/CommonButtons/SearchAppointmentBar";
import CancelBtn from "../CommonComponenet/CommonButtons/CancelBtn";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { HiMiniVideoCameraSlash } from "react-icons/hi2";
import { BsChatSquareTextFill } from "react-icons/bs";

import AddPointMent from "./AddPointMent";
import { AuthContext } from "../Context/Auth";
import axios from "axios";
import ApiConfig from "../ApiConfig/ApiConfig";
import moment from "moment";
import toast from "react-hot-toast";
import SubscriptionModal from "../CommonComponenet/CommonButtons/SubscriptionModal";

export default function AppointmentUserlist() {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  console.log("dafdsfdas", doctors);
  const theme = useTheme();
  const auth = useContext(AuthContext);
  const userData = auth?.userData;
  const actived = auth?.actived;
  console.log("asdgsadgsadf", actived);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [totalPages, setTotalPages] = useState("");
  console.log("ASfadsfgads", totalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [reason, setReason] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false); // mimic actived

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState({});
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const closeEdit = () => setEditOpen(false);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleReasonQueryChange = (event) => {
    setReason(event.target.value);
  };

  const handleSave1 = (data) => {
    console.log("Appointment Saved:", data);
  };

  const openEdit = (row) => {
    setCurrent(row);
    setEditOpen(true);
  };

  const handleSave = () => {
    // Here you’d call your API or update state:
    // setPatients(p =>
    //   p.map(item =>
    //     item.id === current.id ? current : item
    //   )
    // );
    setEditOpen(false);
  };
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleFieldChange = (field) => (e) => {
    setCurrent((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDeleteConfirm = () => {
    // TODO: Add delete logic here
    setDeleteOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };
  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

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
  const AppointcancelHandler = async (id) => {
    const token = window.localStorage.getItem("UhuruMedToken");
    if (!reason) {
      toast.error("Please enter reason");
      return;
    }
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: ApiConfig.Appointcancel,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          appointmentId: id,
          reason: "Unable to attend due to emergency",
        },
      });
      console.log("successsuccess", response?.data?.success);
      if (response?.data?.error === "false") {
        toast.success(response?.data?.message);
        setDeleteOpen(false);
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      setDoctors([]);
      setLoading(false);
      toast.error(error?.response?.data?.message ?? "Please try again");
      console.log("errorerror", error);
      return error?.response;
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  const patients = [
    {
      img: "/Images/user1.jpg",
      firstName: "07:00	",
      lastName: "01 Jun 2022	",
      phone: "833 - 844 - 0100	",
      status: "Active",
      sex: "1468 Selah Way - Rabat	",
    },
    {
      img: "/Images/user1.jpg",
      firstName: "Angelica",
      lastName: "Ramos",
      phone: "658543469",
      status: "Active",
      sex: "Male",
    },
    {
      img: "/Images/user1.jpg",
      firstName: "Ashton",
      lastName: "Cox",
      phone: "658543469",
      status: "Cancel",
      sex: "Male",
    },
    // Add more dummy patients here
  ];

  return (
    <>
      <Container maxWidth="xxl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontSize: "30px", fontWeight: "700", fontFamily: "rubik" }}
            >
              All Appointment
            </Typography>
            {/* <Typography variant="h5" fontWeight="medium" >
              Add New Appointment
            </Typography> */}
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap:"wrap",
          '@media (max-width:676px)': {
            gap: 0,
            display: "block",
            width: "100%"
          }

           }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by doctor name"
              type="search"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                height: "40px",
                marginTop: {
                  xs: "10px",
                  md: "0px",
                },
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  paddingRight: 0,
                  padding: "2.5px 0px",
                  borderRadius: "10px",
                  fontSize: "14px",
                },
                '@media (max-width: 676px)': {
                  minWidth: "100%",
                  width: "100%",
                  marginBottom: "5px",
                }
              }}
              InputProps={{
                sx: { paddingRight: "8px" },
              }}
            />


            <Btn
              label="New Appointment"
              onClick={() => {
                setOpen(true);
              }}
              sx={{
                '@media (max-width: 676px)': {
                  width: "100%",
                }
              }}

              
              // onClick={() => {
              //   if (!actived || Object.keys(actived)?.length === 0) {
              //     setOpenModal(true)
              //   } else {
              //     setOpen(true);
              //   }
              // }}
            />
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            height: "auto",
            background: "#fff",
            borderRadius: "10px",
            marginTop: "20px",
            width: { xs: "100% !important", md: "100% !important" },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Serial No",
                  "Time",
                  "Date",
                  "Appointment Date",
                  "Doctor Name",
                  "Phone",
                  "Address",
                  "Payment Type",
                  // "Shift Time",
                  // "Doctor Fee",
                  "Status",
                  "Action",
                ].map((heading, i) => (
                  <TableCell
                    key={i}
                    sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ borderBottom: "none" }}
                  >
                    <Box sx={{ py: 4, marginLeft: "10rem" }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : doctors?.length > 0 ? (
                doctors?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      borderRadius: "10px",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ padding: "25px", textWrap: "nowrap" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row.slotTime}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {moment(row.createdAt).format("lll")}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {moment(row.scheduledTime).format("lll")}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.doctorName || "N/A"}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.patient?.phone}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row.patient?.address}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.paymentType}{" "}
                    </TableCell>
                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.doctorName}{" "}
                     
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.slotType}{" "}
                     
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.doctor?.consultationFee}{" "}
                     
                    </TableCell> */}

                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row.status}{" "}
                    </TableCell>

                    <TableCell style={{ textWrap: "nowrap" }}>
                      {userData?.userType === "USER" ? (
                        <Box>
                          {row?.type === "CHAT" ? (
                            <IconButton
                              disabled={
                                row?.status === "CANCELLED" ? true : false
                              }
                              onClick={() => navigate("/chat")}
                            >
                              <BsChatSquareTextFill size={20} />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => {
                                if (row?.meetingLink) {
                                  window.open(
                                    "/video-consult?meetingUrl=" + row?.meetingLink,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }}
                              disabled={
                                row?.status === "CANCELLED" ? true : false
                              }
                            >
                              <HiMiniVideoCamera />
                            </IconButton>
                          )}
                          <IconButton
                            disabled={
                              row?.status === "CANCELLED" ||
                              row?.status === "COMPLETED"
                            }
                            onClick={() => setDeleteOpen(row)}
                          >
                            <MdCancel />
                          </IconButton>
                        </Box>
                      ) : (
                        <>
                          {row.status === "Active" ? (
                            <IconButton onClick={handleDeleteClick}>
                              <HiMiniVideoCamera />
                            </IconButton>
                          ) : (
                            <IconButton onClick={handleDeleteClick}>
                              <HiMiniVideoCameraSlash />
                            </IconButton>
                          )}
                          <IconButton onClick={() => navigate("/chat")}>
                            <BsChatSquareTextFill />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} sx={{ height: "100px", p: 0 }}>
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ fontSize: "15px !important" }}
                      >
                        No Data Found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && plans?.[0]?.rows?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              // marginTop: "10px",
              paddingTop: "20px",
              "& .Mui-selected": {
                backgroundColor: "#2e5ad5 !important",
                color: "#fff !important",
                borderRadius: "5px",
              },
              "& .MuiPaginationItem-root": { color: "black" },
            }}
          >
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={totalPages}
            />
          </Box>
        )}
        <Dialog
          fullWidth
          maxWidth="sm"
          fullScreen={fullScreen}
          open={editOpen}
          onClose={closeEdit}
        >
          <DialogTitle style={{ fontWeight: "bold" }}>
            Edit Appointment
          </DialogTitle>
          <DialogContent dividers>
            <Box
              component="form"
              mb={2}
              mt={2}
              sx={{
                display: "grid",
                gridTemplateColumns: fullScreen ? "1fr" : "1fr 1fr",
                gap: 2,
                //   mt: 1
              }}
            >
              <TextField
                label="Date"
                type="date"
                value={current.date || ""}
                onChange={handleFieldChange("date")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
              <TextField
                label="Time"
                select
                value={current.time || ""}
                onChange={handleFieldChange("time")}
                SelectProps={{ native: true }}
                fullWidth
                size="small"
              >
                <option value="07:00 – 07:30">07:00 – 07:30</option>
                <option value="08:00 – 08:30">08:00 – 08:30</option>
                <option value="09:00 – 09:30">09:00 – 09:30</option>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
            <CancelBtn onClick={closeEdit} label="Cancel">
              Cancel
            </CancelBtn>
            <Btn label="Submit" onClick={handleSave} />
          </DialogActions>
        </Dialog>
        <Dialog
          open={deleteOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: "10px", // Set border radius
              p: 2, // Add padding (optional, adjust as needed)
            },
          }}
        >
          <DialogTitle style={{ fontWeight: "bold", textAlign: "center" }}>
            Appointment Cancel
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              style={{ fontSize: "17px", textAlign: "center" }}
            >
              Are you sure you want to Cancel {deleteOpen?.patient?.firstName}{" "}
              {deleteOpen?.patient?.lastName}?
            </DialogContentText>
            <Box sx={{ display: "flex", justifyContent: "center" }} mt={2}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Please enter reason"
                type="reason"
                value={reason}
                onChange={handleReasonQueryChange}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  height: "40px",
                  marginTop: {
                    xs: "10px",
                    md: "0px",
                  },
                  minWidth: 300,
                  "& .MuiOutlinedInput-root": {
                    paddingRight: 0,
                    padding: "2.5px 0px",
                    borderRadius: "10px",
                    fontSize: "14px",
                  },
                }}
                InputProps={{
                  sx: { paddingRight: "8px" },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              pb: 2,
              gap: 2, // spacing between buttons
            }}
          >
            <CancelBtn
              label="No"
              onClick={handleDeleteCancel}
              variant="outlined"
            >
              Cancel
            </CancelBtn>
            <Btn
              label="Yes"
              onClick={() => AppointcancelHandler(deleteOpen?.id)}
              variant="contained"
              color="error"
            >
              Delete
            </Btn>
          </DialogActions>
        </Dialog>
        {/* {open && (
          <AddPointMent
            open={open}
            onClose={() => setOpen(false)}
            onSave={handleSave1}
          />
        )} */}
        {open && <AddPointMent open={open} onClose={() => setOpen(false)} />}
        {openModal && (
          <SubscriptionModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            // onPurchase={handlePurchase}
          />
        )}
      </Container>
    </>
  );
}
