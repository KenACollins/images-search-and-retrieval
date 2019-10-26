import React from 'react';

class ImageCard extends React.Component {
    render() {
        const { url } = this.props.image.images.fixed_width;
        const { title } = this.props.image;
        return (
            <div>
                <img src={url} alt={title} title={title} />
            </div>
        );
    }
}

export default ImageCard;