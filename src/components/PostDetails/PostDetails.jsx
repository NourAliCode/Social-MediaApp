import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader';
import PostCard from '../PostCard/PostCard';

export default function PostDetails() {
  const {id}=useParams();
  function getpostdetails(){
   return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
   const{data,isError,isLoading,error}=useQuery ({
    queryKey: ["getpostdetails",id],
    queryFn: getpostdetails,
    retry:3,
  });
  // console.log(data?.data.data.post)
  // console.log(id)
  if (isLoading)
    return (
      <>
        <Loader />
      </>
    );
  if (isError)
    return (
      <>
        <div className="text-center font-serif flex justify-center items-center h-screen">
          <div className="w-1/2 h-20 bg-cyan-900 rounded-md text-white flex justify-center items-center">
            {/* <p>Error..., Please Tray Again Later</p> */}
            <p>{error.message}</p>
          </div>
        </div>
      </>
    );
  return (
    <PostCard post={data?.data.data.post} isPostDetails/>
  )
}
