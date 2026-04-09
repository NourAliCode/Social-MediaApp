import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as zod from "zod";

const schema = zod.object({
  name: zod.string()
  .nonempty("Name is Required")
  .min(3,"Min Length is 3 Chars")
  .max(18,"Max Length is 18 Chars"),

  email: zod.email("Invalid Email")
  .nonempty("Email is Requierd")
  .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,"Not Match... pattern"),

  password:zod.string()
  .nonempty("Password is Requierd")
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"Password shoud contain At least One(spical char, capital char, smole char, number) and between 8 and 16 chars"),

  rePassword:zod.string()
  .nonempty("RePassword is Requierd"),

  dateOfBirth:zod.string()
  .refine((date)=>{
    const mydate=new Date(date);
    const currntDate=new Date();
      return (currntDate.getFullYear() - mydate.getFullYear() > 10);
  },"Invalid Date..."),

  // dateOfBirth:zod.coerce.date()
  // .refine((dateValue)=>{
  //   const myDate=dateValue.getFullYear();
  //   const currntDate=new Date().getFullYear;
  //     return currntDate - myDate >10;
  // },"Invalid Date...")
  // .transform((date)=>{
  //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  // }),

  gender:zod.enum(["male","female"]),

}).refine((object)=>{
     return (object.password === object.rePassword)
},{
  error:"passwored & confirmation password not matched",
  path:["rePassword"]
});
export default function Register() {
   const navigate=useNavigate();
   const[apiError,seteapiError]=useState(null);
   const[isLoding,seteisLoding]=useState(false);
 
  const form = useForm({
    defaultValue: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver:zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, getValues, watch, formState } = form;
  function handleRegister(values) {
    //validation
    //coll API
    seteisLoding(true);
    console.log(values);
    seteapiError(""); 
    axios.post(`https://route-posts.routemisr.com/users/signup`,values)
    .then((res)=>{
      console.log(res.data);
      if(res.data.message==="account created"){
        navigate("/login")
      }
       seteisLoding(false);
      console.log(res.data)})
    .catch((err)=>{
      console.log(err.response?.data?.message);
      seteapiError(err.response?.data?.message);
       seteisLoding(false);
    })
  }
  //  const {name, onBlur, onChange, ref} =register("name");
  //.. controled
  // const [name,setName]=useState();
  //  function changName(e){
  //    setName(e.target.value)
  //  }

  return (
    <div className="text-center ">
      <h1 className="text-5xl font-bold mt-6 font-serif text-cyan-900">Register Now</h1>
      {apiError&&<p className="bg-red-600 text-white font-bold p-2 m-5 rounded-sm w-100 mx-auto">{apiError}</p>}
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="max-w-md mx-auto my-7"
      >
        <div className="font-serif text-cyan-600">
          <div className="relative z-0 w-full mb-5 group font-serif text-cyan-900">
            <input
              {...register(
                "name",
                //  {
                //   required: { value: true, message: "name input is requierd" },
                //   minLength: { value: 3, message: "min length 3 chars" },
                //   maxLength: { value: 30, message: "max length 10 chars " },
                // }
              )}
              type="text"
              // onChange={(e)=>{changName(e)}}
              // value={name}
              // name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className=" text-cyan-900 absolute start-1.25 top-3 text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your Name
            </label>
            {formState.errors.name && formState.touchedFields.name && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm font-bold">
                {formState.errors.name?.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
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
              className=" text-cyan-900 absolute start-[5px] top-[5px] text-sm  text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your Email
            </label>
            {formState.errors.email && formState.touchedFields.email && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm font-bold">
                {formState.errors.email?.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group font-serif text-cyan-900">
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
              className="absolute start-[5px] top-[5px] text-sm  text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your password
            </label>
            {formState.errors.password && formState.touchedFields.password && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm font-bold">
                {formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register(
                "rePassword",
                //   {
                //   validate: function (rePasswordValue) {
                //     if (rePasswordValue === getValues("password")) {
                //       return true;
                //     }
                //     return "password & RrePassword not match";
                //   },
                // }
              )}
              type="password"
              // name="rePassword"
              id="rePassword"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="rePassword"
              className=" text-cyan-900 absolute start-[5px] top-[5px] text-sm  text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Confirm password
            </label>
            {formState.errors.rePassword &&
              formState.touchedFields.rePassword && (
                <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm font-bold">
                  {formState.errors.rePassword.message}
                </p>
              )}
          </div>
          <div className="relative z-0 w-full mb-5 group font-serif text-cyan-900">
            <input
              {...register(
                "dateOfBirth",
                //   {
                //   valueAsDate: true,
                //   validate: function (valueOfInput) {
                //     const userDate = valueOfInput.getFullYear();
                //     const currentDate = new Date().getFullYear();
                //     if (currentDate - userDate >= 18) {
                //       return true;
                //     }
                //     else {
                //       return "invald Date to Accept";
                //     }
                //   },
                // }
              )}
              type="date"
              // name="dateOfBirth"
              id="dateOfBirth"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="dateOfBirth"
              className="absolute start-[5px] top-[5px] text-sm  text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Birth Date
            </label>
            {formState.errors.dateOfBirth &&
              formState.touchedFields.dateOfBirth && (
                <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm font-bold">
                  {formState.errors.dateOfBirth.message}
                </p>
              )}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center mb-4">
              <input
                {...register(
                  "gender"
                  // ,
                  //    {
                  //   pattern: {
                  //     value: /^(male|female)$/,
                  //     message: "not valid gender",
                  //   },
                  // }
                )}
                id="male"
                type="radio"
                // name="gender"
                 defaultValue="male"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                defaultChecked
              />
              <label
                htmlFor="male"
                className=" text-cyan-900 select-none ms-2 text-sm font-medium text-heading"
              >
                Male
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                {...register("gender")}
                id="female"
                type="radio"
                // name="gender"
                defaultValue="female"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                defaultChecked
              />
              <label
                htmlFor="female"
                className=" text-cyan-900 select-none ms-2 text-sm font-medium text-heading"
              >
                FeMale
              </label>
            </div>
          </div>
          <button
            disabled={isLoding}
            type="submit"
            className="text-white disabled:bg-slate-900 disabled:cursor-not-allowed bg-brand bg-blue-500 rounded-lg w-full box-border border border-transparent hover:bg-blue-600 cursor-pointer hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            {isLoding?"isLoding...":"Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
