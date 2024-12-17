import React, { useState } from "react";
import { useTask } from "../context/Todocontext";

const AddTaskModal = ({ isOpen, onClose }) => {
  const initialTaskState = {
    title: "",
    description: "",
    priority: 4,
    date: new Date().toISOString().split("T")[0], // Default to today's date
    completed: false,
  };

  const [task, setTask] = useState(initialTaskState);

  const { addTask } = useTask();

  const add = (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.description.trim()) {
      alert("Please provide both title and description!");
      return;
    }
    addTask({ id: Date.now(), ...task });
    setTask(initialTaskState);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  return isOpen ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex p-6 justify-center items-center z-50"
      role="dialog"
      aria-labelledby="add-task-title"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-4 md:p-6 w-[500px]">
        <h2
          id="add-task-title"
          className="text-center md:text-xl font-bold mb-4"
        >
          Add New Task
        </h2>
        <form
          onSubmit={add}
          className="flex flex-col gap-2 md:gap-3 font-medium"
        >
          <label htmlFor="title">Enter the title</label>
          <input
            type="text"
            id="title"
            name="title"
            maxLength={22}
            placeholder="Write a task"
            className="font-normal w-full md:h-14 border border-black/10 rounded-lg p-2 md:px-3 md:py-1.5 outline-none duration-150 bg-white/20"
            onChange={handleChange}
            value={task.title}
          />
          <label htmlFor="description">Enter the description</label>
          <textarea
            id="description"
            name="description"
            maxLength={100}
            placeholder="Write the description"
            className="font-normal w-full h-20 border border-black/10 rounded-lg p-2 md:px-3 md:py-1.5 outline-none duration-150 bg-white/20"
            onChange={handleChange}
            value={task.description}
          />
          <label htmlFor="priority">Set priority</label>
          <input
            type="number"
            id="priority"
            name="priority"
            min="1"
            max="5"
            className="w-full border border-black/10 rounded-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
            onChange={handleChange}
            value={task.priority}
          />
          <label htmlFor="date">Set Due Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="w-full border border-black/10 rounded-lg px-3 py-1.5 outline-none duration-150 bg-white/20"
            onChange={handleChange}
            value={task.date}
            min={new Date().toISOString().split("T")[0]}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="text-lg px-4 py-2 bg-gray-400 hover:text-white hover:bg-red-500 transition-colors ease-in duration-200 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-lg px-4 py-2 bg-green-600 active:bg-green-700 text-white rounded-lg"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddTaskModal;
