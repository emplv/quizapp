import React, { FC, ReactElement, useMemo, useState } from "react";
import {
  Box,
  Link,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";

import { routes } from "../routes";
import { useAuth } from "../hooks/useAuth";
import { useQuizStore } from "../store/useQuizStore";

export const Navbar: FC<any> = (): ReactElement => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const { user, logout } = useAuth();
  const { clearAll } = useQuizStore();
  const navigate = useNavigate();
  const availableRoutes = useMemo(
    () =>
      routes.filter((page) => {
        if (page.publicOnly && user) return false;
        if (page.protected && !user) return false;
        return true;
      }),
    [user],
  );

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "secondary.main",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            Quiz App
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {availableRoutes.map((page) => (
                <Link
                  key={page.key}
                  component={NavLink}
                  to={page.path || "/"}
                  color="black"
                  underline="none"
                  variant="button"
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            Quiz App
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginLeft: "1rem",
              }}
            >
              {availableRoutes.map((page) => (
                <Link
                  key={page.key}
                  component={NavLink}
                  to={page.path || "/"}
                  color="black"
                  underline="none"
                  variant="button"
                  sx={{ fontSize: "large", marginLeft: "2rem" }}
                >
                  {page.title}
                </Link>
              ))}
            </Box>
            {!!user && (
              <Box
                sx={{
                  display: "flex",
                  justifySelf: "flex-end",
                  alignItems: "center",
                }}
              >
                <Typography>{user.name}</Typography>
                <Logout
                  onClick={() => {
                    logout();
                    clearAll();
                    navigate("/");
                  }}
                  sx={{
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                />
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </Box>
  );
};
