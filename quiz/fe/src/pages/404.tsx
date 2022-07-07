import React from "react";
import { Box, Typography } from "@mui/material";

export const NotFound = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "whitesmoke",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">Route not found</Typography>
    </Box>
  );
};
