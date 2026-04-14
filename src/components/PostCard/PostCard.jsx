import {
  Card,
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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { FaImage } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import Comment from "../Comment/Comment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentCreation from "../CommentCreation/CommentCreation";
import { BiDotsVertical } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

const { PlaceHolder } =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function PostCard({ post, isPostDetails = false }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // console.log(post);
  const { user, createdAt, body, image, topComment, id } = post;
  const { name, photo } = user;
  const { userid } = useContext(AuthContext);
  // const[usercommentid,setusercommentid]=useState(null);
  const userId = user._id;
  const comment = topComment;
  const navigate = useNavigate();
  const [isUploaded, setisUploaded] = useState(false);
  const [istextUploaded, setistextUploaded] = useState(false);
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
  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const { data } = useQuery({
    queryKey: ["getPostComments", id],
    queryFn: getPostComments,
    enabled: isPostDetails,
  });

  console.log("comments id.....", id);
  console.log("user.....", user._id);
  console.log("comments data.....", data?.data.data.comments);
  if (!body && !image) return;
  // console.log(comment?.commentCreator.name);
  function deletMyPost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
 
  const { mutate } = useMutation({
    mutationFn: deletMyPost,
    onSuccess: () => {
      console.log("post deleted successfully");
      toast.success("Post deleted successfully❤️(●'◡'●)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });

      queryClient.invalidateQueries(["getAllPosts"]);
      navigate("/");
    },
    onError: () => {
      console.log("can`t delete this post");
      toast.error("⛔ Can`t delete this post😔", {
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
  //--------- updat post
  function updateMyPost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}`,
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
      formData.append("body", textInput.current.value);
    }
    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    return formData;
  }
  const { mutate: updatmutate } = useMutation({
    mutationFn: updateMyPost,
    onSuccess: (data) => {
      console.log("done", data);
      toast.success("Post Updated Successfully ❤️(●'◡'●)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });

      setisUploaded(null);
    },
    onError: (error) => {
      console.log(error);
      toast.error("⛔ Can`t update this Post😔", {
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
    console.log("body", body);
    console.log("image", image);

    if (body) {
      setistextUploaded(body);
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
      <Card className="max-w-125 mx-auto mb-6 mt-6">
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src={photo || PlaceHolder}
            width={40}
            onError={(e) => {
              e.target.src = PlaceHolder;
            }}
          />
          <div className="flex flex-col">
            <p className="text-md mb-3 text-cyan-800 font-serif">{name}</p>
            <p className="text-small text-default-500">
              {createdAt.split("T")[0]}
            </p>
          </div>
          {userId === userid && (
            <Dropdown className="bg-cyan-950">
              <DropdownTrigger>
                <BiDotsVertical className="ml-auto cursor-pointer text-cyan-700 rounded-lg p-1 text-2xl hover:bg-slate-300 transition-all duration-300" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="edit"
                  textValue="Edit Post"
                  className="text-cyan-900 flex bg-blue-200"
                  color="primary"
                >
                  <div
                    className="flex gap-2 items-center"
                    onClick={() => {
                      getinputdata();
                      onOpen();
                    }}
                  >
                    <FaEdit />
                    Edit Post
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  textValue="Delete Post"
                  className="text-danger bg-blue-200"
                  color="danger"
                >
                  <div className="flex gap-2 items-center" onClick={mutate}>
                    <MdAutoDelete />
                    Delete Post
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </CardHeader>
        <Divider />
        <CardBody>
          {body ? <p className="mb-3 text-cyan-950 font-serif">{body}</p> : ""}
          {image && <img src={image} alt={body}></img>}
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="w-full flex justify-between ">
            <div className=" flex gap-2 items-center cursor-pointer">
              <AiOutlineLike />
              Like
            </div>
            <div className="flex gap-2 items-center cursor-pointer">
              <Link
                className="flex gap-2 items-center cursor-pointer"
                to={`/postdetails/${id}`}
              >
                <FaRegComment />
                Comments
              </Link>
            </div>
            <div className="flex gap-2 items-center cursor-pointer">
              <RiShareForwardLine />
              Share
            </div>
          </div>
        </CardFooter>
        <Divider className="bg-cyan-400" />
        <CommentCreation
          id={id}
          queryKey={isPostDetails ? ["getPostComments"] : ["getAllPosts"]}
        />
        {isPostDetails === false && comment && (
          <Comment comment={comment} userid={userid} />
        )}
        {isPostDetails &&
          data?.data.data.comments.map((currentComment) => (
            <Comment
              key={currentComment.id}
              comment={currentComment}
              userid={userid}
              queryKey={isPostDetails ? ["getPostComments"] : ["getAllPosts"]}
            />
          ))}
      </Card>
      <div className="model">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 font-serif text-center bg-cyan-950 text-cyan-500">
                  Update Your Post
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
