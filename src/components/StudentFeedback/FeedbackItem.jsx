import { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import getFile from "../../api/getFile";
import { getFileType } from "../../utilities";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const FeedbackItem = ({ feedback }) => {
    // states
    const [videoSource, setVideoSource] = useState(null);
    const videoRef = useRef();

    // set video player
    useEffect(() => {
        if (videoSource && videoRef.current) {
            const player = videojs(videoRef.current, {
                autoplay: false,
                controls: true,
                responsive: true,
                fluid: true,
            });

            // for large device
            player.on('mouseenter', function () {
                player.play();
            });

            player.on('mouseleave', function () {
                player.pause();
            });

            // For mobile click control
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                player.on('click', function () {
                    if (player.paused()) {
                        player.play();
                    } else {
                        player.pause();
                    }
                });
            }

            player.src(videoSource);

            return () => player && player.dispose();
        }
    }, [videoSource]);

    // fetch video url
    useEffect(() => {
        if (feedback?.video) {
            getFile(feedback.video).then(res => {
                setVideoSource({ src: res.data, type: `video/${getFileType(feedback?.video)}` })
            });
        }
    }, [feedback]);

    return <div className='flex flex-col rounded-xl overflow-hidden shadow-2xl'>
        <div className='aspect-[9/11] group relative bg-[#0C3C82]'>
            <video data-setup='{"aspectRatio":"9:11"}' id='video-js' ref={videoRef} className="video-js vjs-default-skin google-review-video" />
        </div>
        <div className='flex flex-col'>
            <p className='px-4 py-2 text-[#0C3C82] text-sm'>
                {feedback?.content}
            </p>
            <hr className='bg-[#0C3C82] h-[1px]' />
            <p className='flex justify-between items-center py-2.5 px-4 text-[#0C3C82] text-sm font-medium'>
                <span>{feedback?.visaType}</span>
                <img src='https://logowik.com/content/uploads/images/flag-uk7204.logowik.com.webp' alt='' className='w-5 aspect-square object-cover rounded-full' />
            </p>
        </div>
    </div>
}

FeedbackItem.propTypes = {
    feedback: PropTypes.object,
};

export default FeedbackItem;
