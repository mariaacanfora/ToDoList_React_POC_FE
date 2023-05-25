import { useState } from "react";
import { MdAssignmentAdd } from "react-icons/md";

interface Props {
  addTaskFn: (string: string) => void;
}

export default function AddTask({ addTaskFn }: Props) {
  const [value, setValue] = useState("");

  function addTask() {
    addTaskFn(value);
    setValue("");
  }

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      addTask();
    }
  }

  return (
    <div className="flex gap-x-3 pb-10">
      <input
        type="text"
        className="border-blue-600 rounded-lg basis-3/4"
        placeholder="Add a new task"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyUp={handleKeyDown}
      ></input>
      <button
        className="uppercase bg-green-500 rounded-lg p-2"
        onClick={() => addTask()}
        disabled={value === ""}
      >
        <MdAssignmentAdd></MdAssignmentAdd>
      </button>
    </div>
  );
}
