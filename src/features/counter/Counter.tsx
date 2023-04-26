import {
  decrement,
  increment,
  reset,
  selectCount,
  incrementByAmount,
} from "./counterSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
        <input
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value) || 0)}
        />
        <button onClick={() => dispatch(incrementByAmount(incrementAmount))}>
          incrementByAmount
        </button>
        <button onClick={() => dispatch(reset())}>Reset</button>
      </div>
    </div>
  );
}
