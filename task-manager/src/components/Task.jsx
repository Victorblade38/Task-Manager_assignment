import React, { useState } from "react";
import { useTask } from "../context/Todocontext";
import { deleteIcon, medalIcon } from "../assets";
import confetti from "canvas-confetti";

const Task = ({ task }) => {
  const { deleteTask, toggleComplete, updateTask } = useTask();
  const [isFading, setIsFading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const { title, description, priority, date } = editedTask;

  const launchConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 80,
      angle: 210,
      origin: { x: 0.9, y: 0.1 },
      colors: ["#ff0000", "#00ff00", "#0000ff"],
    });
  };

  const checkDueDate = () => {
    const today = new Date();
    const dueDate = new Date(date);
    return today > dueDate;
  };

  const deleteTaskHandler = () => {
    const result = window.confirm("Do you want to delete the task?");
    if (result) {
      setIsFading(true);
      setTimeout(() => {
        deleteTask(task.id);
      }, 500);
    }
  };

  const toggleHandler = (e) => {
    toggleComplete(task.id);
    if (e.target.checked) {
      launchConfetti();
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev); // Toggle between edit and view mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    updateTask(editedTask);
    setIsEditing(false);
  };

  return (
    <div
      className={` h-40 md:w-80 md:h-64 bg-white text-gray-800 dark:bg-gray-800  dark:text-white  shadow-md lg:shadow-lg flex flex-col justify-center gap-2 p-3 md:p-6 rounded-lg  transition-all ease-in-out duration-300 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {isEditing ? (
        <div className="bg-white border-2 rounded-md flex flex-col gap-2 p-2">
          <input
            type="text"
            name="title"
            maxLength={22}
            value={title}
            onChange={handleInputChange}
            className="text-lg md:text-2xl font-bold text-slate-800"
          />
          <textarea
            name="description"
            rows={2}
            maxLength={100}
            value={description}
            onChange={handleInputChange}
            className="text-sm text-slate-700 resize-none"
          />
          <input
            type="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            className="text-sm text-slate-600"
          />
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleSaveChanges}
              className="text-sm text-white bg-green-500 p-2 rounded"
            >
              Save
            </button>
            <button
              onClick={handleEditToggle}
              className="text-sm text-white bg-gray-400 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            className={`md:h-12 text-lg md:text-2xl  font-bold ${
              task.completed
                ? "line-through text-slate-600 dark:text-gray-200"
                : ""
            }`}
          >
            {title}
          </p>
          <hr />
          <p
            className={`md:h-24 row-span-2 text-sm  font-medium ${
              task.completed
                ? "line-through text-slate-600 dark:text-gray-200"
                : ""
            }`}
          >
            {description}
          </p>
          <div className="mt-auto row-span-1 flex flex-row justify-between items-center md:gap-4">
            <div className="flex flex-row items-center ">
              <button onClick={deleteTaskHandler} className="rounded-md">
                <img
                  src={medalIcon}
                  alt="delete icon"
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              </button>
              <p className="text-sm font-medium "> - {priority}</p>
            </div>
            <p
              className={` text-sm font-medium ${
                checkDueDate() ? "text-red-600" : "text-slate-600"
              }`}
            >
              {date}
            </p>
            <button
              onClick={handleEditToggle}
              className="text-blue-600 text-sm font-medium p-1.5 hover:bg-blue-400 hover:text-white rounded-md"
            >
              Edit
            </button>
            <input
              type="checkbox"
              checked={task.completed}
              className="w-3.5 h-3.5 md:w-4 md:h-4"
              onChange={toggleHandler}
            />

            <button
              onClick={deleteTaskHandler}
              className="hover:bg-red-100 active:bg-red-200 p-2 rounded-md"
            >
              <img
                src={deleteIcon}
                alt="delete icon"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;
