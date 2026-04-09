import axios from "axios";
// import React, { useEffect, useState } from "react";
import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "./../PostCreation/PostCreation";
import { Helmet } from "react-helmet";

export default function Home() {
  // const [allPosts, setallPosts] = useState(null);
  // const [isLoading, setisLoading] = useState(true);
  // const [isError, setisError] = useState(false);

  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    // .then((res) => {
    // console.log(res.data.data.posts);
    // setallPosts(res.data.data.posts);
    // console.log(allPosts);
    // })
    // .catch((err) => {
    // setisError(true);
    // console.log(err);
    // })
    // .finally(() => {
    // setisLoading(false);
    // });
  }
  // useEffect(() => {
  //   console.log("Updated state:", allPosts);
  // }, [allPosts]);

  // useEffect(() => {
  //   getAllPosts();
  // }, []);
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
    retry: 3,
  });
  console.log("data.....,", data);
  if (isLoading)
    return (
      <>
        <Loader />
      </>
    );
  if (isError)
    return (
      <>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div className="text-center font-serif flex justify-center items-center h-screen">
          <div className="w-1/2 h-20 bg-cyan-900 rounded-md text-white flex justify-center items-center">
            {/* <p>Error..., Please Tray Again Later</p> */}
            <p>{error.message}</p>
          </div>
        </div>
      </>
    );
  return (
    <>
      <PostCreation />
      {data?.data.data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
