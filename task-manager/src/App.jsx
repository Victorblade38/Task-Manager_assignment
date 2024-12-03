import { useEffect, useState } from "react";
import AddTaskModal from "./components/AddTaskModal";
import Task from "./components/Task";
import { searchIcon } from "./assets";
import { TodoProvider } from "./context/Todocontext";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("date");
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
      <div className="min-h-screen bg-gray-200 flex  justify-center ">
        <div className="flex flex-col gap-4 p-4 mt-10">
          <div className="flex flex-row flex-wrap gap-2  items-center justify-center">
            <form
              className="flex flex-row gap-2 p-2 lg:p-3 bg-white rounded-md md:rounded-lg shadow-sm md:shadow-md"
              id="search-form"
              onSubmit={onSubmitHandler}
            >
              <input
                type="text"
                name="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search"
                className=" xl:w-96 focus:outline-none text-sm rounded-lg"
              />
              <button type="submit" className="ml-auto px-2 hover:rounded-r-lg">
                <img src={searchIcon} className="w-4 md:w-6" alt="Search" />
              </button>
            </form>

            <select
              name="sorting"
              id="sorting"
              className="bg-white focus:outline-none text-sm p-2 lg:p-3 font-semibold rounded-md md:rounded-lg shadow-sm md:shadow-md"
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
              className="p-2 lg:p-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-sm text-white font-semibold  rounded-md md:rounded-lg shadow-sm md:shadow-md"
            >
              + Add Task
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
