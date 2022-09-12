import { FC, useState } from "react";

interface CounterProps {
  initialValue?: number;
}

export const Counter: FC<CounterProps> = ({ initialValue = 0 }) => {
  let [count, setCount] = useState(initialValue);
  let inc = () => setCount(n => n + 1);
  let dec = () => setCount(n => n - 1);

  return (
    <>
      <button onClick={dec}>-</button>
      {count}
      <button onClick={inc}>+</button>
    </>
  );
}
