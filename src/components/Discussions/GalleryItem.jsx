import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import getFile from '../../api/getFile';
import { Item } from 'react-photoswipe-gallery';

const GalleryItem = ({ image }) => {

    // states
    const [url, setUrl] = useState('');

    useEffect(() => {
        getFile(image).then(res => setUrl(res.data));
    }, [image]);

    if (!url) {
        return;
    }

    return <Item thumbnail={url} original={url} width={'90vw'} height={'auto'}>
        {({ ref, open }) => (
            <img draggable={false} src={url} alt={image} ref={ref} onClick={open} className="w-auto h-auto rounded-md" />
        )}
    </Item>
}

// props validation
GalleryItem.propTypes = {
    image: PropTypes.string,
};

export default GalleryItem;