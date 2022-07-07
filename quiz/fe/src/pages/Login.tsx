import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { object, string } from "yup";

import { useAuth } from "../hooks/useAuth";
import { useFormFactory } from "../hooks/useFormFactory";

interface ILoginForm {
  email: string;
  password: string;
}

const validationSchema = object({
  email: string().label("Email").required().email(),
  password: string()
    .label("Password")
    .required()
    .min(5, "Must include (5+ characters)"),
});

export const Login = () => {
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [user, login] = useAuth(
    useCallback((state) => [state.user, state.login], []),
  );
  const useForm = useMemo(
    () =>
      useFormFactory<ILoginForm>(
        { email: "", password: "" },
        async (values) => {
          setDisabled(true);
          try {
            const res = await login(values);
            if (res) return;
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
            Login
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
