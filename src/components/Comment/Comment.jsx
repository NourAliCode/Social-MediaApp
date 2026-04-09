import React, { useRef, useState } from "react";
import {
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { IoCloseCircle } from "react-icons/io5";
import { FaImage } from "react-icons/fa";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BiDotsVertical } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";

const PlaceHolder =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function Comment({ comment, userid, queryKey }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { commentCreator,image,content } = comment;
  const { _id } = commentCreator;
  const [isUploaded, setisUploaded] = useState(false);
  const [istextUploaded, setistextUploaded] = useState(false);
  const textInput = useRef(null);
  const imageInput = useRef(null);
  function deletMyComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deletMyComment,
    onSuccess: () => {
      console.log("Commen deleted successfully");
      toast.success("Comment deleted successfully❤️(●'◡'●)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });

      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      console.log("can`t delete this Commen");
      toast.error("⛔ Can`t delete this Comment😔", {
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
  //updat

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
  function updateMyComment() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`,
      prepareData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  function prepareData() {
    const formData = new FormData();
    if (textInput.current.value) {
      formData.append("content", textInput.current.value);
    }
    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    return formData;
  }
  const { mutate: updatmutate } = useMutation({
    mutationFn: updateMyComment,
    onSuccess: (data) => {
      console.log("done", data);
      toast.success("Comment Updated Successfully ❤️(●'◡'●)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
      queryClient.invalidateQueries({ queryKey});

      setisUploaded(null);
    },
    onError: (error) => {
      console.log(error);
      toast.error("⛔ Can`t update this Comment😔", {
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

  function getinputdata() {
    console.log("content", content);
    console.log("image", image);

    if (content) {
      setistextUploaded(content);
    }
    if (textInput.current) {
      textInput.current.value = istextUploaded;
    }

    if (image) {
      setisUploaded(image);
    } else {
      setisUploaded(null);
    }
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }
  return (
    <>
      <div className=" border rounded-xl border-cyan-400 my-2">
        <CardHeader className="flex gap-3 ">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src={comment?.commentCreator.photo || PlaceHolder}
            width={40}
            onError={(e) => {
              e.target.src = PlaceHolder;
            }}
          />
          <div className="flex flex-col">
            <p className="text-md mb-3 text-amber-500 font-serif">
              {comment?.commentCreator.name}
            </p>
            <p className="text-small text-default-500">
              {comment?.createdAt.split("T")[0]}
            </p>
          </div>
          {userid === _id && (
            <Dropdown className="bg-cyan-950">
              <DropdownTrigger>
                <BiDotsVertical className="ml-auto cursor-pointer text-cyan-700 rounded-lg p-1 text-2xl hover:bg-slate-300 transition-all duration-300" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="edit"
                  className="text-cyan-900 flex bg-blue-200"
                  color="primary"
                >
                  <div className="flex gap-2 items-center" onClick={()=>{
                    getinputdata();
                    onOpen()}}>
                    <FaEdit />
                    Edit Comment
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger bg-blue-200"
                  color="danger"
                >
                  <div className="flex gap-2 items-center" onClick={mutate}>
                    <MdAutoDelete />
                    Delete Comment
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </CardHeader>
        <CardBody>
          {comment?.content && (
            <p className="text-md text-cyan-950 font-serif">
              {comment?.content}
            </p>
          )}
          {comment?.image && (
            <img src={comment.image} alt={comment.image}></img>
          )}
        </CardBody>
      </div>

      <div className="model">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 font-serif text-center bg-cyan-950 text-cyan-500">
                  Update Your Comment
                </ModalHeader>
                <ModalBody>
                  <textarea
                    ref={textInput}
                    value={istextUploaded}
                    onChange={(e) => setistextUploaded(e.target.value)}
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
                      updatmutate();
                    }}
                    className="border-e-cyan-950 bg-cyan-400 rounded-md text-white px-2 py-1.5"
                    color="primary"
                    // onPress={onClose}
                  >
                    Update
                  </button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
