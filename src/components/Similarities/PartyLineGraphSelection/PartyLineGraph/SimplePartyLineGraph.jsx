import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {g3Formatter} from "../../../../utils/graphFunctions";

const COLORS = {
    "Frente De Todos": "#188bb6",
    "Consenso Federal": "#9f2099",
    "Frente De Izquierda": "#b02f38",
    "Frente Despertar": "#4449ad",
    "Juntos Por El Cambio": "#b9b939"
};

class SimplePartyLineGraph extends React.Component {

    generateLines = () => {
        console.log(this.props.activeParties)
        return this.props.activeParties.map((party, index) =>
            <Line key={index} type="monotone" dataKey={party} stroke={COLORS[party]}/>);
    };

    render() {
        return (
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={this.props.data}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"
                               tickFormatter={(tick) => tick.replace("/2019","")}
                               angle={-45}
                               textAnchor="end"
                               height={80}
                        />
                        <YAxis />
                        <Tooltip formatter={(value) => g3Formatter(value)}/>
                        <Legend />
                        {this.generateLines()}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default SimplePartyLineGraph;