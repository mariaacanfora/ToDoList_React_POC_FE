import { useState } from "react";

interface Props {
  addTaskFn: (string: string) => void;
}

export default function AddTask({ addTaskFn }: Props) {
  const [value, setValue] = useState("");

  function addTask() {
    addTaskFn(value);
    setValue("");
  }

  return (
    <div className="flex gap-x-3 pb-20">
      <input
        type="text"
        className="border-blue-600 rounded-lg basis-3/4"
        placeholder="Add a new task"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      ></input>
      <button
        className="uppercase bg-orange-500 rounded-lg p-2"
        onClick={() => addTask()}
        disabled={value === ""}
      >
        Add
      </button>
    </div>
  );
}
