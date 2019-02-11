import React, { Component } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default class SimpleBarChart extends Component {
  renderItems(data, palette) {
    const keys = Object.keys(data[0]);
    if (!keys) return null;
    const divs = keys
      .slice(1)
      .map((k, i) => (
        <Bar
          key={k}
          type="monotone"
          dataKey={k}
          fill={palette[i % palette.length]}
        />
      ));
    const tooltip = <Tooltip />;
    return [...divs, tooltip];
  }

  render() {
    const { data, settings, palette } = this.props;
    if (!data) return null;
    return (
      <BarChart data={data} {...settings}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        {this.renderItems(data, palette)}
        <Legend />
      </BarChart>
    );
  }
}
