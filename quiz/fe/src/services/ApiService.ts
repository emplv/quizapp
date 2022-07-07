import axios, { AxiosResponse } from "axios";
import { ICredentials, IUser } from "../interfaces/IUser";
import { IQuiz } from "../interfaces/IQuiz";

const baseURL = `http://localhost:3010/api/`;

export const ApiAdapter = axios.create({
  baseURL,
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthHeader(token?: string | null) {
  if (token) {
    ApiAdapter.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete ApiAdapter.defaults.headers.common["Authorization"];
  }
}

export const ApiService = {
  // auth
  auth: (
    credentials: ICredentials,
  ): Promise<
    AxiosResponse<{
      user: IUser;
      accessToken: string;
    }>
  > => ApiAdapter.post("auth", credentials),
  // register
  register: (
    credentials: ICredentials,
  ): Promise<
    AxiosResponse<{
      id: string;
    }>
  > => ApiAdapter.post("users", credentials),
  // users
  getUserById: (id: IUser["_id"]): Promise<AxiosResponse<IUser>> =>
    ApiAdapter.get(`users/${id}`),
  // quiz
  getMyQuizzes: (): Promise<AxiosResponse<Array<IQuiz>>> =>
    ApiAdapter.get("quizzes"),
  getQuizByLink: (link: IQuiz["link"]): Promise<AxiosResponse<IQuiz>> =>
    ApiAdapter.get(`quizzes/link/${link}`),
  createQuiz: (quiz: IQuiz): Promise<AxiosResponse<{ id: IQuiz["_id"] }>> =>
    ApiAdapter.post("quizzes", quiz),
  updateQuiz: (quiz: IQuiz): Promise<AxiosResponse<void>> =>
    ApiAdapter.put(`quizzes/${quiz._id}`, quiz),
  publishQuiz: (
    id: IQuiz["_id"],
  ): Promise<AxiosResponse<Pick<IQuiz, "link">>> =>
    ApiAdapter.get(`quizzes/publish/${id}`),
  deleteQuiz: (id: IQuiz["_id"]): Promise<AxiosResponse<void>> =>
    ApiAdapter.delete(`quizzes/${id}`),
};
