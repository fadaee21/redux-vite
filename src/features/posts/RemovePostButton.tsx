import { useAppDispatch } from "../../app/hooks";
import { postRemoved } from "./postsSlice";

type Prop = {
  id: string;
};

const RemovePostButton = ({ id }: Prop) => {
  const dispatch = useAppDispatch();
  return <button onClick={() => dispatch(postRemoved(id))}>remove post</button>;
};

export default RemovePostButton;
