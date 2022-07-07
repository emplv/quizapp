import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { object, array, number } from "yup";
import { useParams } from "react-router-dom";

import { useFormFactory } from "../hooks/useFormFactory";
import { IQuiz, QuizQuestionType } from "../interfaces/IQuiz";
import { useQuizStore } from "../store/useQuizStore";

const SingleAnswer: React.FC<{
  setValue(index: number, value: number): void;
  index: number;
  value: number;
  answers: string[];
}> = ({ setValue, index, value, answers }) => (
  <RadioGroup
    name={`radio-group-${index}`}
    value={value}
    onChange={(event) => setValue(index, Number(event.target.value))}
  >
    {answers.map((answer, i) => (
      <FormControlLabel
        key={i}
        value={1 << i}
        control={<Radio />}
        label={answer}
      />
    ))}
  </RadioGroup>
);

const MultiAnswer: React.FC<{
  setValue(index: number, value: number): void;
  index: number;
  value: number;
  answers: string[];
}> = ({ setValue, index, value, answers }) => (
  <FormGroup>
    {answers.map((answer, i) => (
      <FormControlLabel
        key={i}
        value={i}
        control={
          <Checkbox
            checked={Boolean(value & (1 << i))}
            onChange={(event) => setValue(index, value ^ (1 << i))}
            name={`checkbox-group-${index}`}
          />
        }
        label={answer}
      />
    ))}
  </FormGroup>
);

const validationSchema = object({
  answers: array().of(number()),
});

export const TakeQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const { link } = useParams<{ link: string }>();
  const [fetched, setFetched] = useState(false);
  const [quiz, setQuiz] = useState<IQuiz>();
  const { fetchQuizByLink } = useQuizStore();

  useEffect(() => {
    (async () => {
      try {
        const quiz = await fetchQuizByLink(link);
        if (quiz) setQuiz(quiz);
      } catch (err: any) {}
      setFetched(true);
    })();
  }, [link]);

  const useForm = useMemo(
    () =>
      useFormFactory<number[]>(
        Array(quiz?.questions.length).fill(0),
        async (values) => {
          setScore(
            values.reduce((correct, value, index) => {
              if (value === quiz?.questions?.[index]?.answer) {
                return correct + 1;
              }
              return correct;
            }, 0),
          );
        },
        validationSchema,
      ),
    [quiz?._id],
  );
  const { values, setValue, submit } = useForm();

  const handleNext = () => {
    setStep((step) => step + 1);
    if (step + 1 === quiz?.questions.length) submit();
  };
  const handleBack = () => setStep((step) => step - 1);

  if (!fetched) {
    return (
      <Container
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box width="300px">Loading...</Box>
      </Container>
    );
  }

  if (!quiz?._id) {
    return (
      <Container
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box width="300px" color="error">
          Quiz not found!
        </Box>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        height: "100%",
        margin: "24px",
      }}
    >
      <Box sx={{ maxWidth: 800 }}>
        <FormControl>
          <Typography variant="h3">{quiz.title}</Typography>
          <Stepper activeStep={step} orientation="vertical">
            {quiz.questions.map(({ question, type, answers }, index) => {
              const AnswerComponent =
                type === QuizQuestionType.single ? SingleAnswer : MultiAnswer;
              return (
                <Step key={index}>
                  <StepLabel>{question}</StepLabel>
                  <StepContent>
                    <AnswerComponent
                      index={index}
                      value={values[index]}
                      setValue={setValue}
                      answers={answers}
                    />
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === quiz.questions.length - 1
                            ? "Finish"
                            : "Continue"}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
          {step === quiz.questions.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography variant="h5">
                Thank you for taking the quiz!
              </Typography>
              <Typography>
                Your result is <strong>{score}</strong> out of{" "}
                <strong>{quiz.questions.length}</strong>!
              </Typography>
            </Paper>
          )}
        </FormControl>
      </Box>
    </Container>
  );
};
