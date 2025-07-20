import { Avatar, Box, Chip, Divider, Stack, SvgIcon, Typography } from '@mui/material'
import React from 'react'

const PateintDetailsTab = ({appointmentData}) => {

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
  return (
    <Box>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <Avatar
                src={appointmentData?.patient?.profilePic}
                alt="Eleanor Rigby"
                sx={{ width: 54, height: 54 }}
              />
              <Box>
                <Typography variant="h3">{appointmentData?.patient?.firstName} {appointmentData?.patient?.lastName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {calculateAge(appointmentData?.patient?.dateOfBirth)} years old • {appointmentData?.patient?.gender} • Patient ID: {appointmentData?.patient?.id}
                </Typography>
                <Chip
                  label={appointmentData?.patient?.allergies}
                  color="warning"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={.9}  sx={{display: "flex", flexWrap: "wrap", flexDirection: "row" }} >
                
              <Typography variant="body2" component="div" width={"50%"}>
                <SvgIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }}>
                  <path
                    fill="currentColor"
                    d="M12 12c2.7 0 8 1.36 8 4v2c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1v-2c0-2.64 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                  />
                </SvgIcon>
                {appointmentData?.patient?.phone}
              </Typography>
              <Typography variant="body2" component="div" width={"50%"}>
                <SvgIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }}>
                  <path
                    fill="currentColor"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </SvgIcon>
                {appointmentData?.patient?.address}
              </Typography>
              <Typography variant="body2" component="div" width={"50%"}>
                <SvgIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }}>
                  <path
                    fill="currentColor"
                    d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM4 18V8l8 5 8-5v10H4zm8-7L4.74 6h14.52L12 11z"
                  />
                </SvgIcon>
                {appointmentData?.patient?.email}
              </Typography>
              {/* <Typography variant="body2" component="div" width={"50%"}>
                <SvgIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }}>
                  <path
                    fill="currentColor"
                    d="M12 7a5 5 0 0 1 5 5c0 2.5-5 7-5 7s-5-4.5-5-7a5 5 0 0 1 5-5zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                  />
                </SvgIcon>
                Preferred Pharmacy: Main Street Pharmacy
              </Typography> */}
            </Stack>
    </Box>
  )
}

export default PateintDetailsTab