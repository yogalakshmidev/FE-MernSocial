import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import axios from "axios";
import { useEffect } from "react";
import { Loading } from "../components/Loading";
import Modal from "../components/Modal";

const UserAccount = ({ user: loggedInUser }) => {
  // console.log("loggedInUser user data are", loggedInUser);
  const navigate = useNavigate();

  const { posts, reels } = PostData();

  const [user, setUser] = useState([]);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  // console.log("datas in posts and reels are", posts, reels);

  async function fetchUser() {
    try {
      const { data } = await axios.get(
        "https://be-mernsocial.onrender.com/api/user/" 
        + params.id);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  let myPosts;

  if (posts) {
    myPosts = posts.filter((post) => post.owner._id === user._id);
  }
  // console.log(myPosts);
  let myReels;

  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === user._id);
  }

  // console.log(myReels);

  const [type, setType] = useState("post");

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

  const [followed, setFollowed] = useState(false);

  const { followUser } = UserData();

  const followHandler = () => {
    setFollowed(!followed);
    // const id=params.id;
    // console.log("userid is",id);
    followUser(user.data._id, fetchUser);
  };

  const followers = user.followers;
  // console.log("value in the followers are ", followers);

  useEffect(() => {
    if (followers && followers.includes(loggedInUser._id)) setFollowed(true);
  }, [user]);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function followData() {
    try {
      // console.log("user data for follow", user.data._id);
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

  useEffect(() => {
    followData();
  }, [user]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <>
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
                      // src=""
                      src={loggedInUser.data.profilePic.url}
                      alt=""
                      className="w-[180px] h-[180px] rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-800 font-semibold">
                      {user.data.name}
                    </p>
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
                    <p className="text-gray-500 text-sm cursor-pointer"
                    onClick={() => {
                      setShow1(true);
                    }}>
                      {user.data.followings.length}
                      <span className="p-2">Following</span>
                    </p>

                    {user.data.id === loggedInUser.data._id ? (
                      ""
                    ) : (
                      <button
                        onClick={followHandler}
                        className={`px-5 py-2 text-white rounded-md ${
                          followed ? "bg-red-500" : "bg-blue-400"
                        }`}
                      >
                        {followed ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>
                </div>
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
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserAccount;
