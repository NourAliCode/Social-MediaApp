import React, { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as zod from "zod";
import { AuthContext } from './../../Context/AuthContext';
import logo from '../../assets/loginimg.webp';

const schema = zod.object({
  email: zod.email("Invalid Email")
  .nonempty("Email is Requierd")
  .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,"Not Match... pattern"),

  password:zod.string()
  .nonempty("Password is Requierd")
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"Password shoud contain At least One(spical char, capital char, smole char, number) and between 8 and 16 chars"),

});
export default function Login() {
   const navigate=useNavigate();
   const[apiError,seteapiError]=useState(null);
   const[isLoding,seteisLoding]=useState(false);
   const{userLogin,setuserLogin}=useContext(AuthContext);
 
  const form = useForm({
    defaultValue: {
      email: "",
      password: "",
    },
    resolver:zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, getValues, watch, formState } = form;
  function handleLogin(values) {
    //validation
    //coll API
    seteisLoding(true);
    console.log(values);
    seteapiError(""); 
    axios.post(`https://route-posts.routemisr.com/users/signin`,values)
    .then((res)=>{
      console.log(res.data);
      if(res.data.message==="signed in successfully"){
        localStorage.setItem("userToken",res.data.data.token)
        setuserLogin(res.data.data.token);
        navigate("/")
      }
      console.log(res.data)})
    .catch((err)=>{
      // console.log(err.response?.data?.message);
      seteapiError(err.response?.data?.message);
    }).finally(()=>{
        seteisLoding(false);
    })
  }
  

  return (
   <div className="  md:flex mt-10">
    <div className="logo  md:w-1/2 me-4">
     <img src={logo} alt="Logo" />
    </div>
     <div className="text-center   border-blue-500 border-l-4  md:w-1/2 ">
      <div className="mt-10 font-serif text-cyan-900 font-bold ">
        <h1 className="text-5xl font-bold mb-20 font-serif text-cyan-900">Login Now</h1>
      {apiError&&<p className="bg-red-600 text-white font-bold p-2 m-5 rounded-sm w-100 mx-auto">{apiError}</p>}
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="max-w-md mx-auto my-7 "
      >
        <div>         
          <div className="relative z-0  w-full mb-10 group">
            <input
              {...register(
                "email",
                //    {
                //   pattern: {
                //     value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
                //     message: "invalid email",
                //   },
                // }
              )}
              type="email"
              // name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute start-[5px] top-[5px] text-sm  text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your Email
            </label>
            {formState.errors.email && formState.touchedFields.email && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm font-bold">
                {formState.errors.email?.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-10  group">
            <input
              {...register(
                "password",
                //    {
                //   pattern: {
                //     value:
                //       /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
                //     message: "invalid Password",
                //   },
                // }
              )}
              type="password"
              // name="password"
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute start-[5px] top-[5px]  text-sm  text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your password
            </label>
            {formState.errors.password && formState.touchedFields.password && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm font-bold">
                {formState.errors.password.message}
              </p>
            )}
          </div>
          <button
            disabled={isLoding}
            type="submit"
            className="text-white disabled:bg-slate-900 disabled:cursor-not-allowed bg-brand bg-blue-500 rounded-lg w-full box-border border border-transparent hover:bg-blue-600 cursor-pointer hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            {isLoding?"isLoding...":"Login"}
          </button>
        </div>
      </form>
      </div>
    </div>
   </div>
    
  
  );
}
