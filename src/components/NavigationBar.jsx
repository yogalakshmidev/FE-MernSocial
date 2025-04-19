import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineHome,MdHomeFilled  } from "react-icons/md";
import { BsCameraReelsFill,BsCameraReels  } from "react-icons/bs";
import { IoSearchCircleOutline,IoSearchCircle  } from "react-icons/io5";
import { AiFillMessage,AiOutlineMessage  } from "react-icons/ai";
import { MdAccountCircle,MdOutlineAccountCircle  } from "react-icons/md";

const NavigationBar = () => {
  const [tab,setTab]= useState(window.location.pathname);
  
  return (
    <div className='flex justify-around   fixed bottom-0 w-full bg-white py-3'>
      <div className="flex">
        <Link to={"/"} onClick={()=>setTab("/")} className='flex flex-col items-center text-2xl'>
        <span>
       {tab === "/"? <MdHomeFilled/>: <MdOutlineHome />}
        </span>
        </Link>
      </div>

      <div className="flex justify-around">
        <Link to={"/reels"} onClick={()=>setTab("/reels")} className='flex flex-col items-center text-2xl'>
        <span>
        {tab === "/reels"? <BsCameraReelsFill/>: <BsCameraReels />}
        
        </span>
        </Link>
      </div>

      <div className="flex justify-around">
        <Link to={"/search"} onClick={()=>setTab("/search")} className='flex flex-col items-center text-2xl'>
        <span>
        {tab === "/search"? <IoSearchCircle/>: <IoSearchCircleOutline />}
        
        </span>
        </Link>
      </div>

      <div className="flex justify-around">
        <Link to={"/chat"} onClick={()=>setTab("/chat")} className='flex flex-col items-center text-2xl'>
        <span>
        {tab === "/chat"? <AiFillMessage/>: <AiOutlineMessage />}
         </span>
        </Link>
      </div>

      <div className="flex justify-around">
        <Link to={"/account"} onClick={()=>setTab("/account")} className='flex flex-col items-center text-2xl'>
        <span>
        {tab === "/account"? <MdAccountCircle/>: <MdOutlineAccountCircle />}
        
        </span>
        </Link>
      </div>

    </div>
  )
}

export default NavigationBar