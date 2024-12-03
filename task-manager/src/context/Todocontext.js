import { createContext, useContext } from "react";

export const Todocontext = createContext({
  tasks: [
    {
      id: 1,
      title: "Task message",
      description: "description",
      priority: 1,
      date: "2024-12-05",
      completed: false,
    },
  ],
  addTask: (task) => {},
  deleteTask: (id) => {},
  toggleComplete: (id) => {},
  updateTask: (task) => {},
});

export const useTask = () => {
  return useContext(Todocontext);
};

export const TodoProvider = Todocontext.Provider;
