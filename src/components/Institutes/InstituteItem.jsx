import React, { useContext, useRef, useState } from "react";
// import { CheckCircle, Done, Close } from "@mui/icons-material";
import { Rating } from "react-simple-star-rating";
// import { UserContext } from "../../contexts/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode } from 'swiper';
import Image from "../shared/Image";
import { Delete, Edit, LocationOn, Share } from "@mui/icons-material";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import 'swiper/css';

// assets
// import img1 from '../../assets/images/worldwide.svg';
// import img2 from '../../assets/images/demo.svg';
// import img3 from '../../assets/images/phone-contact.svg';
import img4 from '../../assets/discount.svg';
import phoneSVG from '../../assets/phone.svg';
import { Button } from "@mui/material";

const InstituteItem = ({ applyHandler, institute, setDeleteConfirm }) => {

    // const prevRef = useRef();
    // const nextRef = useRef();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    // destructuring institute object
    const {
        id,
        name,
        orgImages,
        address,
        // verified,
        // tagline,
        fee,
        modeOfClasses,
        overallRating,
        sponsored,
        phoneNo
    } = institute;

    return (
        <div className="px-4 sm:px-4 py-6 rounded-xl mb-6 flex flex-col lg:flex-row gap-x-4 gap-y-6 shadow-xl bg-white">
            <div className="lg:w-4/12 flex items-center">
                <div className="w-full overflow-hidden rounded-lg">
                    {Array.isArray(orgImages) && orgImages.length > 0 && <>
                        <Swiper
                            speed={300}
                            spaceBetween={10}
                            modules={[Thumbs, FreeMode]}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            className="h-48 sm:h-72 lg:h-52"
                        >
                            {Array.isArray(orgImages) && orgImages.map(i =>
                                <SwiperSlide key={i.name}>
                                    <div className="h-full w-full rounded-lg overflow-hidden">
                                        <Image src={i.name} alt={i.name} className='w-full h-full object-cover' />
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>

                        <Swiper
                            onSwiper={setThumbsSwiper}
                            slidesPerView={5}
                            speed={300}
                            watchSlidesProgress={true}
                            freeMode={true}
                            modules={[Thumbs, FreeMode]}
                            className="h-12 sm:h-16 lg:h-14 mt-3"
                        >
                            {Array.isArray(orgImages) && orgImages.map(i =>
                                <SwiperSlide key={i.name}>
                                    <div className="w-full h-full p-1 cursor-pointer">
                                        <Image src={i.name} alt={i.name} className='border-2 w-full h-full object-cover rounded-md' />
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>
                    </>}

                </div>
            </div>
            <div className="lg:w-8/12 flex flex-col justify-between gap-y-5">
                <div className="flex justify-between items-start">
                    <p className="flex flex-col">
                        <span className="text-xl text-[#00285A] font-semibold">{name}</span>
                        <span className="text-sm flex items-center text-[#00285A]">
                            <LocationOn className="!text-base" />
                            {address}
                        </span>
                    </p>
                    <div className="flex flex-col items-end gap-y-2">
                        <span className="flex items-end gap-x-2">
                            <Rating
                                readonly
                                initialValue={parseFloat(overallRating)}
                                allowFraction={true}
                                size={20}
                                SVGstyle={{ display: "inline" }}
                            />
                            <button className="cursor-pointer"><Share fontSize='small' /></button>
                        </span>
                        <span className="flex items-center gap-x-1 text-[#00000080] text-sm">
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 16.5C4.85775 16.5 1.5 13.1422 1.5 9C1.5 4.85775 4.85775 1.5 9 1.5C13.1422 1.5 16.5 4.85775 16.5 9C16.5 13.1422 13.1422 16.5 9 16.5ZM8.25 8.25V12.75H9.75V8.25H8.25ZM8.25 5.25V6.75H9.75V5.25H8.25Z"
                                    fill={`${sponsored ? "#3383E7" : "#7F7F7F"}`}
                                />
                            </svg>
                            Sponsored
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-start">
                    <p className="text-[#00000099] font-semibold">
                        <span className="">Modes Available: </span>
                        <span className="capitalize text-[#00285A]">{modeOfClasses}</span>
                    </p>
                    <a href={`tel:${phoneNo}`} rel="noreferrer">
                        <img src={phoneSVG} alt='' className='' />
                    </a>
                </div>

                {/* <div className="flex justify-between max-sm:flex-col max-sm:gap-y-3">
                    <div className="flex-1 pr-3 mt-2 flex flex-col max-sm:gap-y-2 justify-between">
                        <div className="flex justify-between items-center">
                            <div className="w-12 h-12 rounded-full border-4 border-[#0064E133] border-dashed grid place-items-center">
                                <img src={img1} alt='' className="w-[80%]" />
                            </div>
                            <svg width="26" height="3" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1H21" stroke="#0064E1" strokeLinecap="round" strokeDasharray="3 3" />
                            </svg>
                            <div className="w-12 h-12 rounded-full border-4 border-[#0064E133] border-dashed grid place-items-center">
                                <img src={img2} alt='' className="w-[80%]" />
                            </div>
                            <svg width="26" height="3" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1H21" stroke="#0064E1" strokeLinecap="round" strokeDasharray="3 3" />
                            </svg>
                            <div className="w-12 h-12 rounded-full border-4 border-[#0064E133] border-dashed grid place-items-center">
                                <img src={img3} alt='' className="w-[80%]" />
                            </div>
                        </div>

                    </div>
                </div> */}
                <div className="flex justify-between items-start mt-2">
                    <div className="flex items-start gap-x-2">
                        <img src={img4} alt='' className="w-8 h-auto" />
                        <h2 className="text-[#CC8900] text-base font-semibold -mt-1">
                            Free Video Modules & Resources
                        </h2>
                    </div>
                    {/* <button
                        disabled={Boolean(appliedInstitute)}
                        className="py-2 px-7 text-white bg-[#0C3C82] rounded-lg font-medium"
                        onClick={(e) => applyHandler(e, { name, id })}
                    >{appliedInstitute ? 'Applied' : 'Apply'}</button> */}
                </div>
                <div className="flex justify-end gap-x-3">
                    <Button
                        variant="outlined"
                        sx={{
                            color: '#1B3B7D',
                            borderRadius: '7px',
                            border: '2px solid #1B3B7D',
                            textTransform: 'capitalize',
                            '&:hover': {
                                border: '2px solid #1B3B7D',
                            }
                        }}
                        endIcon={<Edit />}
                        onClick={(e) => {
                            e.stopPropagation();
                            // navigate(`/modules/add?id=${item.id}`);
                        }}
                    >Update</Button>
                    <Button
                        variant="outlined"
                        sx={{
                            color: 'white',
                            borderRadius: '7px',
                            border: '2px solid #1B3B7D',
                            textTransform: 'capitalize',
                            backgroundColor: '#1B3B7D',
                            '&:hover': {
                                color: '#1B3B7D',
                                border: '2px solid #1B3B7D',
                            }
                        }}
                        endIcon={<Delete />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(institute);
                        }}
                    >Delete</Button>
                </div>
            </div>
        </div>
    );
};

export default InstituteItem;