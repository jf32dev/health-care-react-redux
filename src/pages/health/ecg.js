import React from "react";
import "./chart.scss";
import { connect } from 'react-redux';
// import HeartModal from './heartModal.js';
import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { RangeBtns, getEndOfMonth, getMonday, getInitalDates, generateLabelArray, generateHighOptions } from '../../utils/chartfunc';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import { getHeartRate, getECG } from '../../redux/actions';

HC_more(Highcharts);

const findMinMax = (arr) => {
  let min = arr.length>0 ? arr[0] : 0;
  let max = arr.length>0 ? arr[0]: 0;
  for (let i = 0, len=arr.length; i < len; i++) {
    let v = arr[i];
    if(min===0) min=v;
    min = (v < min && v!==0) ? v : min;
    max = (v > max) ? v : max;
  }
  return [min, max];
}

class ECG extends React.Component {
  state = {
    chart: [[], [], [], [], []],
    label_array : ["Mon", "Tue", "Wed", "Thu", "Fri","Sat","Sun"],
    show_from: getInitalDates().first_day,
    show_to: getInitalDates().last_day,
    current_range_type:"weekly",
    healthData:[],
    rate_string:["heart_rate"]
  }
  
  static getDerivedStateFromProps(props, state) {
    return {
      healthData: [
        props.heartRate,
        props.ecg,
      ]
    };
  }

  componentDidMount() {
    this.props.getHeartRate();
    this.props.getECG();
  }

  componentDidUpdate(prevProps) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.heartRateRef.chart.redraw();
      this.sinusRef.chart.redraw();
      this.atrialRef.chart.redraw();
      this.lowAndHighRef.chart.redraw();
      this.inconclusiveRef.chart.redraw();
    }, 300);
  }

  moveDate = (flag) => {
    let { show_from, current_range_type} =this.state;

    let add_amount = flag === 'prev' ? -1 : 1;
    if(current_range_type==="daily"){
      show_from = moment(show_from).add(add_amount, 'day').format('MMM DD, YYYY');
    } else if(current_range_type==="weekly"){
      show_from = moment(show_from).add(add_amount, 'week').format("MMM DD, YYYY");
    } else if(current_range_type==="monthly"){
      show_from = moment(show_from).add(add_amount, 'month').format('MMM DD, YYYY');
    } else if(current_range_type==="yearly"){
      show_from = moment(show_from).add(add_amount, 'year').format('MMM DD, YYYY');
    }
    this.refresh_start_from_date(show_from, current_range_type);
  }
  
  clickrange = (current_range_type) => {
    let { label_array, show_from } = this.state;
    if(current_range_type==="daily"){
      show_from = moment().format('MMM DD, YYYY');
    } else if(current_range_type==="weekly"){
      show_from = moment(getMonday()).format("MMM DD, YYYY");
    } else if(current_range_type==="monthly"){
      show_from = moment().startOf('month').format('MMM DD, YYYY');
    } else if(current_range_type==="yearly"){
      show_from = moment().startOf('year').format('MMM DD, YYYY');
    }
    label_array = generateLabelArray(current_range_type, show_from);
    this.refresh_start_from_date(show_from, current_range_type, { label_array });
  }

  refresh_start_from_date = (show_from, current_range_type, setData = {}) => {
    let { show_to } = this.state;
    if(current_range_type ==="daily"){
      show_to =    moment(show_from).add(1, 'day').format("MMM DD, YYYY");
    } else if (current_range_type ==="weekly"){
      show_to = moment(show_from).add(6, 'days').format("MMM DD, YYYY");
    } else if (current_range_type ==="monthly"){
      show_to = moment(show_from).endOf('month').format("MMM DD, YYYY");
    } else if (current_range_type ==="yearly"){
      show_to = moment(show_from).endOf('year').format("MMM DD, YYYY");
    }

    this.setState({
      current_range_type,
      show_from,
      show_to, 
      ...setData
    })
  }

  refresh_chart_value = () =>{
    const { healthData, rate_string, current_range_type, show_from } = this.state;
    let status_array_temp = [[], [], [], [], []];
    
    let total_heart_rate = [];

    for (let m = 0; m < 5; m++) {
      if (current_range_type === "daily") {
        for(let j=0; j<24; j++){
          let stamp = moment(show_from).set({ hour: j }).format("YYYY-MM-DD HH:00");
          if (m === 0) {
            let filter_hour = healthData[m].filter(item => moment.utc(item.date).format("YYYY-MM-DD HH:00") === stamp);
            let hourly_heart=[];
            for(let j=0; j<filter_hour.length; j++){
              hourly_heart.push(filter_hour[j][rate_string[m]]);
            }
            if (hourly_heart.length > 0) {
              if (hourly_heart.length === 1) {
                status_array_temp[m].push([0, Math.floor(hourly_heart[0])]);
                total_heart_rate.push(Math.floor(hourly_heart[0]));
              } else {
                let minMax = findMinMax(hourly_heart);
                status_array_temp[m].push([Math.floor(minMax[0]), Math.floor(minMax[1])]);
                total_heart_rate.push(Math.floor(minMax[0])); total_heart_rate.push(Math.floor(minMax[1]));
              }
            } else {
              status_array_temp[m].push([0, 0]);
            }
          } else {
            let houlry_value = healthData[1].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD HH:00") === stamp && (
                m <= 2 ? temp.type === m : (temp.type >= m && temp.type <= m+1)
              );
            }).length;
            status_array_temp[m].push(houlry_value.toFixed(0))
          }
        }
      } else if(current_range_type === "weekly") {
        for(let i=0; i< 7; i++){
          let start_day_date = moment(show_from).add(i, 'days').format("YYYY-MM-DD");
          if (m === 0) {
            let filter_day = healthData[m].filter(item => moment.utc(item.date).format("YYYY-MM-DD") === start_day_date);
            let daily_heart=[];
            for(let j=0; j<filter_day.length; j++){
              daily_heart.push(filter_day[j][rate_string[m]]);
            }
            if (daily_heart.length > 0) {
              if (daily_heart.length === 1) {
                status_array_temp[m].push([0, Math.floor(daily_heart[0])]);
                total_heart_rate.push(Math.floor(daily_heart[0]));
              } else {
                let minMax = findMinMax(daily_heart);
                status_array_temp[m].push([Math.floor(minMax[0]), Math.floor(minMax[1])]);
                total_heart_rate.push(Math.floor(minMax[0])); total_heart_rate.push(Math.floor(minMax[1]));
              }
            } else {
              status_array_temp[m].push([0, 0]);
            }
          } else {
            let daily_value = healthData[1].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === start_day_date && ( m <= 2 ? temp.type === m : (temp.type >= m && temp.type <= m+1) );
            }).length;
            status_array_temp[m].push(daily_value);
          }
        }
      } else if(current_range_type === "monthly") {
        for(let i=1; i<= getEndOfMonth(show_from); i++){
          let daily_heart = [];
          let compare = moment(show_from).set({ date: i }).format("YYYY-MM-DD");
          if (m === 0) {
            let filter_day = healthData[m].filter(item => moment.utc(item.date).format("YYYY-MM-DD") === compare)
            for(let j=0; j<filter_day.length; j++){
              daily_heart.push(filter_day[j][rate_string[m]]);
            }
            if (daily_heart.length > 0) {
              if (daily_heart.length === 1) {
                status_array_temp[m].push([0, Math.floor(daily_heart[0])]);
                total_heart_rate.push(Math.floor(daily_heart[0]));
              } else {
                let minMax = findMinMax(daily_heart);
                status_array_temp[m].push([Math.floor(minMax[0]), Math.floor(minMax[1])]);
                total_heart_rate.push(Math.floor(minMax[0])); total_heart_rate.push(Math.floor(minMax[1]));
              }
            } else {
              status_array_temp[m].push([0, 0]);
            }
          } else {
            let daily_value = healthData[1].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === compare && ( m <= 2 ? temp.type === m : (temp.type >= m && temp.type <= m+1) );
            }).length;
            status_array_temp[m].push(daily_value);
          }
        }
      } else if(current_range_type === "yearly") {
        for(let k=0; k < 12; k++){
          let daily_heart = [];

          let compare = moment(show_from).set({ month: k }).format("YYYY-MM-01");
          if (m === 0) {
            let filter_month = healthData[m].filter(item => moment.utc(item.date).format("YYYY-MM-01") === compare);
            for(let j=0; j<filter_month.length; j++){
              daily_heart.push(filter_month[j][rate_string[m]]);
            }
            if (daily_heart.length > 0) {
              if (daily_heart.length === 1) {
                status_array_temp[m].push([0, Math.floor(daily_heart[0])]);
                total_heart_rate.push(Math.floor(daily_heart[0]));
              } else {
                let minMax = findMinMax(daily_heart);
                status_array_temp[m].push([Math.floor(minMax[0]), Math.floor(minMax[1])]);
                total_heart_rate.push(Math.floor(minMax[0])); total_heart_rate.push(Math.floor(minMax[1]));
              }
            } else {
              status_array_temp[m].push([0, 0]);
            }
          } else {
            let monthly_value = healthData[1].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-01") === compare && ( m <= 2 ? temp.type === m : (temp.type >= m && temp.type <= m+1) );
            }).length;
            status_array_temp[m].push(monthly_value);
          }
        }
      }
    }
  
    let response = [];
    for (let i = 0; i < 5; i++) {
      const minMax = findMinMax(total_heart_rate);
      response.push({
        value_array: status_array_temp[i],
        show_total: i === 0 ? (Math.floor(minMax[0]))+" - "+  Math.floor(minMax[1]) : 0
      })
    }
    
    return response;
  }

  navigateToECG = (e, ecg_type) => {
    const { show_from, current_range_type } = this.state;
    if (e && Object.keys(e).length > 0) {
      this.props.history.push(`/admin/health/ecg/detail?from=${moment(show_from).format("YYYY-MM-DD")}&index=${e.point.index}&chart_type=${current_range_type}&ecg_type=${ecg_type}`)
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
                {RangeBtns.map((item, index) => <button className={`range-btn ${current_range_type === item.value ? 'active' : ''}`} key={index} onClick={e => this.clickrange(item.value)}>{item.show}</button>)}
              </div>
            </div>
            <div className="chart_total_value">
              <div className="show_total_step_div">
                <label className="total_steps_header">Heart Rate: </label>
                <p><label className="total_steps_value">{data[0].show_total}</label>
                <label className="chart_unit"> BPM</label></p>
              </div>
            </div>
          </div>

          <div className="chart_total">
            <div className="chart-info v-c">
              <p className="step_date_range">Heart Rate, {show_from}  ~ {show_to}</p>
              {/* <HeartModal type="Heart Rate"/> */}
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label>&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.heartRateRef = c }
                  options={{
                    ...highOptions,
                    chart: {
                      ...highOptions.chart,
                      type: 'columnrange'
                    },
                    series: [{
                      name: 'Heart Rate',
                      data: data[0].value_array,
                      color: 'rgb(255,45,85)',
                    }],
                    tooltip: {
                      formatter: function() {
                        return `<b>${current_range_type === 'weekly' ? moment(show_from).add(this.point.index, 'day').format("YYYY-MM-DD") : this.point.category}</b><br/>
                              <span style="color:${this.point.color}">\u25CF</span>${this.point.series.name}:${this.point.low === 0 ? '': ''+this.point.low+' - '}${this.point.high}`;
                      }
                    },
                }} />
              </div>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button webview_next next_button_1 `} ><label>&#x203a;</label></button>
            </div>
            <div style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>

          <div className="chart_total ">
            <div className="chart-info v-c">
              <p className="step_date_range">Sinus Rhythm, {show_from}  ~ {show_to}</p>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label >&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.sinusRef = c }
                  options={{
                    ...highOptions,
                    series: [{
                      name: 'Sinus Rhythm',
                      data: data[1].value_array,
                      color: 'rgb(52,200,90)',
                      events: {
                        click: e => this.navigateToECG(e, 1)
                      }
                    }],
                }} />
              </div>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button webview_next next_button_1 `} ><label>&#x203a;</label></button>
            </div>
            <div style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>
          <div className="chart_total ">
            <div className="chart-info v-c">
              <p className="step_date_range">Atrial Fibrilation, {show_from}  ~ {show_to}</p>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label >&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.atrialRef = c }
                  options={{
                    ...highOptions,
                    series: [{
                      name: 'Atrial Fibrilation',
                      data: data[2].value_array,
                      color: 'rgb(255,0,0)',
                      events: {
                        click: e => this.navigateToECG(e, 2)
                      }
                    }],
                }} />
              </div>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button webview_next next_button_1 `} ><label>&#x203a;</label></button>
            </div>
            <div style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>

          <div className="chart_total ">
            <div className="chart-info v-c">
              <p className="step_date_range">Low And High Heart Rate, {show_from}  ~ {show_to}</p>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label >&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.lowAndHighRef = c }
                  options={{
                    ...highOptions,
                    series: [{
                      name: 'Low And High Heart Rate',
                      data: data[3].value_array,
                      color: 'rgb(0,0,255)',
                      events: {
                        click: e => this.navigateToECG(e, 3)
                      }
                    }],
                }} />
              </div>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button webview_next next_button_1 `} ><label>&#x203a;</label></button>
            </div>
            <div  style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>

          <div className="chart_total ">
            <div className="chart-info v-c">
              <p className="step_date_range">Inconclusive, {show_from}  ~ {show_to}</p>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label >&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.inconclusiveRef = c }
                  options={{
                    ...highOptions,
                    series: [{
                      name: 'Inconclusive',
                      data: data[4].value_array,
                      color: 'rgb(255,255,0)',
                      events: {
                        click: e => this.navigateToECG(e, 5)
                      }
                    }],
                }} />
              </div>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button webview_next next_button_1 `} ><label>&#x203a;</label></button>
            </div>
            <div style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    heartRate:state.heartRate.heartRate,
    ecg:state.heartRate.ecg,
  }
}
export default connect(mapStateToProps, { getHeartRate, getECG})(ECG);