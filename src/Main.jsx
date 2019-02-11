import React, { Component } from 'react';
import SimpleBarChart from './bar_chart';
import SimpleLineChart from './line_chart';
import SimplePieChart from './pie_chart';
import connectToDatoCms from './connectToDatoCms';
import './style.sass';

const palette = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#f038ff',
  '#ef709d',
  '#e2ef70',
  '#70e4ef'
];

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath)
}))
export default class Main extends Component {
  constructor(props) {
    super(props);
    const { fieldValue, plugin } = this.props;
    const data = fieldValue ? JSON.parse(fieldValue) : null;

    this.state = {
      data,
      type: plugin.parameters.instance.chart_type,
      width: null,
      colors: palette
    };
    this.mutationObserver = new MutationObserver(this.updateWidth.bind(this));
  }

  componentDidMount() {
    const { plugin, fieldValue } = this.props;
    const { instance } = plugin.parameters;

    if (!fieldValue && instance.fieldApiKey) {
      const linkedData = plugin.getFieldValue(instance.fieldApiKey);
      if (linkedData) {
        const data = JSON.parse(linkedData);
        console.log('SOURCE VALUE', data);
        this.setState({ data });
      }
    }
    this.startObserving();
    if (instance.plalette) this.checkColors(instance.plalette);
  }

  componentWillUnmount() {
    this.mutationObserver.disconnect();
    window.removeEventListener('resize', this.updateWidth.bind(this));
  }

  checkColors(colorString) {
    try {
      const colors = colorString.split(',').map(c => c.trim());
      console.log('COLORS', colors);
      this.setState({ colors });
    } catch (e) {
      console.log('error', e);
    }
  }

  startObserving() {
    this.mutationObserver.observe(window.document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
    window.addEventListener('resize', this.updateWidth.bind(this));
  }

  updateWidth() {
    const realWidth = Math.ceil(
      document.documentElement.getBoundingClientRect().width
    );
    this.setState({ width: realWidth - 100 });
  }

  render() {
    const { type, data, width, colors } = this.state;
    if (!data) return <div className="container">loading...</div>;
    const settings = {
      width,
      height: 350,
      margin: {
        top: 50,
        right: 50,
        left: 20,
        bottom: 50
      }
    };
    return (
      <div className="container">
        <div className="chart_wrapper">
          {type === 'pie' && (
            <SimplePieChart data={data} settings={settings} palette={colors} />
          )}
          {type === 'lines' && (
            <SimpleLineChart data={data} settings={settings} palette={colors} />
          )}
          {type === 'bars' && (
            <SimpleBarChart data={data} settings={settings} palette={colors} />
          )}
        </div>
      </div>
    );
  }
}
