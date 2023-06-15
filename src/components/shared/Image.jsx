import { useState } from 'react';
import { useEffect } from 'react';
import getFile from '../../api/getFile';

const Image = ({ src, alt, className }) => {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        if (src) {
            getFile(src)
                .then(res => setUrl(res?.data))
        } else {
            setUrl(null);
        }
    }, [src]);
    return !url ? <span className={`${className} shadow`}></span> :
        <img
            draggable={false}
            src={url}
            alt={alt}
            className={className}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null;
            }}
        />;
}

export default Image;
