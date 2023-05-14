import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
interface Prop {
  userId: string | number;
}
const PostAuthor = ({ userId }: Prop) => {
  const users = useAppSelector(selectAllUsers);
  const author = users.find((user) => user.id === userId);

  return <span>by {author ? author.name : "unknown author"}</span>;
};

export default PostAuthor;
