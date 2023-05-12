import "./App.css";
import Header from "./Components/Header";
import AddTask from "./Components/AddTask";
import { useEffect, useState } from "react";
// import axios from "axios";

function App() {
  const [tasks, setTasks] = useState<any[]>([]);

  function addTaskHandler(string: string) {
    if (!tasks.includes(string)) {
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
  }

  function pippoFn(id: number) {
    let editedTask = tasks.find((task) => task.id == id);

    editedTask.completed = !editedTask.completed;

    fetch(`${import.meta.env.VITE_APP_URL_BE}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ completed: editedTask.completed }),
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

  return (
    <>
      <div className="grid place-content-center h-screen bg-gradient-to-tr from-green-600 via-violet-500 to-emerald-950">
        <div className="bg-white p-3 rounded-lg backdrop-blur-lg bg-opacity-40 drop-shadow-lg ">
          <Header></Header>
          <AddTask addTaskFn={addTaskHandler}></AddTask>
          <ul className="flex flex-col gap-5 list-inside max-h-[15vh] overflow-auto px-6">
            {tasks.map((task) => (
              <li key={task.id} className="flex justify-between items-center">
                <div>
                  <input
                    className="rounded checked:bg-teal-300 active:focus:bg-teal-300"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => pippoFn(task.id)}
                  />{" "}
                  {task.description}
                </div>
                <button
                  className="bg-red-500 p-2 rounded-lg"
                  onClick={() => deleteFn(task.id)}
                >
                  DELETE
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
