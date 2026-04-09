import React from 'react'
import {Oval} from "react-loader-spinner";

export default function Loader() {
  return (
    <>
       <div className="text-center font-serif flex justify-center items-center h-screen">
          <div className="  flex justify-center items-center">
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#164e63"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            
          </div>
        </div>
    </>
  )
}
