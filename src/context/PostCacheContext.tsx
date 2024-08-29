import React, { createContext, useState, useContext, ReactNode } from "react";
import { Post } from "@/types/post";

interface PostCacheContextProps {
  cache: { [id: string]: Post };
  setCache: (id: string, post: Post) => void;
}

const PostCacheContext = createContext<PostCacheContextProps | undefined>(
  undefined
);

export const PostCacheProvider = ({ children }: { children: ReactNode }) => {
  const [cache, setCacheState] = useState<{ [id: string]: Post }>({});

  const setCache = (id: string, post: Post) => {
    setCacheState((prevCache) => ({
      ...prevCache,
      [id]: post,
    }));
  };

  return (
    <PostCacheContext.Provider value={{ cache, setCache }}>
      {children}
    </PostCacheContext.Provider>
  );
};

export const usePostCache = () => {
  const context = useContext(PostCacheContext);
  if (!context) {
    throw new Error("usePostCache must be used within a PostCacheProvider");
  }
  return context;
};
