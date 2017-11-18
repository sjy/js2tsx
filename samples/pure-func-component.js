import PropTypes from 'prop-types';
import React, { Component } from 'react';

const Counter = ({ unit, count, lowerLimit, onCountChange}) => {
    return (
        <div className="fake-counter">
            <span className="operation" onClick={this.onCountChange.bind(this, 'minus')}>
                -
            </span>
            <span className="count">
                {count}
                {unit}
            </span>
            <span className="operation" onClick={this.onCountChange.bind(this, 'add')}>
                +
            </span>
        </div>
    );
};

Counter.propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string,
    count: PropTypes.number,
    unit: PropTypes.node,
    lowerLimit: PropTypes.number,
    upperLimit: PropTypes.number,
    onCountChange: PropTypes.func,
};

Counter.defaultProps = {
    count: 0,
    unit: '',
    lowerLimit: 0,
    upperLimit: Number.MAX_SAFE_INTEGER,
    onCountChange() {},
};

export default Counter;
