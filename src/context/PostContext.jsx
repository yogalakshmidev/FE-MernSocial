import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  async function fetchPosts() {
    try {
      const { data } = await axios.get(
        "https://be-mernsocial.onrender.com/api/post/all",
        //  "http://localhost:6000/api/post/all",
        {
          withCredentials: true, // 🔑 This sends cookies
        }
       
      );

      setPosts(data.posts);
      setReels(data.reels);
      setLoading(false);
      console.log(
        "set post data and set reels data are",
        posts,
        reels,
        data.reels.caption
      );
    } catch (error) {
      console.log("error in add post",error);
      setLoading(false);
    }
  }

  const [addLoading, setAddLoading] = useState(false);

  async function addPost(formdata, setFile, setFilePrev, setCaption, type) {
    setAddLoading(true);
    try {
      alert("type is",type)
      const { data } = await axios.post(
        
        "https://be-mernsocial.onrender.com/api/post/new?type="
        +type,
          // `http://localhost:6000/api/post/new?type=${type}`,
        formdata
      );

      toast.success(data.message);
      fetchPosts();
      setFile("");
      setFilePrev("");
      setCaption("");
      setAddLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setAddLoading(false);
    }
  }

  async function likePost(id) {
    try {
      const { data } = await axios.post(
        "https://be-mernsocial.onrender.com/api/post/like/" +
          // "http://localhost:6000/api/post/like/"+
          id
      );
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function addComment(id, comment, setComment, setShow) {
    try {
      const { data } = await axios.post(
        "https://be-mernsocial.onrender.com/api/post/comment/" +
          // "http://localhost:6000/api/post/comment/"+
          id,
        {
          comment,
        }
      );
      toast.success(data.message);
      fetchPosts();
      setComment("");
      setShow(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function deletePost(id) {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        "https://be-mernsocial.onrender.com/api/post/" +
          // "http://localhost:6000/api/post/"+
          id
      );

      toast.success(data.message);
      fetchPosts();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function deleteComment(id, commentId) {
    try {
      const { data } = await axios.delete(
        `https://be-mernsocial.onrender.com/api/post/comment/${id}?commentId=${commentId}`
        // `http://localhost:6000/api/post/comment/${id}?commentId=${commentId}`
      );

      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <PostContext.Provider
      value={{
        reels,
        posts,
        addPost,
        likePost,
        addComment,
        loading,
        addLoading,
        fetchPosts,
        deletePost,
        deleteComment,
      }}
    >
      {children}
      <Toaster />
    </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);
