import create, { State } from "zustand";

import { IQuiz } from "../interfaces/IQuiz";
import { ApiService } from "../services/ApiService";

type QuizMap = Map<IQuiz["_id"], IQuiz>;

export interface IQuizStore extends State {
  quizzes: QuizMap;
  lastFetch: number;
  fetchAll(force?: boolean): Promise<QuizMap | void>;
  fetchQuizByLink(link: IQuiz["link"]): Promise<IQuiz | void>;
  saveQuiz(quiz: IQuiz): Promise<IQuiz["_id"] | void>;
  publishQuiz(id: IQuiz["_id"]): Promise<IQuiz["link"] | void>;
  deleteQuiz(id: IQuiz["_id"]): Promise<void>;
  clearAll(): void;
}

export const useQuizStore = create<IQuizStore>((set, get) => ({
  quizzes: new Map(),
  lastFetch: 0,
  fetchAll: async (force = false) => {
    console.log(get().lastFetch, !force, get());
    if (get().lastFetch && !force) return get().quizzes;
    try {
      const response = await ApiService.getMyQuizzes();
      const quizzes = new Map();
      response.data.forEach((quiz) => {
        quizzes.set(quiz._id, quiz);
      });
      set({ quizzes, lastFetch: Date.now() });
      return quizzes;
    } catch (err: any) {
      console.warn(err);
      return;
    }
  },
  fetchQuizByLink: async (link) => {
    try {
      const response = await ApiService.getQuizByLink(link);
      const quiz = response.data;
      return quiz;
    } catch (err: any) {
      console.warn(err);
      return;
    }
  },
  saveQuiz: async (quiz) => {
    try {
      let id = quiz._id;
      if (id) {
        await ApiService.updateQuiz(quiz);
      } else {
        const response = await ApiService.createQuiz(quiz);
        id = response.data.id;
      }
      if (id) await get().fetchAll(true);
      return id;
    } catch (err: any) {
      console.warn(err);
      return;
    }
  },
  publishQuiz: async (id) => {
    try {
      const response = await ApiService.publishQuiz(id);
      const link = response.data.link;
      if (link) await get().fetchAll(true);
      return link;
    } catch (err: any) {
      console.warn(err);
      return;
    }
  },
  deleteQuiz: async (id) => {
    try {
      const response = await ApiService.deleteQuiz(id);
    } catch (err: any) {
      console.warn(err);
      return;
    }
    const quizzes = new Map([...get().quizzes]);
    quizzes.delete(id);
    set({ quizzes });
  },
  clearAll: () => set({ quizzes: new Map(), lastFetch: 0 }),
}));
