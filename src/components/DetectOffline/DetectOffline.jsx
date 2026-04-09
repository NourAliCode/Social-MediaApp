import React from 'react'
import { useNetworkState } from 'react-use';

export default function DetectOffline() {
    const { online } = useNetworkState();
  return (
    <>
    {!online && 
       (
        <div className=" fixed inset-0 bg-slate-900/85 z-50 flex justify-center items-center text-white">
          <h1 className="font-bold text-4xl">
            ⛔ You are currently offline. Please check your internet connection.
          </h1>
        </div>
      )}
    </>
  )
}
