import React from "react";
import { Input } from "@heroui/input";
import { FaRegCommentDots } from "react-icons/fa6";
import { RiTelegram2Line } from "react-icons/ri";
import { FaImage } from "react-icons/fa";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GiSpinalCoil } from "react-icons/gi";
import { toast } from "react-toastify";

export default function CommentCreation({ id, queryKey }) {
  // console.log("Current Post ID:", id);
  // const form = useForm({
  //   defaultValues: {
  //     body: "",
  //     image: "",
  //   },
  // });
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  //....
  // const createdComment = {
  //   content: "",
  //   image: "",
  // };
  function createComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formData,
      
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  //.....
  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      console.log("done", data);
      toast.success("Comment Created Successfully ❤️(●'◡'●)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
      queryClient.invalidateQueries({ queryKey: queryKey });
      reset();
    },
    onError: (error) => {
      console.log(error);
      toast.error(" Can`t Creat this Comment 😔", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
    },
    onSettled: () => {
      console.log("Comment creation completed.");
    },
  });
  const formData = new FormData();

  function handelCreateComennt(data) {
    if (!data.body && !data.image[0]) return;
    // console.log(data);
    if (data.body) {
      formData.append("content", data.body);
    }
    if (data.image[0]) {
      formData.append("image", data.image[0]);
    }
    mutate();
  }
  ///update comment

  return (
    <>
      <div className="my-3 w-[90%] mx-auto curssor-pointer">
        <form onSubmit={handleSubmit(handelCreateComennt)}>
          <Input
            {...register("body")}
            className="my-3 border border-cyan-500 rounded-lg"
            endContent={
              <button
                disabled={isPending}
                type="submit"
                className="cursor-pointer text-xl bg-cyan-950  text-cyan-500  disabled:bg-amber-200  disabled:cursor-not-allowed  p-1.5 rounded-sm flx justify-center items-center"
              >
                {/* <FaRegCommentDots /> */}
                {isPending ? (
                  <GiSpinalCoil className="animate-spin text-cyan-400" />
                ) : (
                  <RiTelegram2Line />
                )}
              </button>
            }
            labelPlacement="outside"
            placeholder="Enter Your Comment...  "
            type="text"
          />
          <input {...register("image")} type="file" id="image" hidden />
          <label htmlFor="image">
            <div className="bg-cyan-950 py-2 text-xl text-cyan-500 rounded-md flex justify-end px-5 cursor-pointer">
              <FaImage />
            </div>
          </label>
        </form>
      </div>
    </>
  );
}
