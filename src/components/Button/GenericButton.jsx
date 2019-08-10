import React from 'react';
import {NavigateBefore} from "@material-ui/icons";
import './GenericButton.scss'

class GenericButton extends React.Component {

    render() {
        const disabled = this.props.disabled ? "disabled-button" : "not-disabled-button";
        return (
            <div className={"flex-row generic-button " + disabled} onClick={this.props.onClick}>
                <NavigateBefore className="white-font-color-light graph-back-button" fontSize="large"/>
                <span className="font-sm white-font-color-light bold-text">{this.props.text}</span>
            </div>
        );
    }
}
export default GenericButton;
