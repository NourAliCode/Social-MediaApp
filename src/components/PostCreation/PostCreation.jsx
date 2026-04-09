import React, { useRef, useState } from "react";
import { Avatar } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { IoCloseCircle } from "react-icons/io5";

import { FaImage } from "react-icons/fa";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function PostCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isUploaded, setisUploaded] = useState(false);
  const textInput = useRef(null);
  const imageInput = useRef(null);
  const queryClient = useQueryClient();

  function handleImagePreview(e) {
    const path = URL.createObjectURL(e.target.files[0]);
    if (path) {
      setisUploaded(path);
    }
  }
  function handleRemoveImage() {
    setisUploaded(false);
    imageInput.current.value = "";
  }
  function prepareData() {
    const formData = new FormData();
    if (textInput.current.value) {
      formData.append("body", textInput.current.value);
    }
    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    console.log(formData.get("body"));
    console.log(formData.get("image"));
    return formData;
  }
  function createPost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts`,
      prepareData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    // console.log( "test",prepareData().get("body"),prepareData().get("image"));
  }
  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      console.log("done", data);
      toast.success("Post Created Successfully ❤️(●'◡'●)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      //  if(textInput.current.value!=null){
      //   textInput.current.value = "";
      //  }
      //   if(imageInput.current.value!=null){
      //    imageInput.current.value = "";
      //   }

      setisUploaded(null);
    },
    onError: (error) => {
      console.log(error);
      toast.error("⛔ Can`t Creat this Post😔", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  return (
    <>
      <div className="max-w-125 mx-auto mb-6 mt-6 bg-slate-300 rounded-md p-2 ">
        <div className="flex gap-3 items-center">
          <Avatar
            isBordered
            radius="sm"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
          <input
            onClick={onOpen}
            type="text"
            readOnly
            className="w-full bg-cyan-950 rounded-md p-1 text-cyan-300 text-center"
            placeholder="What`s in Your Mind..."
          />
        </div>
        <div className="model">
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 font-serif text-center bg-cyan-950 text-cyan-500">
                    Creat Your Post
                  </ModalHeader>
                  <ModalBody>
                    <textarea
                      ref={textInput}
                      name=""
                      id=""
                      className="w-full bg-slate-300 rounded-md text-cyan-950 p-2 text-center"
                      placeholder="Creat Post"
                    ></textarea>
                    {isUploaded && (
                      <div className="relative">
                        <img
                          alt="Card background"
                          className="object-cover rounded-xl h-60 w-full"
                          //   src="https://heroui.com/images/hero-card-complete.jpeg"
                          //   src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                          src={isUploaded}
                        />
                        <IoCloseCircle
                          onClick={handleRemoveImage}
                          className="text-cyan-500  text-2xl absolute top-2 right-2"
                        />
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter className="flex justify-end gap-2 items-center">
                    <label htmlFor="img">
                      <div className="bg-cyan-950 py-2 text-xl text-cyan-500 rounded-md flex justify-end px-5 cursor-pointer">
                        <FaImage />
                      </div>
                      <input
                        ref={imageInput}
                        type="file"
                        id="img"
                        hidden
                        onChange={handleImagePreview}
                      />
                    </label>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <button
                      onClick={function () {
                        onClose();
                        mutate();
                      }}
                      className="border-e-cyan-950"
                      color="primary"
                      // onPress={onClose}
                    >
                      Create
                    </button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}
