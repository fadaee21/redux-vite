import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import PostsExcerpt from "./postsExcerpt";
import {
  selectPosts,
  fetchPosts,
  getPostsError,
  getPostsStatus,
} from "./postsSlice";

const PostsList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const postsStatus = useAppSelector(getPostsStatus);
  const postsError = useAppSelector(getPostsError);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, postsStatus]);

  let renderPosts;
  if (postsStatus === "loading") {
    renderPosts = <p>Fetching the latest 10 post(s)...</p>;
  } else if (postsStatus === "succeed") {
    const orderPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));

    renderPosts = orderPosts.map((post) => {
      return <PostsExcerpt post={post} key={post.id} />;
    });
  } else if (postsStatus === "failed") {
    renderPosts = (
      <p>
        Something went wrong.<span>{postsError}</span>
      </p>
    );
  }

  return (
    <section>
      {renderPosts}
    </section>
  );
};

export default PostsList;
