import React, { useEffect } from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useQuizStore } from "../store/useQuizStore";

export const Quizzes = () => {
  const { quizzes, fetchAll } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll(true);
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        height: "100%",
        margin: "24px",
        width: "auto",
        overflow: "auto",
      }}
    >
      <Box sx={{ maxWidth: 800, disaply: "flex", width: "100%" }}>
        <Typography variant="h3">My Quizzes</Typography>
        <Stack>
          {[...quizzes].map(([id, quiz]) => (
            <Paper
              sx={{ padding: "16px", cursor: "pointer" }}
              key={id}
              onClick={() => navigate(`/quiz/${id}`)}
            >
              <Typography>
                <strong>{quiz.title}</strong> ({quiz.questions.length}
                {` `}question{quiz.questions.length > 1 ? "s" : ""}){` `}
                {quiz.published ? (
                  <span style={{ color: "green" }}>published</span>
                ) : null}
              </Typography>
            </Paper>
          ))}
          {quizzes.size === 0 && (
            <Paper
              sx={{ padding: "16px", cursor: "pointer" }}
              onClick={() => navigate("/quiz/new")}
            >
              <Typography>You have no quizzes, try creating one!</Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </Container>
  );
};
