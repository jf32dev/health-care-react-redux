import React from "react";
import "./chart.scss";
import { connect } from 'react-redux';
import HeartModal from './heartModal.js';
import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { getEndOfMonth, getMonday, getInitalDates, generateLabelArray, generateHighOptions } from '../../utils/chartfunc';
import { getECG, getSleep } from '../../redux/actions';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const RangeBtns = [
  { value: "weekly", show: "W" },
  { value: "monthly", show: "M" },
]

class Sleep extends React.Component {
  state = {
    chart: [[],[]],
    label_array : ["Mon", "Tue", "Wed", "Thu", "Fri","Sat","Sun"],
    show_from: getInitalDates().first_day,
    show_to: getInitalDates().last_day,
    current_range_type:"weekly",
    healthData:[],
    rate_string:["heart_rate", "sleep"]
  }
  
  static getDerivedStateFromProps(props, state) {
    return {
      healthData: [
        props.ecg,
        props.sleep,
      ]
    };
  }

  componentDidMount() {
    this.props.getECG();
    this.props.getSleep();
  }

  componentDidUpdate(prevProps) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.atrialRef.chart.redraw();
      this.sleepRef.chart.redraw();
    }, 300);
  }

  moveDate = (flag) => {
    let { show_from, current_range_type} =this.state;

    let add_amount = flag === 'prev' ? -1 : 1;
    if(current_range_type==="weekly"){
      show_from = moment(show_from).add(add_amount, 'week').format("MMM DD, YYYY");
    } else if(current_range_type==="monthly"){
      show_from = moment(show_from).add(add_amount, 'month').format('MMM DD, YYYY');
    }
    this.refresh_start_from_date(show_from, current_range_type);
  }
  
  clickrange = (current_range_type) => {
    let { label_array, show_from } = this.state;
    if(current_range_type==="weekly"){
      show_from = moment(getMonday()).format("MMM DD, YYYY");
    } else if(current_range_type==="monthly"){
      show_from = moment().startOf('month').format('MMM DD, YYYY');
    }
    label_array = generateLabelArray(current_range_type, show_from);
    this.refresh_start_from_date(show_from, current_range_type, { label_array });
  }

  refresh_start_from_date = (show_from, current_range_type, setData = {}) => {
    let { show_to } = this.state;
    if (current_range_type ==="weekly"){
      show_to = moment(show_from).add(6, 'days').format("MMM DD, YYYY");
    } else if (current_range_type ==="monthly"){
      show_to = moment(show_from).endOf('month').format("MMM DD, YYYY");
    }

    this.setState({
      current_range_type,
      show_from,
      show_to, 
      ...setData
    })
  }

  refresh_chart_value = () =>{
    const { healthData, current_range_type, show_from } = this.state;
    let status_array_temp = [[],[]];
    let status_array_sleep = {asleep:[],inbed:[]};
    
    let total_steps = [];

    let total_sleep = {asleep:0,inbed:0};

    for (let m = 0; m < 2; m++) {
      let non_zero_asleep_count = 0;
      let non_zero_inbed_count = 0;
      if(current_range_type === "weekly") {
        let today = new Date(show_from);
        for(let i=0; i< 7; i++){
          if (m === 1) {
            let start_sleep_day_date = moment(show_from).add(i, 'days').subtract(1, 'days').set({ hour: 18, minute: 0, second: 0 });
            let end_sleep_day_date = moment(show_from).add(i, 'days').set({ hour: 18, minute: 0, second: 0 });
            
            let filter_sleep_day = healthData[m].filter(item => moment(item.start) >= start_sleep_day_date && moment(item.end) < end_sleep_day_date);
            let daily_sleep_asleep = 0;
            let daily_sleep_inbed = 0;
            
            for(let k =0; k< filter_sleep_day.length; k++){
              let start = new Date(filter_sleep_day[k]['start']);
              let end = new Date(filter_sleep_day[k]['end']);
              let sleep_hours = (end-start)/3600000;
              
              filter_sleep_day[k]['type']===1 ? daily_sleep_asleep += sleep_hours : daily_sleep_inbed += sleep_hours;
            }
            status_array_temp[m].push([daily_sleep_inbed,daily_sleep_asleep]);
            status_array_sleep['asleep'].push(parseFloat(daily_sleep_asleep.toFixed(2)));
            status_array_sleep['inbed'].push(parseFloat(daily_sleep_inbed.toFixed(2)));

            non_zero_asleep_count = daily_sleep_asleep > 0 ? non_zero_asleep_count+1 : non_zero_asleep_count;
            non_zero_inbed_count = daily_sleep_inbed > 0 ? non_zero_inbed_count+1 : non_zero_inbed_count;
            
            total_sleep['inbed']+=daily_sleep_inbed;
            total_sleep['asleep']+=daily_sleep_asleep;
          } else {
            let start_day_date = moment(show_from).add(i, 'days').format("YYYY-MM-DD");
            let daily_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === start_day_date && temp.type === 2;
            }).length;
            status_array_temp[m].push(daily_value);
          }
          today.setDate(new Date(today).getDate() + 1);
        }
      } else if(current_range_type === "monthly") {
        for(let i=1; i<= getEndOfMonth(show_from); i++){             
          if (m === 1) {
            let start_sleep_day_date = moment(show_from).set({ date: i }).subtract(1, 'days').set({ hour: 18, minute: 0, second: 0 });
            let end_sleep_day_date = moment(show_from).set({ date: i }).set({ hour: 18, minute: 0, second: 0 });

            let filter_sleep_day = healthData[m].filter(item => moment(item.start) >= start_sleep_day_date && moment(item.end) < end_sleep_day_date);
            let daily_sleep_asleep = 0;
            let daily_sleep_inbed = 0;
            
            for(let k =0; k< filter_sleep_day.length; k++){
              let start = new Date(filter_sleep_day[k]['start']);
              let end = new Date(filter_sleep_day[k]['end']);
              let sleep_hours = (end-start)/3600000;
              filter_sleep_day[k]['type'] === 1 ? daily_sleep_asleep += sleep_hours : daily_sleep_inbed += sleep_hours;
            }
            status_array_temp[m].push([daily_sleep_inbed,daily_sleep_asleep]);
            status_array_sleep['asleep'].push(parseFloat(daily_sleep_asleep.toFixed(2)));
            status_array_sleep['inbed'].push(parseFloat(daily_sleep_inbed.toFixed(2)));

            non_zero_asleep_count = daily_sleep_asleep > 0 ? non_zero_asleep_count+1 : non_zero_asleep_count;
            non_zero_inbed_count = daily_sleep_inbed > 0 ? non_zero_inbed_count+1 : non_zero_inbed_count;
            
            total_sleep['inbed']+=daily_sleep_inbed;
            total_sleep['asleep']+=daily_sleep_asleep;
          } else {
            let compare = moment(show_from).set({ date: i }).format("YYYY-MM-DD");
            let daily_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === compare && temp.type === 2;
            }).length;
            status_array_temp[m].push(daily_value);
          }
        }
      }
      if (m !== 0) {
        let average_asleep = non_zero_asleep_count > 0 ? total_sleep['asleep']/non_zero_asleep_count : 0;
        let average_inbed = non_zero_inbed_count > 0 ? total_sleep['inbed']/non_zero_inbed_count : 0;
        total_steps[m] = `${parseInt(average_inbed, 10)}Hr ${((average_inbed-parseInt(average_inbed))*60).toFixed(0)} Min / ${parseInt(average_asleep)}Hr ${((average_asleep-parseInt(average_asleep))*60).toFixed(0)} Min`;
      }
    }
  
    let response = [];
    for (let i = 0; i < 2; i++) {
      response.push({
        value_array: status_array_temp[i],
        show_total: i === 0 ? 0 : total_steps[i]
      })
    }
    response[1].value_array = status_array_sleep['inbed'];
    response[1].value_array1 = status_array_sleep['asleep'];

    return response;
  }

  navigateToECG = (e, ecg_type) => {
    const { show_from, current_range_type } = this.state;
    if (e && e.length > 0) {
      this.props.history.push(`/admin/health/ecg/detail?from=${moment(show_from).format("YYYY-MM-DD")}&index=${e[0]._index}&chart_type=${current_range_type}&ecg_type=${ecg_type}`)
    }
  }

  render() {
    const { show_from, show_to, label_array, current_range_type } = this.state;
    let data = this.refresh_chart_value();
    const highOptions = generateHighOptions(label_array, show_from, current_range_type);
    return (
      <Card>
        <CardBody>
          <div className="fixed_header">
            <div className="header_part v-r">
              <div className="select_range_div v-c">
                {RangeBtns.map((item, index) => <button className={`range-btn sleep-btn ${current_range_type === item.value ? 'active' : ''}`} key={index} onClick={e => this.clickrange(item.value)}>{item.show}</button>)}
              </div>
            </div>
            <div className="chart_total_value">
              <div className="show_total_step_div">
                <label className="total_steps_header">Sleep: </label>
                <p><label className="total_steps_value">{data[1].show_total}</label>
                <label className="chart_unit"></label></p>
              </div>
            </div>
          </div>

          <div className="chart_total">
            <div className="chart-info v-c">
              <p className="step_date_range">Atrial Fibrilation, {show_from}  ~ {show_to}</p>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')} className={`step_date_button webview_prev prev_button_1 `} > <label>&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.atrialRef = c }
                  options={{
                    ...highOptions,
                    series: [{
                      name: 'Atrial Fibrilation',
                      data: data[0].value_array,
                      color: 'rgb(255,0,0)',
                      events: {
                        click: e => this.navigateToECG(e, 2)
                      }
                    }],
                }} />
              </div>
              <button onClick={e => this.moveDate('next')} className={`step_date_button webview_next next_button_1 `} ><label>&#x203a;</label></button>
            </div>
            <div style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>

          {/* Sleep rate */}
          <div className="chart_total chart_heart">
            <div className="chart-info v-c">
              <p className="step_date_range">Sleep, {show_from}  ~ {show_to}</p>
              <HeartModal type="Sleep Time"/>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label>&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                    highcharts={Highcharts}
                    ref={ c => this.sleepRef = c }
                    options={{
                      ...highOptions,
                      tooltip: {
                        formatter: function() {
                          return `<b>${current_range_type === 'weekly' ? moment(show_from).add(this.point.index, 'day').format("YYYY-MM-DD") : this.point.category}</b><br/>
                                <span style="color:${this.point.color}">\u25CF</span>${this.point.series.name}:${parseInt(this.point.y, 10)}Hr ${((this.point.y-parseInt(this.point.y))*60).toFixed(0)}Min`;
                        }
                      },
                      series: [{
                        name: 'Inbed',
                        data: data[1].value_array,
                        color: 'rgb(241,225,121)',
                      }, {
                        name: 'Asleep',
                        data: data[1].value_array1,
                        color: '#36a2eb',
                      }],
                  }} />
              </div>
              <button onClick={e => this.moveDate('next')}   className={`step_date_button webview_next next_button_1 `} ><label>&#x203a;</label></button>
            </div>
            <div  style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ecg:state.heartRate.ecg,
    sleep:state.heartRate.sleep,
  }
}
export default connect(mapStateToProps, { getECG, getSleep})(Sleep);