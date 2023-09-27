import { useContext, useState } from "react";
import { AdminContext } from "../../contexts";
import PropTypes from 'prop-types';
import { Tooltip } from "@mui/material";
import { Reply, Report, Verified } from "@mui/icons-material";
import moment from "moment";
import { Gallery } from "react-photoswipe-gallery";
import 'photoswipe/dist/photoswipe.css'
import GalleryItem from "./GalleryItem";
import logo from '../../assets/logo.jpeg';
import ProfileImage from "../shared/ProfileImage";
import Flag from "react-world-flags";
import { Country } from 'country-state-city';
import { useLayoutEffect } from "react";

const CountryFlag = ({ country, name }) => {

    const [countries, setCountries] = useState([]);

    useLayoutEffect(() => {
        setCountries(Country.getAllCountries());
    }, [country])

    // let countries = Country.getAllCountries();
    let countryCode = countries.find(i => i.name === country);

    if (countryCode) {
        return <>
            <Flag code={countryCode.isoCode} width={20} />
            {name && country}
        </>
    }

    return <>{country}</>;
}

const MessageBox = ({ data, setReplyDiscussion, setReportModal }) => {

    // context
    const { inGelt } = useContext(AdminContext);

    // destructure data object
    const {
        message,
        createdAt,
        senderId,
        ParentDiscussion,
        discussionImages,
        discussionReports,
        senderName,
        senderGender,
        senderCountry,
        senderImage,
        senderVerified
    } = data;

    // admin verify
    const isAdmin = inGelt.id === senderId;

    const reporterFind = discussionReports.find(i => i.reporterId === inGelt.id);

    return (
        <div className={`w-full flex flex-row ${isAdmin ? 'justify-end' : 'justify-start'}`}>

            {/* admin message */}
            {isAdmin && <div className="w-fit md:max-w-[70%] max-w-[90%] flex flex-row items-end">
                <div className="flex flex-col items-end gap-y-1 flex-1">

                    {/* if message field is not empty or null */}
                    {message && <div className="rounded-md rounded-br-none bg-[#1b3b7d] flex-1 py-2 px-2 relative">
                        <Tooltip title='Reply'>
                            <button onClick={() => setReplyDiscussion(data)} className="absolute top-1/2 -translate-y-1/2 right-full text-[#1b3b7d]">
                                <Reply />
                            </button>
                        </Tooltip>
                        <div className="flex flex-col gap-y-1 justify-end">
                            {ParentDiscussion && <p className="text-xs rounded-lg p-1 bg-[#f2f2f2] bg-opacity-50 text-white">{ParentDiscussion?.message}</p>}
                            <p className="text-sm text-white flex gap-x-1 items-start">
                                <span className="flex-1">{message}</span>
                            </p>
                            <p className="text-right text-xs text-white pl-3 min-w-max opacity-75">
                                {moment(createdAt).format("LT")}
                            </p>
                        </div>
                    </div>
                    }

                    {/* discussion images show */}
                    {Array.isArray(discussionImages) && discussionImages.length > 0 &&
                        <div className="rounded-md rounded-br-none bg-[#1b3b7d] flex-1 py-2 px-2 flex-col flex gap-1 items-end">
                            <Gallery>
                                <div className="flex flex-col md:w-[400px] gap-2">
                                    {discussionImages.map(item => item.image && <GalleryItem key={item.image} image={item.image} />)}
                                </div>
                            </Gallery>
                            <p className="text-right text-xs text-white pl-3 min-w-max opacity-75">
                                {moment(createdAt).format("LT")}
                            </p>
                        </div>
                    }

                    {discussionReports.length > 0 && <span className="!text-xs text-[#1b3b7d] font-medium">{discussionReports.length} more people reported this message</span>}
                </div>

                {/* my self image show */}
                <div className="px-2">
                    <img
                        src={logo}
                        alt="InGelt Logo"
                        draggable={false}
                        className={'h-10 w-10 rounded-full object-cover'}
                    />
                </div>
            </div>}

            {/* student and other message */}
            {!isAdmin && <div className="w-fit md:max-w-[70%] max-w-[82%] flex flex-row items-end">

                {/* sender image show */}
                <div className="px-2 w-[55px] h-[40px]">
                    <ProfileImage
                        alt={senderName}
                        gender={senderGender}
                        src={senderImage}
                        className={'h-10 w-10 rounded-full object-cover'}
                    />
                </div>

                <div className="flex flex-col gap-y-1 flex-1">

                    {/* if message field is not empty or null */}
                    {message && <div className="rounded-md rounded-bl-none bg-[#F2F2F2] flex-1 py-2 px-2 shadow-md relative">
                        <span className="absolute flex items-center gap-x-1 top-1/2 -translate-y-1/2 left-full pl-1">
                            <Tooltip title='Reply'>
                                <button onClick={() => setReplyDiscussion(data)} className="text-[#1b3b7d] outline-none" style={{ transform: 'rotateY(180deg)' }}>
                                    <Reply />
                                </button>
                            </Tooltip>
                        </span>

                        <div className="flex flex-col gap-y-1 justify-start">
                            <p className="flex text-xs font-semibold justify-between gap-x-4 text-[#1b3b7d] w-full">
                                <span>
                                    {senderName}
                                    {senderVerified ? <Verified className="!ml-1 !w-4 !h-4" /> : ''}
                                </span>
                                <span className="flex gap-x-2 items-center">{<CountryFlag name={true} country={senderCountry} />}</span>
                            </p>
                            {ParentDiscussion && <p className="text-xs rounded-lg p-1 bg-[#fff] text-[#1b3b7d]">{ParentDiscussion?.message}</p>}
                            <p className="text-sm text-[#1b3b7d] flex gap-x-1 items-start">
                                <span className="flex-1">{message}</span>
                            </p>
                            <div className='flex items-end justify-between'>
                                <span>
                                    <Tooltip title='Report'>
                                        <button onClick={() => setReportModal(data)} className="text-[#1b3b7d]">
                                            <Report fontSize="small" />
                                        </button>
                                    </Tooltip>
                                </span>
                                <p className="text-left text-xs text-[#1b3b7d] min-w-max opacity-75">
                                    {moment(createdAt).format("LT")}
                                </p>
                            </div>
                        </div>
                    </div>}

                    {Array.isArray(discussionImages) && discussionImages.length > 0 &&
                        <>
                            <div className="rounded-md rounded-br-none bg-[#F2F2F2] flex-1 shadow-md py-2 px-2 flex-col flex gap-1 items-start">
                                <p className="flex text-xs font-semibold justify-between gap-x-2 text-[#1b3b7d] w-full">
                                    <span>{senderName}</span>
                                    <span className="flex gap-x-2 items-center">{<CountryFlag name={true} country={senderCountry} />}</span>
                                </p>
                                {
                                    <Gallery>
                                        <div className="flex flex-col md:w-[400px] gap-2">
                                            {discussionImages.map(item => item.image && <GalleryItem key={item.image} image={item.image} />)}
                                        </div>
                                    </Gallery>
                                }
                                <p className="text-left text-xs text-[#1b3b7d] min-w-max opacity-75">
                                    {moment(createdAt).format("lll")}
                                </p>
                            </div>
                        </>
                    }
                    {discussionReports.length > 0 && <span className="!text-xs text-[#1b3b7d] font-medium">{reporterFind ? (discussionReports.length <= 1 ? 'You reported this message' : `You & ${discussionReports.length - 1} more people reported this message`) : `${discussionReports.length} more people reported this message`}</span>}
                </div>

            </div>}

        </div>
    );
}

// props validation

MessageBox.propTypes = {
    data: PropTypes.object,
    setReplyDiscussion: PropTypes.func,
    setReportModal: PropTypes.func,
};

CountryFlag.propTypes = {
    name: PropTypes.bool,
    country: PropTypes.string,
};


export default MessageBox;
