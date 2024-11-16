import { createContext, useContext } from "react";

export const Todocontext = createContext({
  tasks: [
    {
      id: 1,
      title: "Task message",
      description: "description",
      priority: 1,
      completed: false,
    },
  ],
  addTask: (todo) => {},
  deleteTask: (id) => {},
  toggleComplete: (id) => {},
});

export const useTask = () => {
  return useContext(Todocontext);
};

export const TodoProvider = Todocontext.Provider;
