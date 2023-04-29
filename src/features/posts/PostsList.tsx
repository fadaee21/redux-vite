import { useAppSelector } from "../../app/hooks";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import RemovePostButton from "./RemovePostButton";
import TimeAgo from "./TimeAgo";
import { selectPosts } from "./postsSlice";

const PostsList = () => {
  const posts = useAppSelector(selectPosts);
  const orderPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  const renderPosts = orderPosts.map((post) => {
    const { content, id, title, date } = post;
    return (
      <article key={id}>
        <h3>{title}</h3>
        <p>{content.substring(0, 100)}</p>
        <p className="postCredit">
          <PostAuthor userId={id} />
          <TimeAgo timeStamp={date} />
        </p>
        <ReactionButtons post={post} />
        <RemovePostButton id={id} />
      </article>
    );
  });
  return (
    <section>
      <h2>Posts</h2>
      {renderPosts}
    </section>
  );
};

export default PostsList;
