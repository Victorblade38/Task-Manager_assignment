import React, { useState } from "react";
import { useTask } from "../context/Todocontext";
import { deleteIcon, medalIcon } from "../assets";
import confetti from "canvas-confetti";

const Task = ({ task }) => {
  const { deleteTask, toggleComplete } = useTask();
  const [isFading, setIsFading] = useState(false);
  const { title, description, priority, completed } = task;

  const launchConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 80,
      angle: 210,
      origin: { x: 0.9, y: 0.1 },
      colors: ["#ff0000", "#00ff00", "#0000ff"],
    });
  };

  const deleteTaskHandler = () => {
    setIsFading(true);
    setTimeout(() => {
      deleteTask(task.id);
    }, 500);
  };

  const toggleHandler = (e) => {
    toggleComplete(task.id);
    if (e.target.checked) {
      launchConfetti();
    }
  };

  return (
    <div
      className={`w-96 h-64 bg-white  flex flex-col justify-center gap-2 p-6 rounded-lg shadow-lg transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <p
        className={`w-full h-12  text-3xl font-bold ${
          completed ? "line-through text-slate-600" : "text-slate-800"
        }`}
      >
        {title}
      </p>
      <hr />
      <p
        className={` w-full h-24 row-span-2 font-medium  ${
          completed ? "line-through text-slate-500" : "text-slate-700"
        }`}
      >
        {description}
      </p>

      <div
        className=" row-span-1 flex flex-row justify-between
       items-center gap-4 "
      >
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={deleteTaskHandler}
            className=" hover:bg-yellow-100 p-2 rounded-md"
          >
            <img src={medalIcon} alt="delete icon" className="w-6 h-6" />
          </button>
          <p className=" text-xl font-medium text-slate-600">{priority}</p>
        </div>
        <div className="flex flex-row  items-center gap-3">
          <input type="checkbox" className="w-5 h-5" onChange={toggleHandler} />
          <button
            onClick={deleteTaskHandler}
            className=" hover:bg-red-100 active:bg-red-200 p-2 rounded-md"
          >
            <img src={deleteIcon} alt="delete icon" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;
