import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

const Loading = (props) => {
    const { width, height, top, left, position } = props;

    return <div className="Loading" style={{ width, height, top, left, position }} />;
}

Loading.defaultProps = {
    width: '28px',
    height: '28px',
}

Loading.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
};

export default Loading;