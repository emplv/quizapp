import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Quizzes } from "./pages/Quizzes";
import { QuizForm } from "./pages/QuizForm";
import { TakeQuiz } from "./pages/TakeQuiz";
import { NotFound } from "./pages/404";

const Layout = () => {
  // define theme
  const theme = createTheme({
    palette: {
      primary: {
        light: "#63b8ff",
        main: "#0989e3",
        dark: "#005db0",
        contrastText: "#000",
      },
      secondary: {
        main: "#4db6ac",
        light: "#82e9de",
        dark: "#00867d",
        contrastText: "#000",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Outlet />
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

const App = () => {
  const user = useAuth((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {user ? (
            <>
              <Route index element={<Quizzes />} key="quizzes" />
              <Route path="quiz/:id" element={<QuizForm />} />
            </>
          ) : (
            <>
              <Route index element={<Login />} key="login" />
              <Route path="register" element={<Register />} />
            </>
          )}
          <Route path="takequiz/:link" element={<TakeQuiz />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
