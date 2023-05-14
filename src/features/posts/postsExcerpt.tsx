import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";
import { Post } from "./postsSlice";

type Props = { post: Post };

const PostsExcerpt = ({ post }: Props) => {
  return (
    <article>
    <h2>{post.title}</h2>
    <p className="excerpt">{post.body.substring(0, 75)}...</p>
    <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
    </p>
    <ReactionButtons post={post} />
</article>
  );
};

export default PostsExcerpt;
