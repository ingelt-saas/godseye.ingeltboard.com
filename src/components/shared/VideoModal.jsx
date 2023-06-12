import { Box, Modal } from '@mui/material'
import React, { useRef } from 'react'
import ReactPlayer from 'react-player'


const VideoModal = ({ file, showPopup, closePopup }) => {
  const rootRef = useRef(null);

  if (!showPopup) {
    return null;
  }
  return (
    <Modal
      open={showPopup}
      onClose={closePopup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box ref={rootRef} className="absolute w-[90%] md:w-auto outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ReactPlayer
          url={file}
          style={{ borderRadius: '20px', overflow: 'hidden' }}
          playing={true}
          width="100%"
          height="100%"
          volume={1}
          pip={true}
          controls
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
              },
            },
          }}
        />
      </Box>
    </Modal>
  )
}

export default VideoModal