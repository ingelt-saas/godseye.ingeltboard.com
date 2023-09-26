import { AttachFile, Check, Close, Remove, Send } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useContext, useState } from 'react';
import { __compressedImage } from '../../utilities';
import { AdminContext, socket } from '../../contexts';
import uploadToAWS from '../../aws/upload';
import PropTypes from 'prop-types';

const SendForm = ({ refetch, replyDiscussion, setReplyDiscussion }) => {

    // states
    const [message, setMessage] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // context
    const { inGelt } = useContext(AdminContext);

    // upload image to aws
    const uploadImageToAws = (image, index) => new Promise(async (resolve, reject) => {

        try {
            const res = await uploadToAWS(image.img, 'discussion', (event) => {
                const progress = Math.round((event.loaded * 100) / event.total);
                // set uploading progress
                setSelectedImages(prevImages => {
                    const images = [...prevImages];
                    images[index].uploading = true;
                    images[index].progress = progress;
                    return images;
                });
            });

            // set upload state is true
            setSelectedImages(prevImages => {
                const images = [...prevImages];
                images[index].uploading = false;
                images[index].upload = true;
                return images;
            });

            resolve(res);
        } catch (err) {
            reject(err);
        }
    });

    // send message
    const createDiscussion = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const images = [];

            for (const image of selectedImages) {
                const index = selectedImages.indexOf(image);
                const result = await uploadImageToAws(image, index);
                result?.Key && images.push(result?.Key);
            }

            // Send Message to Socket
            socket.emit("godseye-message", {
                message,
                id: inGelt.id,
                parentDiscussionId: replyDiscussion?.id || null,
                images: images
            });

            setMessage("");
            setSelectedImages([]);
            setLoading(false);
            setReplyDiscussion(null);
            refetch();

        } catch (err) {
            console.log(err);
        }
    };

    // handle select image
    const handleImageInputChange = async (e) => {
        const files = e.target.files;
        let compressedImages = [];

        for (let file of files) {
            const compressedImage = await __compressedImage(file);
            compressedImages.push({ img: compressedImage, uploading: false, progress: 0, upload: false, });
        }
        setSelectedImages([...selectedImages, ...compressedImages]);
    };

    // remove selected image
    const removeSelectedImages = (index) => {
        let newSelectedImages = [...selectedImages];
        newSelectedImages.splice(index, 1);
        setSelectedImages(newSelectedImages);
    };


    return (
        <div className="w-full bg-white shadow-[0px_-5px_20px_-8px_#0000002b]">

            {selectedImages.length > 0 && (
                <div className="flex items-center gap-x-3 pt-3 px-2 overflow-x-hidden">
                    {selectedImages.map(({ img, uploading, progress, upload }, index) => (
                        <div
                            key={index}
                            className="border rounded-md overflow-hidden relative"
                        >
                            {(!uploading && !upload) && <span
                                onClick={() => removeSelectedImages(index)}
                                className="absolute top-0 right-0 cursor-pointer bg-black rounded-full text-white w-5 h-5 grid place-items-center"
                            >
                                <Remove className="!w-4 -mt-0.5" />
                            </span>}
                            {uploading && <span className='absolute top-0 left-0 w-full h-full text-white bg-[#000] bg-opacity-25 grid place-items-center'>
                                <CircularProgress variant='determinate' value={100} color='inherit' className='w-6' />
                                <span className='absolute top-1/2 left-1/2 text-xs -translate-x-1/2 -translate-y-1/2'>{progress}%</span>
                            </span>}
                            {upload && <span className='absolute top-0 left-0 w-full h-full text-green-500 bg-[#fff] bg-opacity-75 grid place-items-center'>
                                <Check />
                            </span>}
                            <img
                                src={URL.createObjectURL(img)}
                                alt=""
                                className="w-12 h-12 object-cover"
                            />
                        </div>
                    ))}{" "}
                </div>
            )}

            {replyDiscussion && <p className="px-3 pt-2 text-sm font-semibold text-[#1B3B7d] flex justify-between items-center">
                Reply Message
                <button onClick={() => setReplyDiscussion(null)}>
                    <Close fontSize="small" />
                </button>
            </p>}

            <form
                onSubmit={createDiscussion}
                className="pt-5 px-4 flex items-center justify-between w-full"
            >
                <label htmlFor="imageInput" className="text-[#2D2D2D] cursor-pointer">
                    <input
                        type="file"
                        id="imageInput"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageInputChange}
                        multiple
                    />
                    <AttachFile fontSize="medium" />
                </label>
                <div className="flex-1 px-4">
                    <input
                        className="bg-white px-4 text-sm w-full py-2.5 border-2 border-[#1B3B7D] rounded-xl"
                        type="text"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (message.trim() !== "" && message.split(" ").length <= 200) {
                                    createDiscussion(e);
                                }
                            }
                        }}
                    />
                </div>
                <Button
                    type='submit'
                    endIcon={<Send />}
                    className='!text-sm !capitalize !rounded-lg !px-4 !py-3 !transition !duration-300 !ease-in-out'
                    variant='contained'
                    disabled={(!(message.trim() !== "" && message.split(" ").length <= 200) && !selectedImages.length > 0) || loading}
                >
                    Send
                </Button>
            </form>
        </div>
    );
}

SendForm.propTypes = {
    refetch: PropTypes.func,
    replyDiscussion: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
    setReplyDiscussion: PropTypes.func
};

export default SendForm;
