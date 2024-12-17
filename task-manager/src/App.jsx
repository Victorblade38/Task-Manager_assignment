import { useEffect, useState } from "react";
import AddTaskModal from "./components/AddTaskModal";
import Task from "./components/Task";
import { FaSun, FaMoon } from "react-icons/fa";
import { TodoProvider } from "./context/Todocontext";

function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState("light");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [isModalOpen, setIsModalOpen] = useState();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.body.classList.add("dark");
    }
  }, []);

  const addTask = (task) => {
    setTasks((prev) => [
      {
        id: Date.now(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: false,
        date: task.date || new Date().toISOString().split("T")[0],
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

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTasks([]);
      return;
    }

    const matchedTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTasks(matchedTasks);
  }, [tasks, search]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    let sortedTasks = [...(filteredTasks.length > 0 ? filteredTasks : tasks)];

    if (option === "date") {
      sortedTasks = sortedTasks.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else if (option === "priority") {
      sortedTasks = sortedTasks.sort((a, b) => a.priority - b.priority);
    } else if (option === "alphabet") {
      sortedTasks = sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === "completed") {
      sortedTasks = sortedTasks.sort((a, b) => b.completed - a.completed);
    }

    filteredTasks.length > 0
      ? setFilteredTasks(sortedTasks)
      : setTasks(sortedTasks);
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
    <TodoProvider value={{ addTask, deleteTask, toggleComplete, updateTask }}>
      <div className="min-h-screen min-w-screen roboto-regular bg-gray-200 dark:bg-gray-700 flex  justify-center transition-colors ease-in duration-300">
        <div className="flex flex-col gap-4 p-4 mt-10">
          <div className="flex flex-row flex-wrap gap-2  items-center justify-center">
            <input
              type="text"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search"
              className="xl:w-96 p-2 lg:p-3 bg-white rounded-md  shadow-sm   focus:outline-none text-sm "
            />
            <select
              name="sorting"
              id="sorting"
              className="bg-white focus:outline-none text-sm p-2 lg:p-3 font-semibold rounded-md shadow-sm"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="date">Overdue</option>
              <option value="priority">Priority</option>
              <option value="alphabet">A To Z</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={openModal}
              className="p-2 lg:p-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-sm text-white font-semibold  rounded-md shadow-sm "
            >
              + Add Task
            </button>
            <button
              className="bg-white p-3 rounded-md shadow-sm"
              onClick={toggleTheme}
            >
              {theme === "light" ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-flow-row gap-2 md:gap-4  ">
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
