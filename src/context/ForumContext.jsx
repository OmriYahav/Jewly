import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { forumCategories as initialCategories, posts as initialPosts, comments as initialComments } from "../../data/posts";

const ForumContext = createContext(null);

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function ForumProvider({ children }) {
  const [posts, setPosts] = useState(() => initialPosts.map((post) => ({ ...post })));
  const [comments, setComments] = useState(
    () =>
      Object.fromEntries(
        Object.entries(initialComments).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.map((comment) => ({ ...comment })) : [],
        ])
      )
  );

  const createPost = useCallback((postData) => {
    const id = generateId();
    const newPost = {
      id,
      title: postData.title.trim(),
      author: postData.author.trim() || "אנונימי",
      category: postData.category,
      tag: postData.tag.trim() || undefined,
      content: postData.content.trim(),
      views: 0,
      comments: 0,
      time: "הרגע",
    };

    setPosts((prev) => [newPost, ...prev]);
    setComments((prev) => ({
      ...prev,
      [id]: [],
    }));
    return newPost;
  }, []);

  const addComment = useCallback((postId, comment) => {
    const id = generateId();
    const newComment = {
      id,
      author: comment.author.trim() || "אנונימי",
      text: comment.text.trim(),
      time: "הרגע",
    };

    setComments((prev) => {
      const previousComments = prev[postId] ?? [];
      return {
        ...prev,
        [postId]: [newComment, ...previousComments],
      };
    });

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments ?? 0) + 1,
            }
          : post
      )
    );

    return newComment;
  }, []);

  const value = useMemo(
    () => ({
      categories: initialCategories,
      posts,
      comments,
      createPost,
      addComment,
    }),
    [posts, comments, createPost, addComment]
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error("useForum must be used within a ForumProvider");
  }
  return context;
}
