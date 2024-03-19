import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

interface Post {
  id: number;
  title: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);

  // динамический инпут
  const [limit, setLimit] = useState(15);
  const limitHandler = (newLimit: number) => {
    setLimit(newLimit);
  };

  useEffect(() => {
    if (!initialLoadDone) {
      loadPosts();
      setInitialLoadDone(true);
    } else {
      loadPosts();
    }
  }, [page]);

  const loadPosts = async () => {
    if (!hasMore) return;
    setIsLoading(true);
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    );
    const data = await response.json();
    setPosts((prevPosts) => [...prevPosts, ...data]);
    setIsLoading(false);
    if (data.length === 0) {
      setHasMore(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      !isLoading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="title">Бесконечный скролл</h1>
      <div className="field_wrapper">
        <h3>Введите количество подгружаемых элементов списка:</h3>
        <input
          className="field"
          type="number"
          value={limit}
          onChange={(e) => {
            limitHandler(Number(e.target.value));
          }}
        />
      </div>
      <ul>
        {posts.map((post, i) => (
          <li className="post" key={post.id + i}>
            {post.title} - post.id - {post.id}, i - {i}
          </li>
        ))}
      </ul>
      {isLoading && <div className="placeholder">Загрузка списка...</div>}
    </div>
  );
};

export default App;
