import { Box, Modal } from '@mui/material'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import React, { useRef } from 'react'

const AudioModal = ({file,showPopup,closePopup}) => {
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
        <Box ref={rootRef} className="outline-none absolute w-[90%] md:w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
            <img src={"https://picsum.photos/800/400"} alt="" className="w-full h-auto"/>
          <AudioPlayer
            autoPlay
            src={file}
            showFilledProgress
            showFilledVolume
            controls
          />
        </Box>
</Modal>
  )
}

export default AudioModal