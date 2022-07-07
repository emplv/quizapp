import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  FormControl,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import { object, string, array, number, boolean } from "yup";

import { useQuizStore } from "../store/useQuizStore";
import { IQuiz, QuizQuestionType } from "../interfaces/IQuiz";
import { useFormFactory } from "../hooks/useFormFactory";

const validationSchema = object({
  _id: string(),
  title: string().label("Title").required().min(3),
  published: boolean(),
  questions: array()
    .of(
      object({
        question: string().label("Question").required().min(3),
        type: string().oneOf([QuizQuestionType.single, QuizQuestionType.multi]),
        answer: number().min(1),
        answers: array().of(string().label("Answer").required()).min(2),
      }),
    )
    .min(1),
  link: string(),
  userId: string(),
});

const defaultQuiz: IQuiz = {
  _id: "",
  title: "",
  published: false,
  link: "",
  userId: "",
  questions: [
    {
      question: "",
      type: QuizQuestionType.single,
      answer: 1,
      answers: ["", ""],
    },
  ],
};

export const QuizForm = () => {
  const [disabled, setDisabled] = useState(false);
  const { quizzes, fetchAll, saveQuiz, publishQuiz } = useQuizStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll(true);
  }, []);

  const useForm = useMemo(
    () =>
      useFormFactory<IQuiz>(
        id === "new" ? defaultQuiz : (quizzes.get(id) as IQuiz) || defaultQuiz,
        async (values) => {
          setDisabled(true);
          const quiz = { ...values };
          quiz.questions = quiz.questions.map((question) => {
            // if there are multiple correct answers then need to switch "type"
            // this bitwise trick sets LSB to 0
            if (question.answer & ~-question.answer) {
              // that means that there are more correct answer bits set,
              // thus we can change "type" to "multi"
              return {
                ...question,
                type: QuizQuestionType.multi,
              };
            }
            return {
              ...question,
              type: QuizQuestionType.single,
            };
          });
          try {
            const quizId = await saveQuiz(quiz);
            if (quizId) {
              navigate(`/quiz/${quizId}`);
              setDisabled(false);
            }
          } catch (err) {
            console.warn(err);
            setDisabled(false);
          }
        },
        validationSchema,
      ),
    [id, quizzes],
  );
  const { values, setValue, errors, submit } = useForm();
  const publish = useCallback(async () => {
    setDisabled(true);
    try {
      await publishQuiz(id);
    } catch (err) {
      console.warn(err);
      setDisabled(false);
    }
  }, []);
  const addNewQuestion = () => {
    setValue("questions", [
      ...values.questions,
      JSON.parse(JSON.stringify(defaultQuiz.questions[0])),
    ]);
  };

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
        <FormControl sx={{ flexGrow: "1", width: "100%" }}>
          <Typography variant="h4" sx={{ marginBottom: "24px" }}>
            Quiz {values.title ? `"${values.title}"` : ""}
          </Typography>
          <Stack sx={{ flexGrow: "1" }}>
            <TextField
              onChange={(event) => setValue("title", event.target.value)}
              value={values.title}
              error={!!errors.title}
              helperText={errors.title}
              label="Title"
              sx={{ marginBottom: "12px" }}
              disabled={values.published}
            />
            <Typography variant="h6" sx={{ margin: "16px 0" }}>
              Questions
            </Typography>
            {values.questions.map((item, index) => {
              const [errorKey, error] =
                Object.entries(errors).find(([key]) =>
                  key.startsWith(`questions[${index}]`),
                ) || [];
              const itemErrors = errorKey
                ? {
                    [(errorKey as string).slice(errorKey.lastIndexOf(".") + 1)]:
                      error,
                  }
                : {};
              const handleQuestionDataChange = (key: string, value: any) =>
                setValue(
                  "questions",
                  values.questions.map((q, i) =>
                    i === index
                      ? {
                          ...q,
                          [key]: value,
                        }
                      : q,
                  ),
                );
              return (
                <Accordion
                  key={index}
                  sx={errorKey ? { border: "1px solid tomato" } : {}}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>#{index + 1}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      onChange={(event) =>
                        handleQuestionDataChange("question", event.target.value)
                      }
                      value={item.question}
                      error={!!itemErrors.question}
                      helperText={itemErrors.question}
                      label="Question"
                      sx={{ marginBottom: "12px", width: "100%" }}
                      disabled={values.published}
                    />
                    <Typography>Select correct answer/-s</Typography>
                    <FormGroup>
                      {item.answers.map((answer, j) => {
                        const handleAnswerDataChange = (value: any) =>
                          handleQuestionDataChange(
                            "answers",
                            item.answers.map((a, k) => (k === j ? value : a)),
                          );
                        return (
                          <Box sx={{ marginBottom: "8px" }} key={j}>
                            <Checkbox
                              checked={Boolean(item.answer & (1 << j))}
                              onChange={(event) =>
                                handleQuestionDataChange(
                                  "answer",
                                  item.answer ^ (1 << j),
                                )
                              }
                              disabled={values.published}
                            />
                            <TextField
                              onChange={(event) =>
                                handleAnswerDataChange(event.target.value)
                              }
                              value={answer}
                              error={!!itemErrors[`answers[${j}]`]}
                              helperText={itemErrors[`answers[${j}]`]}
                              label={`Answer #${j + 1}`}
                              disabled={values.published}
                              size="small"
                            />
                            <Button
                              sx={{
                                marginLeft: "32px",
                              }}
                              color="error"
                              onClick={() => {
                                setValue(
                                  "questions",
                                  values.questions.map((q, i) =>
                                    i === index
                                      ? {
                                          ...q,
                                          answers: item.answers.filter(
                                            (_, k) => k !== j,
                                          ),
                                          answer:
                                            ((item.answer >> (j + 1)) << j) |
                                            (item.answer & ((1 << j) - 1)),
                                        }
                                      : q,
                                  ),
                                );
                              }}
                              disabled={item.answers.length < 3}
                            >
                              Remove
                            </Button>
                          </Box>
                        );
                      })}
                      {item.answer === 0 && (
                        <Typography color="error" variant="caption">
                          At least one correct answer is required
                        </Typography>
                      )}
                      {item.answers.length < 5 && !values.published && (
                        <Box
                          sx={{
                            marginTop: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleQuestionDataChange("answers", [
                                ...item.answers,
                                "",
                              ])
                            }
                            variant="outlined"
                          >
                            Add another answer
                          </Button>
                          {values.questions.length > 1 && !values.published && (
                            <Button
                              onClick={() =>
                                setValue(
                                  "questions",
                                  values.questions.filter(
                                    (_, i) => i !== index,
                                  ),
                                )
                              }
                              color="error"
                            >
                              Remove question
                            </Button>
                          )}
                        </Box>
                      )}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              );
            })}

            {values.questions.length < 10 && !values.published && (
              <Box sx={{ marginTop: "16px" }}>
                <Button onClick={addNewQuestion} variant="outlined">
                  Add another question
                </Button>
              </Box>
            )}

            {values.published && values.link ? (
              <Box sx={{ marginTop: "16px" }}>
                <Typography>
                  Quiz is available via link:{` `}
                  <a
                    href={`${window.location.origin}/takequiz/${values.link}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>
                      {window.location.origin}/takequiz/{values.link}
                    </strong>
                  </a>
                </Typography>
              </Box>
            ) : null}

            <Box sx={{ marginTop: "24px" }}>
              <ButtonGroup variant="contained">
                <Button
                  onClick={submit}
                  disabled={disabled || values.published}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  onClick={publish}
                  disabled={disabled || !values._id || values.published}
                  variant="contained"
                  color="success"
                >
                  Publish
                </Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </FormControl>
      </Box>
    </Container>
  );
};
