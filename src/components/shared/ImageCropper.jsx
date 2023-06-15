import { Button, Modal } from "@mui/material";
import React from "react";
import "cropperjs/dist/cropper.css";
import { Cropper } from "react-cropper";
import Compressor from "compressorjs";
import { useDropzone } from "react-dropzone";

const ImageCropper = ({ children, resizableImage }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const cropperRef = React.useRef(null);
  const [error, setError] = React.useState(null);
  const { getInputProps, getRootProps } = useDropzone({
    multiple: false,
    accept: {
      'image/png': ['.png', '.jpeg', '.webp']
    },
    onDrop: (acceptFiles, rejectFiles) => {
      if (rejectFiles.length > 0) {
        setError('File type not supported');
      } else {
        new Compressor(acceptFiles[0], {
          quality: 0.6,
          convertSize: 1,
          convertTypes: ["image/webp"],
          success: (result) => {
            setImage(result);
            setIsOpen(true);
            setError('');
          },
          error: (err) => {
            console.error(err);
            setError(err);
          },
        });
      }
    },
  });

  // upload cancel handler
  const cancelHandler = () => {
    setImage(null);
    setIsOpen(false);
  };

  // upload success handler
  const cropSuccessHandler = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const dataURL = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL("image/webp", 0.5);
      const res = await fetch(dataURL);
      const data = await res.blob();
      typeof resizableImage === "function" && resizableImage(data);
      setImage(null);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {children}
      </div>
      {error && (
        <p className="text-left pl-3 text-red-500 font-medium text-xs mb-2">
          {error}
        </p>
      )}
      <Modal open={isOpen} className="grid place-items-center">
        <div className="bg-white rounded-lg px-3 py-5">
          <Cropper
            ref={cropperRef}
            src={image && URL.createObjectURL(image)}
            style={{
              maxWidth: "80vw",
              width: "fit-content",
              height: "fit-content",
              maxHeight: "70vh",
            }}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            responsive={true}
            background="#f2f2f2"
            shape="circle"
            // initialAspectRatio={1}
            initialAspectRatio={16 / 9}
            cropBoxResizable={false}
          />
          <div className="flex gap-x-3 justify-end mt-4">
            <Button variant="outlined" onClick={cancelHandler}>
              Cancel
            </Button>
            <Button variant="contained" onClick={cropSuccessHandler}>
              Crop
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageCropper;
