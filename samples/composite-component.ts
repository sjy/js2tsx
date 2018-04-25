import PropTypes from 'prop-types';
import React, {Component} from 'react';

class Counter extends Component {
    static propTypes = {
        active: PropTypes.bool,
        name: PropTypes.string,
        count: PropTypes.number,
        unit: PropTypes.node,
        lowerLimit: PropTypes.number,
        upperLimit: PropTypes.number,
        onCountChange: PropTypes.func,
    };

    static defaultProps = {
        count: 0,
        unit: '',
        lowerLimit: 0,
        upperLimit: Number.MAX_SAFE_INTEGER,
        onCountChange() {},
    };

    constructor(props) {
        super(props);

        this.state = {
            count: props.count,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.count !== nextProps.count) {
            this.setState({
                count: nextProps.count,
            });
        }
    }

    handleChangeCount(num) {
        const nextCount = this.state.count + num;
        const {upperLimit, lowerLimit, onCountChange} = this.props;
        if (nextCount < lowerLimit || nextCount > upperLimit) return;
        this.setState({
            count: nextCount,
        });
        onCountChange(nextCount);
    }

    render() {
        const {count} = this.state;
        const {unit} = this.props;
        return (
            <div className="fake-counter">
                <span
                    className="operation"
                    onClick={this.handleChangeCount.bind(this, -1)}
                >
                    -
                </span>
                <span className="count">
                    {count}
                    {unit}
                </span>
                <span
                    className="operation"
                    onClick={this.handleChangeCount.bind(this, 1)}
                >
                    +
                </span>
            </div>
        );
    }
}

export default Counter;
