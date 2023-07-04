import moment from "moment/moment";
import Image from "../shared/Image";
import ProfileImage from "../shared/ProfileImage";
import { Tooltip } from "@mui/material";

const MessageBox = ({ data }) => {

  const {
    message,
    senderName,
    senderImage,
    senderGender,
    senderId,
    createdAt,
    senderCountry,
    discussionImages,
    discussionReports
  } = data;

  return (
    <div
      className={`w-full mt-2 lg:mt-4 md:first:mt-32 last:mb-28 overflow-y-auto`}
    >
      <div className={`chat-message`}>
        {message && (
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-lg max-w-xl mx-2 order-2 items-center justify-center">
              <div className="flex flex-col gap-y-1">
                <div
                  className="rounded-lg rounded-bl-none py-2 px-3"
                  style={{ backgroundColor: "#F2F2F2" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#1B3B7D]">{senderName}</p>
                    <p className="text-sm text-[#1B3B7D] ml-3">
                      {senderCountry}
                    </p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-lg text-left">{message}</p>
                    <div className="min-w-max text-right text-xs pl-3">
                      {moment(createdAt).format("LT")}
                    </div>
                  </div>
                </div>
                {discussionReports.length > 0 && <span className="text-xs font-medium text-[#1B3B7D]">{discussionReports.length} people report this message</span>}
              </div>
            </div>
            <ProfileImage
              alt={'Sender Image'}
              src={senderImage}
              className="w-10 h-10 rounded-full order-1 object-cover"
              gender={senderGender}
            />
          </div>
        )}

        {Array.isArray(discussionImages) && discussionImages.length > 0 && (
          <div className="flex flex-row-reverse items-end justify-end">
            <div className="flex flex-col">
              {discussionImages.map((item) => (
                <div
                  className="rounded-md mb-4 last:mb-0 w-96 max-w-[90%] overflow-hidden cursor-pointer ml-2 mr-auto bg-white"
                  key={item.id}
                >
                  <Image
                    src={item.image}
                    alt=""
                    className="w-full h-auto rounded-md"
                  />
                  <p className="text-left text-xs text-[#00285A] mt-1 pl-3 min-w-max">
                    {moment(createdAt).format("LT")}
                  </p>
                  {discussionReports.length > 0 && <span className="text-xs font-medium text-[#1B3B7D]">{discussionReports.length} people report this message</span>}
                </div>
              ))}
            </div>
            <ProfileImage
              alt={'Sender Image'}
              src={senderImage}
              className="w-10 h-10 rounded-full order-1 object-cover"
              gender={senderGender}
            />
          </div>
        )}
      </div>

    </div >
  );
};

export default MessageBox;
