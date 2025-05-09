import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import axios from "axios";
import Modal from "../components/Modal";
import {Loading} from '../components/Loading'
import { CiEdit } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";

const Account = ({ user }) => {
  // console.log("user data are",user,user.data.name);
  const navigate = useNavigate();

  const { logoutUser,updateProfilePic,updateProfileName  } = UserData();

  const { posts, reels, loading } = PostData();

  // console.log("datas in posts and reels are",posts,reels);

  let myPosts;

  if (posts) {
    // user._id,posts.user._id,
    
    myPosts = posts.filter((post) => {
      console.log("datas in posts in account page are",user.data._id,post.owner._id,user._id,post._id);
      post.owner._id === user.data._id
    })
      
  }
  // console.log(myPosts);
  let myReels;

  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === user.data._id);
  }

  // console.log(myReels);

  const [type, setType] = useState("post");

  const logoutHandler = () => {
    logoutUser(navigate);
  };

  const [index, setIndex] = useState(0);
  const prevReel = () => {
    if (index === 0) {
      console.log("nul in prevreel");
      return null;
    }
    setIndex(index - 1);
  };

  const nextReel = () => {
    if (index === myReels.length - 1) {
      console.log("null");
      return null;
    }
    setIndex(index + 1);
  };

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function followData() {
    try {
      
      const { data } = await axios.get(
        "https://be-mernsocial.onrender.com/api/user/followdata/" 
        + user.data._id);
      // console.log("Followers data", data);
      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.log(error);
    }
  }

  const [file, setFile] = useState("");

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const changleImageHandler = () => {
    console.log("user profile image id is",user.data._id);
    const formdata = new FormData();

    formdata.append("file", file);

    updateProfilePic(user.data._id, formdata,setFile);
  };


  useEffect(() => {
    followData();
  }, [user]);


  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState(user.name ? user.name : "");

  const UpdateName = () => {
    updateProfileName(user._id, name, setShowInput);
  };

  const [showUpdatePass, setShowUpdatePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://be-mernsocial.onrender.com/api/user/"
         + user._id, {
        oldPassword,
        newPassword,
      });

      toast.success(data.message);
      setOldPassword("");
      setNewPassword("");
      setShowUpdatePass(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }



  return (
    <>
      {user && (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div
              className="bg-gray-100 min-h-screen flex flex-col 
    gap-4 items-center justify-center pt-3 pb-14"
            >
              {show && (
                <Modal
                  value={followersData}
                  title={"Followers"}
                  setShow={setShow}
                />
              )}

              {show1 && (
                <Modal
                  value={followingsData}
                  title={"Followings"}
                  setShow={setShow1}
                />
              )}

              <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md">
                <div
                  className="image flex flex-col justify-between
        mb-4 gap-4"
                >
                  <img
                    src={user.data.profilePic.url}
                    alt=""
                    className="w-[180px] h-[180px] rounded-full"
                  />
            <div className="update w-[220px] flex flex-col justify-center items-center">
            <input type="file" 
            onChange={changeFileHandler} 
            required/>
              <button
               className="bg-blue-500 text-white px-3 py-2"
               onClick={changleImageHandler}>Update Profile</button>

            </div>
            </div>

                <div className="flex flex-col gap-2">
                  {showInput? (<>
                  <div className="flex justify-center items-center gap-2">
                  <input 
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                  className='custom-input' 
                  style={{width:"80px"}}/>
                  <button onClick={UpdateName} >Update</button>
                  <button
                  onClick={()=>setShowInput(false)}
                  className="bg-red-400 text-white p-2 rounded-full">X</button>

                  </div>
                  </>):(<p className="text-gray-800 font-semibold">
                    {user.data.name}
                    <button onClick={()=>setShowInput(true)}>
                      <CiEdit/>
                    </button>
                  </p>)}
                  <p className="text-gray-500 text-sm">{user.data.email} </p>
                  <p className="text-gray-500 text-sm">{user.data.gender}</p>
                  <p
                    className="text-gray-500 text-sm cursor-pointer"
                    onClick={() => {
                      setShow(true);
                    }}
                  >
                    {user.data.followers.length}
                    <span className="p-2">Followers</span>
                  </p>
                  <p
                    className="text-gray-500 text-sm cursor-pointer"
                    onClick={() => {
                      setShow1(true);
                    }}
                  >
                    {user.data.followings.length}
                    <span className="p-2">Following</span>
                  </p>
                  <button onClick={logoutHandler}  className="bg-red-500 text-white rounded-md" >     Logout        </button>
                </div>
              </div>

              <button onClick={()=>setShowUpdatePass(!showUpdatePass)} className='bg-blue-500 px-2 py-1 rounded-sm text-white'>       {showUpdatePass? "X":"Update Password"}     </button> 

              {
                showUpdatePass && 
                <form onSubmit={updatePassword}
                 className = "flex justify-center items-center flex-col bg-white p-2 rounded-sm gap-4">
                  <input type="password" className="custom-input" placeholder='Old Password'
                  value={oldPassword}
                  onChange={e=>setOldPassword(e.target.value)}
                  required/>
                  
                  <input type="password" className="custom-input" placeholder='New Password'
                  value={newPassword}
                  onChange={e=>setNewPassword(e.target.value)}
                  required/>

                  <button type='submit' className='bg-blue-500 px-2 py-1 rounded-sm text-white'>Update Password </button>
                  </form>
              }

              <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
                <button onClick={() => setType("post")}> Posts</button>
                <button onClick={() => setType("reel")}>Reels</button>
              </div>
              {type === "post" && (
                <>
                  {myPosts && myPosts.length > 0 ? (
                    myPosts.map((e) => (
                      <PostCard type={"post"} value={e} key={e._id} />
                    ))
                  ) : (
                    <p>No Post Yet</p>
                  )}
                </>
              )}

              {type === "reel" && (
                <>
                  {myReels && myReels.length > 0 ? (
                    <div className="flex gap-3 justify-center items-center">
                      <PostCard
                        type={"reel"}
                        value={myReels[index]}
                        key={myReels[index]._id}
                      />
                      <div className="button flex flex-col justify-center items-center gap-6">
                        {index === 0 ? (
                          ""
                        ) : (
                          <button
                            className="bg-gray-500 text-white py-5 px-5 rounded-full"
                            onClick={prevReel}
                          >
                            <FaArrowUpLong />
                          </button>
                        )}
                        {index === myReels.length - 1 ? (
                          " "
                        ) : (
                          <button
                            onClick={nextReel}
                            className="bg-gray-500 text-white py-5 px-5 rounded-full"
                          >
                            <FaArrowDownLong />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>No Reel Yet</p>
                  )}
                </>
              )}

              

            </div>
          )}
        </>
      )}
    </>
  );
};

export default Account;
