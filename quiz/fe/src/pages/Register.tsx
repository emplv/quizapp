import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";

import { useAuth } from "../hooks/useAuth";
import { useFormFactory } from "../hooks/useFormFactory";

interface IRegisterForm {
  name: string;
  email: string;
  password: string;
}

const validationSchema = object({
  name: string(),
  email: string().label("Email").required().email(),
  password: string()
    .label("Password")
    .required()
    .min(5, "Must include (5+ characters)"),
});

export const Register = () => {
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [user, register] = useAuth(
    useCallback((state) => [state.user, state.register], []),
  );
  const navigate = useNavigate();
  const useForm = useMemo(
    () =>
      useFormFactory<IRegisterForm>(
        { name: "", email: "", password: "" },
        async (values) => {
          setDisabled(true);
          try {
            const res = await register(values);
            if (res) {
              navigate("/");
              return;
            }
            setError("Unexpected server error");
          } catch (err: any) {
            setDisabled(false);
            const error = err?.response?.data?.errors?.[0];
            if (typeof error === "object") {
              setError(error.msg);
              return;
            }
            setError(error || "Unexpected server error");
          }
        },
        validationSchema,
      ),
    [],
  );
  const { values, setValue, errors, submit } = useForm();

  if (user) {
    return null;
  }

  return (
    <Container
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box width="300px">
        <Stack>
          <TextField
            onChange={(event) => setValue("name", event.target.value)}
            value={values.name}
            error={!!errors.name}
            helperText={errors.name}
            label="Name"
            sx={{ marginBottom: "12px" }}
          />
          <TextField
            onChange={(event) => setValue("email", event.target.value)}
            value={values.email}
            error={!!errors.email}
            helperText={errors.email}
            label="Email"
            sx={{ marginBottom: "12px" }}
          />
          <TextField
            onChange={(event) => setValue("password", event.target.value)}
            value={values.password}
            error={!!errors.password}
            helperText={errors.password}
            label="Password"
            type="password"
            sx={{ marginBottom: "12px" }}
          />
          <Button onClick={submit} disabled={disabled} variant="outlined">
            Register
          </Button>
          {error ? (
            <Typography variant="body1" color="red">
              {error}
            </Typography>
          ) : undefined}
        </Stack>
      </Box>
    </Container>
  );
};
