import React from "react";
import "./chart.scss";
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import moment from 'moment';

import { getECGDetail as getECGDetailApi } from '../../api';

class ECGDetail extends React.Component {
  state = {
    data: [],

    from: '',
    index: '',
    chart_type: '',
    ecg_type: 1
  }

  async componentDidMount() {
    if (this.props.history.location.search.length > 0) {
      let { from, index, chart_type, ecg_type } = this.state;
      let params = this.props.history.location.search.split("&");
      
      from = params[0].split("=")[1];
      index = params[1].split("=")[1];
      chart_type = params[2].split("=")[1];
      ecg_type = params[3].split("=")[1];
      this.setState({ from, index, chart_type, ecg_type });
      const response = await getECGDetailApi({
        from, index, chart_type, ecg_type
      })
      if (response && response.data) {
        this.setState({
          data: response.data
        })
      }
    }
  }

  getData = (data) => {
    return data.slice(0, 300);
  }

  render() {
    const { data } = this.state;
    return (
      <Card className="ecg-card-out">
        {data.length > 0 && <div className="v-r">
          {data.map((item, index) => <div className="ecg-container-box v-r" key={index}>
            <div className="ecg-basic-info v-c">
              <p className="v-c">
                <i className='fas fa-heart' /> {item.avgHeartRate} BPM Average
              </p>
              <p>{moment(item.date).format('MM/DD/YYYY, HH:mm')}</p>
            </div>
            <div className="ecg-chart">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    type: 'spline',
                    height: 250,
                    scrollablePlotArea: {
                      minWidth: 1600,
                      scrollPositionX: 1
                    }
                  },
                  title: {
                    text: null
                  },
                  xAxis: {
                    scrollbar: {
                        enabled: true
                    },
                  },
                  yAxis: {
                    title: false,
                    labels: {
                      enabled: false
                    }
                  },
                  tooltip: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  credits: {
                    enabled: false
                  },
                  series: [{
                    data: item.voltages,
                    color: 'rgb(254,44,85)',
                    lineWidth: 1,
                  }],
                  plotOptions: {
                    series: {
                      states: {
                        hover: {
                          enabled: false
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>)}
        </div>}
      </Card>
    )
  }
}
const mapStateToProps = (state) => {
  return {
  }
}
export default connect(mapStateToProps, {})(ECGDetail);