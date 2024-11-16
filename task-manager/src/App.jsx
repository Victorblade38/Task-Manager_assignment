import { useEffect, useState } from "react";
import AddTaskModal from "./components/AddTaskModal";
import Task from "./components/Task";
import { searchIcon } from "./assets";
import { TodoProvider } from "./context/Todocontext";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addTask = (task) => {
    setTasks((prev) => [
      {
        id: Date.now(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: false,
      },
      ...prev,
    ]);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };
  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((prevTask) =>
        prevTask.id === id
          ? { ...prevTask, completed: !prevTask.completed }
          : prevTask
      )
    );
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      alert("Please enter a valid search term.");
      setFilteredTasks([]);
      return;
    }

    const matchedTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTasks(matchedTasks);
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("tasks"));
    if (storedTodos && storedTodos.length > 0) {
      setTasks(storedTodos);
    }
    setFilteredTasks([]);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <TodoProvider value={{ tasks, addTask, deleteTask, toggleComplete }}>
      <div className="min-h-screen bg-gray-200 flex p-40  items-start">
        <div className="flex flex-col gap-4  items-start ">
          <div className="flex flex-row gap-4 items-center">
            <form
              className="flex flex-row gap-2 bg-white rounded-lg shadow-md"
              id="search-form"
              onSubmit={onSubmitHandler}
            >
              <input
                type="text"
                name="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search"
                className="h-14 w-96 focus:outline-none text-base p-4 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 hover:bg-blue-400 hover:rounded-r-lg"
              >
                <img src={searchIcon} className="w-6" alt="Search" />
              </button>
            </form>

            <select
              name="sorting"
              id="sorting"
              className="h-14 p-4 bg-white focus:outline-none text-base font-semibold rounded-lg shadow-md "
            >
              <option value="date">Date modified</option>
              <option value="priority">Priority</option>
              <option value="alphabet">A To Z</option>
            </select>

            <button
              onClick={openModal}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-base text-white font-semibold p-4 rounded-lg shadow-md"
            >
              + Add Task
            </button>
          </div>

          <div className="h-[800px] grid grid-cols-5 grid-flow-row gap-4 overflow-y-auto no-scrollbar">
            {(filteredTasks.length > 0 ? filteredTasks : tasks).map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </div>
        </div>
        <AddTaskModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </TodoProvider>
  );
}

export default App;
