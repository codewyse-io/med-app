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
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { MdModeEditOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { IoEyeSharp } from "react-icons/io5";
import { HiEye } from "react-icons/hi2";
import Btn from "../CommonComponenet/CommonButtons/Btn";
import { MdDelete } from "react-icons/md";
import PatientDetailsDialog from "../CommonComponenet/CommonButtons/PatientDetailsDialog";
import CancelBtn from "../CommonComponenet/CommonButtons/CancelBtn";
import AddAppointmentDialog from "../CommonComponenet/CommonButtons/AddAppointmentDialog";
import EditPatient from "../CommonComponenet/CommonButtons/EditPatient";
import { AuthContext } from "../Context/Auth";
import axios from "axios";
import { MdBlock } from "react-icons/md";
import ApiConfig from "../ApiConfig/ApiConfig";
import toast from "react-hot-toast";

export default function Payment() {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState("");
  const auth = useContext(AuthContext);
  const userData = auth?.userData;
  console.log("userDatauserDatauserData", userData);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [patients, setPatients] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

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
        url: ApiConfig.adminUserList,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: limit,
          search: searchQuery,
        },
      });
      console.log("successsuccess", response?.data?.success);
      if (response?.data?.error === "false") {
        setLoading(false);

        console.log("responseresponse", response);
        setPatients(
          response?.data?.data?.docs?.filter(
            (item) => item?.userType === "USER"
          )
        );
        setTotalPages(response?.data?.data?.totalPages);
        // setTotalPages(response?.data?.data?.[0]?.count);
      }
    } catch (error) {
      setPatients([]);
      setLoading(false);

      console.log("errorerror", error);
      return error?.response;
    }
  };
  const getAllDoctorsDelete = async (id, status) => {
    const token = window.localStorage.getItem("UhuruMedToken");
    setLoading(true);

    try {
      const response = await axios({
        method: "PUT",
        url: ApiConfig.adminUserListDelete,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
        data: {
          status: status,
        },
      });
      console.log("successsuccess", response?.data?.success);
      if (response?.data?.error === "false") {
        setLoading(false);
        toast.success(response.data.message);
        setDeleteOpen(false);
        getAllDoctors();
        // setTotalPages(response?.data?.data?.[0]?.count);
      }
    } catch (error) {
      setLoading(false);
      console.log("errorerror", error);
      return error?.response;
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, [searchQuery, page, limit]);

  return (
    <>
      <Container maxWidth="xxl">
        <Box
          mb={2.5}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            // alignItems:'center',
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontSize: "30px", fontWeight: "700", fontFamily: "rubik" }}
          >
            All Patients
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              // flexDirection: { xs: "column", md: "row" },
              // marginTop: { xs: 2 },
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              type="search"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "8px",
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
              }}
              InputProps={{
                sx: { paddingRight: "8px" },
              }}
            />
            {userData?.userType === "ADMIN" && (
              <Btn label="New Patient" onClick={() => setOpen(true)} />
            )}
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
                  "Patient Profile",
                  "Full name",
                  "Email",
                  "Phone",
                  "Role",
                  // "Gender",
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
              ) : patients?.length > 0 ? (
                patients?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      borderRadius: "10px",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          src={row.profilePic}
                          alt={row.firstName}
                          sx={{ width: 50, height: 50, borderRadius: 1 }}
                        />
                      </Box>
                    </TableCell>
                    {/* <TableCell sx={{ padding: "25px" }}>{index + 1}</TableCell> */}

                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.firstName} {row?.lastName}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row.email}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row.phone ? `+${row.phone}` : ""}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row.userType}
                    </TableCell>
                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      {row.gender || "--"}
                    </TableCell> */}
                    <TableCell
                      style={{
                        textWrap: "nowrap",
                        color:
                          row?.status === "ACTIVE"
                            ? "green"
                            : row?.status === "BLOCKED"
                              ? "red"
                              : "Orange",
                      }}
                    >
                      {row.status}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      <Box>
                        {/* Show only for userType === "DOCTOR" */}
                        {userData?.userType === "DOCTOR" && (
                          <IconButton onClick={() => setIsDialogOpen(row)}>
                            <IoEyeSharp />
                          </IconButton>
                        )}

                        {/* Show only for userType === "ADMIN" */}
                        {userData?.userType === "ADMIN" && (
                          <>
                            <IconButton onClick={() => setIsDialogOpen(row)}>
                              <IoEyeSharp />
                            </IconButton>

                            <IconButton onClick={() => setOpen1(row)}>
                              <MdModeEditOutline />
                            </IconButton>

                            <IconButton onClick={() => setDeleteOpen(row)}>
                              <MdBlock
                                color={
                                  row?.status === "ACTIVE" ? "Green" : "red"
                                }
                              />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ height: "100px", p: 0 }}>
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
        {totalPages > 1 && patients?.length > 0 && (
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

        {isDialogOpen && (
          <PatientDetailsDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          />
        )}
      </Container>
      <Dialog
        PaperProps={{
          sx: {
            borderRadius: "10px", // Set border radius
            p: 2, // Add padding (optional, adjust as needed)
          },
        }}
        open={deleteOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle style={{ fontWeight: "bold", textAlign: "center" }}>
          Confirm {deleteOpen?.status === "ACTIVE" ? "Blocked" : "Active"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText style={{ fontSize: "17px", textAlign: "center" }}>
            Are you sure you want to delete {deleteOpen?.firstName}{" "}
            {deleteOpen?.lastName} ?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
            gap: 2, // spacing between buttons
          }}
        >
          <CancelBtn label="No" onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </CancelBtn>
          <Btn
            label="Yes"
            onClick={() =>
              getAllDoctorsDelete(
                deleteOpen?.id,
                deleteOpen?.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
              )
            }
            variant="contained"
            color="error"
          >
            Delete
          </Btn>
        </DialogActions>
      </Dialog>

      {open && (
        <AddAppointmentDialog open={open} onClose={() => setOpen(false)} />
      )}
      {open1 && <EditPatient open={open1} onClose={() => setOpen1(false)} />}
    </>
  );
}
