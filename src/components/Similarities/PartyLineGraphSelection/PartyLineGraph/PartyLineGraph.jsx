import React from 'react';
import GenericGraph from "../../../Followers/Graphs/GenericGraph";
import SimplePartyLineGraph from "./SimplePartyLineGraph";

class PartyLineGraph extends React.Component {
    render() {
        return (
            <div className="full-basis white-bc-color-light">
                <GenericGraph
                    title={this.props.title}
                    showLabels={false}
                    showInfo={this.props.showInfo}
                    infoMessage={this.props.infoMessage}
                    type={<SimplePartyLineGraph
                        max={this.props.max}
                        min={this.props.min}
                        data={this.props.data}
                        activeParties={this.props.activeParties}
                        showHorizontalLine={this.props.showHorizontalLine}
                    />}
                />
            </div>
        );
    }
}

export default PartyLineGraph;
