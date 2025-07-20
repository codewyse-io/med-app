import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Videocam, Mic, MicOff, ScreenShare, CallEnd } from "@mui/icons-material";
import React from 'react'
import { Button } from '@mui/material'


const VideoCallSection = () => {
  return (
     <Box sx={{ width: "30vw", bgcolor: '#fff', p: 2, borderRadius: 3, boxShadow: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="success.main">
          ● good connection
        </Typography>
        <Typography variant="caption" color="text.secondary">
          00:15:32
        </Typography>
      </Stack>
      {/* Doctor Video Card */}
      <Card sx={{ mt: 1, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
        <Box
          sx={{
            height: 350,
            bgcolor: '#cfe8fc',
            backgroundImage: `url('https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            p: 1,
          }}
        >
          <Typography
            sx={{
              bgcolor: 'rgba(0,0,0,0.55)',
              color: '#fff',
              borderRadius: 1,
              px: 1.5,
              py: 0.2,
              fontSize: 13,
              mb: 0.5,
            }}
          >
            Dr. Alice Smith
          </Typography>
        </Box>
      </Card>
      {/* Patient Video Card */}
      <Card sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
        <Box
          sx={{
            height: 350,
            bgcolor: '#eee',
            backgroundImage: `url('https://images.unsplash.com/photo-1510728182584-6cfa898bc1ee?auto=format&fit=crop&w=600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            p: 1,
          }}
        >
          <Typography
            sx={{
              bgcolor: 'rgba(0,0,0,0.55)',
              color: '#fff',
              borderRadius: 1,
              px: 1.5,
              py: 0.2,
              fontSize: 13,
              mb: 0.5,
            }}
          >
            Eleanor Rigby
          </Typography>
        </Box>
      </Card>
      {/* Controls */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <IconButton color="primary">
          <Mic />
        </IconButton>
        {/* <IconButton color="primary">
          <ScreenShare />
        </IconButton> */}
        <IconButton color="primary">
          <Videocam />
        </IconButton>
        <Button color="info" variant="contained" endIcon={<CallEnd />} sx={{ minWidth: 90 }}>
          End Call
        </Button>
      </Stack>
    </Box>
  )
}

export default VideoCallSection




