import React, { Component } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default class SimpleLineChart extends Component {
  renderItems(data, palette) {
    const keys = Object.keys(data[0]);
    if (!keys) return null;
    return keys
      .slice(1)
      .map((k, i) => (
        <Line
          key={k}
          type="monotone"
          dataKey={k}
          stroke={palette[i % palette.length]}
        />
      ));
  }

  render() {
    const { data, settings, palette } = this.props;
    if (!data) return null;
    return (
      <LineChart data={data} {...settings}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {this.renderItems(data, palette)}
        <Tooltip />
        <Legend />
      </LineChart>
    );
  }
}
