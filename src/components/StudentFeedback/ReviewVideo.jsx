import { useEffect, useState } from 'react'
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { useRef } from 'react';
import { bytesToSize } from '../../utilities';

const ReviewVideo = ({ formError, video, setVideo }) => {

    // states
    // const [compressing, setCompressing] = useState(false);
    const [error, setError] = useState('');
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef(null);

    const compressVideo = async (file) => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile('input.webm', await fetchFile(file));
        await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        console.log(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })))
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptFile, rejectFile) => {
            if (rejectFile.length > 0) {
                setError('File type not supported');
            } else {
                setError('');
                const file = acceptFile[0];
                if (['video/mp4', 'video/webm', 'video/x-matroska'].includes(file.type)) {
                    // setCompressing(true);
                    setVideo(file);
                    // compressVideo(file);
                } else {
                    setError('');
                }
            }
        },
        accept: {
            'video/mp4': ['.mp4', '.webm', '.mkv']
        },
        multiple: false,
    });

    useEffect(() => {

        const loadFfmpeg = async () => {
            const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm";
            const ffmpeg = ffmpegRef.current;

            ffmpeg.on('log', ({ message }) => {
                console.log(message);
            });

            ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
                workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
            });
        }

        loadFfmpeg();

    }, []);

    useEffect(() => setError(formError), [formError]);


    return <div className='lg:col-span-6'>
        <div {...getRootProps()}>
            <input {...getInputProps()} />

            {!video && <div className="py-10 px-5 cursor-pointer bg-white border-2 border-dashed border-black text-center shadow-md opacity-80">
                <p className="text-sm">Drag 'n' drop video here, or click to select video</p>
                <p className="text-sm mt-1">Accept only .mp4, .webm video type</p>
            </div>}

            {video && typeof video === 'object' && <div className="py-10 px-5 cursor-pointer bg-white border-2 border-dashed border-black text-left shadow-md opacity-80">
                <p className="text-sm font-medium">{video?.name}</p>
                <p className="text-sm mt-1">
                    Size: {bytesToSize(video?.size)}
                </p>
            </div>}

        </div>
        <p className='text-xs font-medium' ref={messageRef}></p>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
}

ReviewVideo.propTypes = {
    formError: PropTypes.string,
    video: PropTypes.object,
    setVideo: PropTypes.func
};

export default ReviewVideo