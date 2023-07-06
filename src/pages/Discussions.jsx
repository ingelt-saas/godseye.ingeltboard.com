import { useContext, useEffect, useState } from "react";
import discussionApi from "../api/discussion";
import { useInfiniteQuery } from "@tanstack/react-query";
// Components
import MessageBox from "../components/Discussions/MessageBox";

import { useRef } from "react";
import { SocketContext } from "../contexts";
import DiscussionReports from "../components/Discussions/DiscussionReports";

const Discussions = () => {

  // context
  const socket = useContext(SocketContext);

  // states
  const [onlineMembers, setOnlineMembers] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [discussionModal, setDiscussionModal] = useState(null);
  const messageBoxRef = useRef();
  const limit = 20;

  const formatNumber = (number) => {
    const abbreviations = {
      1e3: "k",
      1e5: "L",
    };

    for (const key in abbreviations) {
      if (Math.abs(number) >= key) {
        return `${(number / key).toFixed(1)}${abbreviations[key]}`;
      }
    }

    return number.toString();
  };

  const scrollToBottom = () => {
    const messageBox = document.getElementById("scroll-div");
    if (messageBox) {
      messageBox.scroll(0, messageBox.scrollHeight);
    }
    // console.log(messageBox.scrollHeight)
    // messageBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // infinite scroll 
  const { data: discussions = [], isLoading, refetch, hasNextPage, fetchNextPage, isSuccess } = useInfiniteQuery({
    queryKey: ['messages'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await discussionApi.getAll(pageParam, limit);
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      let maxPages = lastPage.count / limit;
      maxPages = Math.ceil(maxPages);
      let nextPage = allPages.length + 1;
      return nextPage <= maxPages ? nextPage : undefined;
    }
  });

  useEffect(() => {
    const messageBox = document.getElementById("scroll-div");
    messageBox.scroll(0, messageBox.scrollHeight);
  }, [discussions]);

  useEffect(() => {
    const getAll = async () => {
      // const { data } = await discussionApi.count();
      // setOnlineMembers(data.online);
      // setTotalMembers(data.totalMembers);
    };
    getAll();
  }, []);


  // Check For new messages and update the state
  useEffect(() => {
    socket.on("message-ack", (data) => {
      // console.log(data.senderId, student.id)
      // if (data.senderId === student.id) {
      //   console.log('match')
      //   setMessage("");
      //   setSelectedImages([]);
      //   setLoading(false);
      // }
      refetch();
      scrollToBottom();
      // getDiscussions();
    });
  }, [socket, refetch]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="py-8 bg-white w-full shadow-lg flex items-center justify-center px-5">
          <div className="flex items-start justify-center flex-col w-full flex-[0.7] md:flex-[0.8]">
            <p className="text-xl md:text-3xl font-medium text-[#1B3B7D]">
              InGelt Centralized Community
            </p>
            <p className="pt-1 text-[#555454] text-sm md:text-base">
              "Explore The World Through Us InGelt"
            </p>
          </div>
          <div className="w-full flex items-center justify-center flex-[0.3] md:flex-[0.2]">
            <div className="flex items-start justify-center flex-col">
              <div className="flex items-center justify-center">
                <p className="text-[#828282] md:text-base text-xs pr-2">
                  {onlineMembers}
                  &nbsp;Online
                </p>
                <div className="w-2 h-2 rounded-full bg-[#00FF19]"></div>
              </div>
              <p className="text-[#828282] md:text-base text-xs">
                {formatNumber(totalMembers)}
                &nbsp;Members
              </p>
            </div>
          </div>
        </div>
        <div id="scroll-div" className="w-full overflow-y-auto flex-1">
          <div
            id="journal-scroll"
            className="flex-1 flex flex-col gap-y-3 py-3 items-center justify-center w-full px-5"
          >
            {/* loading animation */}
            {isLoading && <div className="py-5 flex justify-center w-full">
              <svg width="100" height="100" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="#001E43"
                  strokeWidth="4"
                >
                  <animate
                    attributeName="r"
                    values="50; 30; 50"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-width"
                    values="4; 8; 4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>}

            {hasNextPage && <div className="pb-5 pt-10 w-full flex justify-center h-full">
              <div className="b relative mx-auto h-16 w-44 flex justify-center items-center" onClick={fetchNextPage}>
                <div className="i h-12 w-44 bg-[#1B3B7D] items-center rounded-xl shadow-2xl cursor-pointer absolute overflow-hidden transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out">
                </div>
                <p className="text-center text-white font-semibold z-10 pointer-events-none">Load More</p>

              </div>
            </div>}

            {/* show discussions */}
            {isSuccess &&
              [...discussions.pages].reverse().map(item =>
                Array.isArray(item?.rows) && [...item?.rows].reverse().map(discussion =>
                  <MessageBox key={discussion.id} data={discussion} setDiscussionModal={setDiscussionModal} />
                )
              )}
            {/* {Array.isArray(discussions) &&
            discussions?.map((item) => (
              
            ))}{" "} */}
          </div>
        </div>
        <div ref={messageBoxRef} />
      </div>

      {/* discussion reports modal */}
      <DiscussionReports
        close={() => setDiscussionModal(null)}
        open={Boolean(discussionModal)}
        discussion={discussionModal}
      />
    </>
  );
};

export default Discussions;