/**
 * Need to define number associated with vertical grid space so images don't get crushed.
 * Since we have to manipulate the value of the gridRowEnd CSS property as each image is rendered,
 * this requires use of a ref to get access to the particular img tag in the real DOM. 
 */
import React from 'react';

class ImageCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { spans: 0 };
        this.imageRef = React.createRef();
    }

    componentDidMount() {
        // Define a listener that will invoke setSpans() method for each image as it finishes loading on-screen.
        this.imageRef.current.addEventListener('load', this.setSpans);
    }

    setSpans = () => {
        const imageHeight = this.imageRef.current.clientHeight;
        const spans = Math.ceil(imageHeight / 10);  // 10 matches grid-auto-rows in CSS.
        this.setState({ spans });   // ES6 compact syntax, equivalent to spans: spans.
    }

    render() {
        const { url } = this.props.image.images.fixed_width;
        const { title } = this.props.image;

        return (
            <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
                <img ref={this.imageRef} src={url} alt={title} title={title} />
            </div>
        );
    }
}

export default ImageCard;