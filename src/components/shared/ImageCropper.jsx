import { CameraAlt } from "@mui/icons-material";
import { Button, Modal } from "@mui/material";
import React from "react";
import styled from "styled-components";
import "cropperjs/dist/cropper.css";
import { Cropper } from "react-cropper";
import Compressor from "compressorjs";

const StyledButton = styled(Button)(() => ({ textTransform: "capitalize" }));

const ImageCropper = ({ children, resizableImage }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const uploadInput = React.useRef(null);
  const cropperRef = React.useRef(null);
  const [error, setError] = React.useState(null);

  // file handler
  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const typesArr = ["image/webp", "image/png", "image/jpeg"];
    if (!typesArr.includes(file.type)) {
      setError("We accept .png, .jpeg, .webp type");
      return;
    }
    new Compressor(file, {
      quality: 0.6,
      convertSize: 1,
      convertTypes: ["image/webp"],
      success: (result) => {
        setImage(result);
        setIsOpen(true);
      },
      error: (err) => console.error(err),
    });
  };

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
      {error && (
        <p className="text-center text-red-500 font-medium text-sm mb-2">
          {error}
        </p>
      )}
      <input
        type="file"
        name="file"
        className="sr-only"
        ref={uploadInput}
        onChange={fileHandler}
        accept=".png,.jpg,.webp,.jpeg"
      />
      <StyledButton
        size="large"
        variant="contained"
        endIcon={<CameraAlt />}
        onClick={() => uploadInput.current.click()}
        className="!text-sm font-medium !bg-[#1B3B7B] text-white hover:!bg-[#1B3B7B]"
      >
        {children}
      </StyledButton>
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
            initialAspectRatio={1}
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
