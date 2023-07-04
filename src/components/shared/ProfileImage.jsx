import React, { useEffect, useState } from 'react';
import femaleAvatar from "../../assets/FemaleAvatra.webp";
import maleAvatar from "../../assets/MaleAvatra.webp";
import getFile from '../../api/getFile';

const ProfileImage = ({ src, alt, gender, className }) => {

    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const avatar = gender === 'Male' ? maleAvatar : femaleAvatar;

    useEffect(() => {
        if (src) {
            getFile(src)
                .then(res => {
                    setUrl(res.data);
                    setLoading(false);
                })
        } else {
            setLoading(false);
        }
    }, [src])

    return loading ? <span className={`block shadow-md ${className}`}></span> : <img
        src={url || avatar}
        alt={alt}
        className={className}
    />
}

export default ProfileImage;
