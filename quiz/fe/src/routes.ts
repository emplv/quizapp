import React from "react";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Quizzes } from "./pages/Quizzes";
import { QuizForm } from "./pages/QuizForm";

interface Route {
  key: string;
  title: string;
  path?: string;
  index?: boolean;
  enabled: boolean;
  publicOnly?: boolean;
  protected?: boolean;
  component: React.FunctionComponent;
}

export const routes: Array<Route> = [
  {
    key: "login",
    title: "Login",
    index: true,
    enabled: true,
    publicOnly: true,
    component: Login,
  },
  {
    key: "register",
    title: "Register",
    path: "register",
    enabled: true,
    publicOnly: true,
    component: Register,
  },
  {
    key: "my-quizzes",
    title: "My quizzes",
    index: true,
    enabled: true,
    protected: true,
    component: Quizzes,
  },
  {
    key: "add-quizzes",
    title: "Add New quiz",
    path: "quiz/new",
    enabled: true,
    protected: true,
    component: QuizForm,
  },
];
