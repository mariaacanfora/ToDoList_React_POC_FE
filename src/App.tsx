import "./App.css";
import Header from "./Components/Header";
import AddTask from "./Components/AddTask";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { TbArrowBigDownLines } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import { motion } from "framer-motion";

interface Task {
  id: number;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<number>(0);
  const [toDo, setToDo] = useState<number>(0);
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);

  function addTaskHandler(string: string) {
    const mappedTasks = tasks.map((item) => item.description);

    if (mappedTasks.includes(string)) {
      setAlreadyExists(true);
      return;
    } else {
      setAlreadyExists(false);
    }

    fetch(import.meta.env.VITE_APP_URL_BE, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ description: string }),
    })
      .then((res) => res.json())
      .then((data) =>
        setTasks((oldTasks) => {
          return [...oldTasks, data];
        })
      );
  }

  function editFn(id: number) {
    let editedTask = tasks.find((task) => task.id == id);

    if (editedTask) {
      editedTask.completed = !editedTask.completed;

      fetch(`${import.meta.env.VITE_APP_URL_BE}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ completed: editedTask?.completed }),
      })
        .then((res) => res.json())
        .then((data) =>
          setTasks((oldTasks) => {
            let sortedTasks = [
              ...oldTasks.filter((task) => task.id != id),
              data,
            ].sort((a, b) => a.id - b.id);
            return sortedTasks;
          })
        );
    }
  }

  function deleteFn(id: number) {
    fetch(`${import.meta.env.VITE_APP_URL_BE}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    }).then(() =>
      setTasks((oldTasks) => {
        let sortedTasks = [...oldTasks.filter((task) => task.id != id)].sort(
          (a, b) => a.id - b.id
        );
        return sortedTasks;
      })
    );
  }

  useEffect(() => {
    fetch(import.meta.env.VITE_APP_URL_BE)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  useEffect(() => {
    const completedTasks = tasks.filter((task) => task.completed);
    setCompleted(completedTasks.length);
  }, [tasks]);

  useEffect(() => {
    const toDoTasks = tasks.filter((task) => !task.completed);
    setToDo(toDoTasks.length);
  }, [tasks]);

  return (
    <>
      <div className="grid place-content-center h-screen bg-gradient-to-tr from-green-600 via-violet-500 to-emerald-950">
        <div className="bg-white p-3 rounded-lg backdrop-blur-lg bg-opacity-40 drop-shadow-lg ">
          <Header></Header>
          <AddTask addTaskFn={addTaskHandler}></AddTask>
          <div className="flex flex-col pb-10">
            <div>
              <span className="font-bold">Task TOTALI: {tasks.length}</span>
            </div>
            <div>
              Task completati:{" "}
              <span className="text-green-700 font-bold">{completed}</span>{" "}
            </div>
            <div>
              Task da completare:{" "}
              <span className="text-red-700 font-bold">{toDo}</span>
            </div>
          </div>
          <ul className="flex flex-col gap-5 list-inside max-h-[15vh] overflow-auto scrollbar-hide  px-6">
            {tasks.map((task) => (
              <li key={task.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    className="rounded mr-3"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => editFn(task.id)}
                  />{" "}
                  <span className={`${task.completed ? "line-through" : ""}`}>
                    {task.description}
                  </span>
                </div>
                <button
                  className="bg-gray-700 p-2 rounded-lg"
                  onClick={() => deleteFn(task.id)}
                >
                  <AiFillDelete className="text-red-500"></AiFillDelete>
                </button>
              </li>
            ))}
          </ul>

          <div>
            {tasks.length > 3 ? (
              <motion.div
                className="flex justify-center"
                animate={{
                  y: 10,
                }}
                transition={{ duration: 2, yoyo: Infinity, repeat: Infinity }}
              >
                <TbArrowBigDownLines className="text-2xl"></TbArrowBigDownLines>
              </motion.div>
            ) : null}
          </div>

          {alreadyExists ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-[28rem] rounded-lg overflow-hidden ring-2 ring-offset-2 ring-red-500">
              <div className="bg-white flex flex-col text-2xl text-center uppercase justify-around h-full items-center backdrop-blur-lg bg-opacity-80 drop-shadow-lg">
                <span className="flex items-center gap-x-4">
                  <CiWarning className="text-red-600"></CiWarning>
                  Questo task esiste già!
                  <CiWarning className="text-red-600"></CiWarning>
                </span>
                <button
                  className="bg-green-500 w-1/4 rounded-lg uppercase text-white"
                  onClick={() => setAlreadyExists(false)}
                >
                  ok
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default App;
