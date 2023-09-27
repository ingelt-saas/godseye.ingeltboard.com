import { useContext, useEffect, useState } from "react";
import discussionApi from "../api/discussion";
import { useInfiniteQuery } from "@tanstack/react-query";
// Components
import MessageBox from "../components/Discussions/MessageBox";

import { SocketContext } from "../contexts";
import DiscussionReports from "../components/Discussions/DiscussionReports";
import headerImg from '../assets/discussion-header.png';
import { formatDate } from "../utilities";
import SendForm from "../components/Discussions/SendForm";

const Discussions = () => {

  // context
  const socket = useContext(SocketContext);

  // states
  const [onlineMembers, setOnlineMembers] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [reportModal, setReportModal] = useState(null);
  const [replyDiscussion, setReplyDiscussion] = useState(null);

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

        <div className="px-5 max-sm:px-2 pb-5 max-sm:pb-2">
          <div className="py-2 max-md:py-4 bg-white w-full shadow-lg flex max-sm:flex-col max-sm:gap-5 items-center justify-between px-5 rounded-[1.2rem]">
            <div className="flex items-center gap-5">
              <div className="flex items-start justify-center flex-col w-full flex-[0.7] md:flex-[0.8]">
                <p className="text-xl md:text-3xl font-medium text-[#1B3B7D] whitespace-nowrap">
                  InGelt Centralized Community
                </p>
                <p className="pt-1 text-[#555454] text-sm md:text-base">
                  "Explore The World Through Us InGelt"
                </p>
              </div>
              <div className="w-[200px] max-xl:hidden">
                <img draggable={false} src={headerImg} alt='' className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="max-sm:w-full flex flex-col max-sm:flex-row max-sm:items-center max-sm:justify-between items-end gap-2">
              <div className="flex gap-3 max-sm:flex-row-reverse items-center">
                <div className="flex flex-col max-sm:items-start items-end">
                  <h3 className="text-[#001E43] font-semibold text-xl">Godseye InGelt</h3>
                </div>
              </div>
              <div className="flex items-center justify-center">
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
          </div>
        </div>

        <div id="scroll-div" className="w-full flex-1 relative">
          <div
            id="journal-scroll"
            className="absolute top-0 left-0 w-full h-full overflow-y-auto"
          >
            <div className="w-full min-h-full flex flex-col gap-y-5 justify-end pt-10 pb-5">
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

              {/* fetch next page button */}
              {hasNextPage && <div className="pb-5 pt-10 w-full flex justify-center h-full">
                <div className="b relative mx-auto h-16 w-44 flex justify-center items-center" onClick={fetchNextPage}>
                  <div className="i h-12 w-44 bg-[#1B3B7D] items-center rounded-xl shadow-2xl cursor-pointer absolute overflow-hidden transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out">
                  </div>
                  <p className="text-center text-white font-semibold z-10 text-sm pointer-events-none">Load More</p>
                </div>
              </div>}

              {/* show discussions */}
              {isSuccess &&
                [...discussions.pages].reverse().map(item =>
                  [...Object.keys(item.rows)].reverse().map((key, index) => <>
                    <div className="w-full py-4 flex justify-center" key={index} >
                      <span className="px-5 py-1 shadow-sm rounded-2xl bg-[#1b3b7d] text-sm font-light text-white">{formatDate(key)}</span>
                    </div>
                    {[...item.rows[key]].reverse().map(discussion => <MessageBox
                      key={discussion.id}
                      data={discussion}
                      setReplyDiscussion={setReplyDiscussion}
                      setDiscussionModal={setReportModal}
                      setReportModal={setReportModal}
                    />)}
                  </>)
                )
              }

            </div>

          </div>
        </div>

        <SendForm refetch={refetch} replyDiscussion={replyDiscussion} setReplyDiscussion={setReplyDiscussion} />

      </div>

      {/* discussion reports modal */}
      <DiscussionReports
        close={() => setReportModal(null)}
        open={Boolean(reportModal)}
        discussion={reportModal}
      />
    </>
  );
};

export default Discussions;
