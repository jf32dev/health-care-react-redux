import React from "react";
import "./chart.scss";
import { connect } from 'react-redux';
import HeartModal from './heartModal.js';
import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { RangeBtns, getEndOfMonth, getMonday, getInitalDates, generateLabelArray, generateHighOptions } from '../../utils/chartfunc';
import { getECG, getHeartPressure } from '../../redux/actions';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

class BloodPressure extends React.Component {
  state = {
    chart: [[],[]],
    label_array : ["Mon", "Tue", "Wed", "Thu", "Fri","Sat","Sun"],
    show_from: getInitalDates().first_day,
    show_to: getInitalDates().last_day,
    current_range_type:"weekly",
    healthData:[],
    rate_string:["heart_rate", "steps"]
  }
  
  static getDerivedStateFromProps(props, state) {
    return {
      healthData: [
        props.ecg,
        props.heart_pressure,
      ]
    };
  }

  componentDidMount() {
    this.props.getECG();
    this.props.getHeartPressure();
  }

  componentDidUpdate(prevProps) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.atrialRef.chart.redraw();
      this.bloodPressureRef.chart.redraw();
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

  calcPressure = (filteredData) => {
    let hourly_systolic = { low: 0, high: 0 };
    let hourly_diastolic = { low: 0, high: 0 };
    for(let j=0; j<filteredData.length; j++){
      hourly_systolic.low = hourly_systolic.low === 0 ? filteredData[j]['systolic'] : (filteredData[j]['systolic'] !== 0 && hourly_systolic.low > filteredData[j]['systolic']) ? filteredData[j]['systolic'] : hourly_systolic.low;
      hourly_systolic.high = hourly_systolic.high < filteredData[j]['systolic'] ? filteredData[j]['systolic'] : hourly_systolic.high;

      hourly_diastolic.low = hourly_diastolic.low === 0 ? filteredData[j]['diastolic'] : (filteredData[j]['diastolic'] !== 0 && hourly_diastolic.low > filteredData[j]['diastolic']) ? filteredData[j]['diastolic'] : hourly_diastolic.low;
      hourly_diastolic.high = hourly_diastolic.high < filteredData[j]['diastolic'] ? filteredData[j]['diastolic'] : hourly_diastolic.high;
    }
    return {
      systolic: [hourly_systolic.low, hourly_systolic.high],
      diastolic: [hourly_diastolic.low, hourly_diastolic.high]
    }
  }

  refresh_chart_value = () =>{
    const { healthData, current_range_type, show_from } = this.state;
    let status_array_temp = [[],[]];
    let status_array_pressure = {systolic:[],diastolic:[]};
    let status_dot_pressure = {systolic:[],diastolic:[]};

    let total_systolic = { low: 0, high: 0 };
    let total_diastolic = { low: 0, high: 0 };

    for (let m = 0; m < 2; m++) {
      if (current_range_type === "daily") {
        for(let j=0; j<24; j++){
          let stamp = moment(show_from).set({ hour: j }).format("YYYY-MM-DD HH:00");
          if(m===0){
            let houlry_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD HH:00") === stamp && temp.type === 2;
            }).length;
            status_array_temp[m].push(houlry_value);
          } else {
            let filter_hour = healthData[m].filter(item => moment(item.date).format("YYYY-MM-DD HH:00") === stamp);
            if (filter_hour.length > 0) {
              let response = this.calcPressure(filter_hour);

              if (filter_hour.length === 1) {
                status_dot_pressure.systolic.push(response.systolic[0]);
                status_dot_pressure.diastolic.push(response.diastolic[0]);
                status_array_pressure['systolic'].push([0, 0]); 
                status_array_pressure['diastolic'].push([0, 0]);
              } else {
                status_dot_pressure.systolic.push(null);
                status_dot_pressure.diastolic.push(null);
                status_array_pressure['systolic'].push(response.systolic);
                status_array_pressure['diastolic'].push(response.diastolic); 
              }

              total_systolic.low = total_systolic.low === 0 ? response.systolic[0] : (response.systolic[0] !== 0 && total_systolic.low > response.systolic[0]) ? response.systolic[0] : total_systolic.low;
              total_systolic.high = total_systolic.high < response.systolic[1] ? response.systolic[1] : total_systolic.high;
              total_diastolic.low = total_diastolic.low === 0 ? response.diastolic[0] : (response.diastolic[0] !== 0 && total_diastolic.low > response.diastolic[0]) ? response.diastolic[0] : total_diastolic.low;
              total_diastolic.high = total_diastolic.high < response.diastolic[1] ? response.diastolic[1] : total_diastolic.high;
            } else {
              status_dot_pressure.systolic.push(null);
              status_dot_pressure.diastolic.push(null);
              status_array_pressure['systolic'].push([0, 0]); 
              status_array_pressure['diastolic'].push([0, 0]); 
            }
          }
        }
      } else if(current_range_type === "weekly") {
        for(let i=0; i< 7; i++){
          let start_day_date = moment(show_from).add(i, 'days').format("YYYY-MM-DD");
          if (m === 0) {
            let daily_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === start_day_date && temp.type === 2;
            }).length;
            status_array_temp[m].push(daily_value);
          } else {
            let filter_day = healthData[m].filter(item => moment(item.date).format("YYYY-MM-DD") === start_day_date);
            if (filter_day.length > 0) {
              let response = this.calcPressure(filter_day);

              if (filter_day.length === 1) {
                status_dot_pressure.systolic.push(response.systolic[0]);
                status_dot_pressure.diastolic.push(response.diastolic[0]);
                status_array_pressure['systolic'].push([0, 0]); 
                status_array_pressure['diastolic'].push([0, 0]);
              } else {
                status_dot_pressure.systolic.push(null);
                status_dot_pressure.diastolic.push(null);
                status_array_pressure['systolic'].push(response.systolic); 
                status_array_pressure['diastolic'].push(response.diastolic); 
              }

              total_systolic.low = total_systolic.low === 0 ? response.systolic[0] : (response.systolic[0] !== 0 && total_systolic.low > response.systolic[0]) ? response.systolic[0] : total_systolic.low;
              total_systolic.high = total_systolic.high < response.systolic[1] ? response.systolic[1] : total_systolic.high;
              total_diastolic.low = total_diastolic.low === 0 ? response.diastolic[0] : (response.diastolic[0] !== 0 && total_diastolic.low > response.diastolic[0]) ? response.diastolic[0] : total_diastolic.low;
              total_diastolic.high = total_diastolic.high < response.diastolic[1] ? response.diastolic[1] : total_diastolic.high;
            } else {
              status_dot_pressure.systolic.push(null);
              status_dot_pressure.diastolic.push(null);
              status_array_pressure['systolic'].push([0, 0]); 
              status_array_pressure['diastolic'].push([0, 0]); 
            }
          }
        }
      } else if(current_range_type === "monthly") {
        for(let i=1; i<= getEndOfMonth(show_from); i++){
          let compare = moment(show_from).set({ date: i }).format("YYYY-MM-DD");
          if (m === 0) {
            let daily_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === compare && temp.type === 2;
            }).length;
            status_array_temp[m].push(daily_value);
          } else {
            let filter_day = healthData[m].filter(item => moment(item.date).format("YYYY-MM-DD") === compare)
            if (filter_day.length > 0) {
              let response = this.calcPressure(filter_day);

              if (filter_day.length === 1) {
                status_dot_pressure.systolic.push(response.systolic[0]);
                status_dot_pressure.diastolic.push(response.diastolic[0]);
                status_array_pressure['systolic'].push([0, 0]); 
                status_array_pressure['diastolic'].push([0, 0]);
              } else {
                status_dot_pressure.systolic.push(null);
                status_dot_pressure.diastolic.push(null);
                status_array_pressure['systolic'].push(response.systolic); 
                status_array_pressure['diastolic'].push(response.diastolic); 
              }

              total_systolic.low = total_systolic.low === 0 ? response.systolic[0] : (response.systolic[0] !== 0 && total_systolic.low > response.systolic[0]) ? response.systolic[0] : total_systolic.low;
              total_systolic.high = total_systolic.high < response.systolic[1] ? response.systolic[1] : total_systolic.high;
              total_diastolic.low = total_diastolic.low === 0 ? response.diastolic[0] : (response.diastolic[0] !== 0 && total_diastolic.low > response.diastolic[0]) ? response.diastolic[0] : total_diastolic.low;
              total_diastolic.high = total_diastolic.high < response.diastolic[1] ? response.diastolic[1] : total_diastolic.high;
            } else {
              status_dot_pressure.systolic.push(null);
              status_dot_pressure.diastolic.push(null);
              status_array_pressure['systolic'].push([0, 0]); 
              status_array_pressure['diastolic'].push([0, 0]); 
            }
          }
        }
      } else if(current_range_type === "yearly") {
        for(let k=0; k < 12; k++){
          let compare = moment(show_from).set({ month: k }).format("YYYY-MM-01");
          if (m === 0) {
            let monthly_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-01") === compare && temp.type === 2;
            }).length;
            status_array_temp[m].push(monthly_value);
          } else {
            let filter_month = healthData[m].filter(item => moment(item.date).format("YYYY-MM-01") === compare);
            if (filter_month.length > 0) {
              let response = this.calcPressure(filter_month);

              if (filter_month.length === 1) {
                status_dot_pressure.systolic.push(response.systolic[0]);
                status_dot_pressure.diastolic.push(response.diastolic[0]);
                status_array_pressure['systolic'].push([0, 0]); 
                status_array_pressure['diastolic'].push([0, 0]);
              } else {
                status_dot_pressure.systolic.push(null);
                status_dot_pressure.diastolic.push(null);
                status_array_pressure['systolic'].push(response.systolic); 
                status_array_pressure['diastolic'].push(response.diastolic); 
              }

              total_systolic.low = total_systolic.low === 0 ? response.systolic[0] : (response.systolic[0] !== 0 && total_systolic.low > response.systolic[0]) ? response.systolic[0] : total_systolic.low;
              total_systolic.high = total_systolic.high < response.systolic[1] ? response.systolic[1] : total_systolic.high;
              total_diastolic.low = total_diastolic.low === 0 ? response.diastolic[0] : (response.diastolic[0] !== 0 && total_diastolic.low > response.diastolic[0]) ? response.diastolic[0] : total_diastolic.low;
              total_diastolic.high = total_diastolic.high < response.diastolic[1] ? response.diastolic[1] : total_diastolic.high;
            }else {
              status_dot_pressure.systolic.push(null);
              status_dot_pressure.diastolic.push(null);
              status_array_pressure['systolic'].push([0, 0]); 
              status_array_pressure['diastolic'].push([0, 0]); 
            }
          }
        }
      }
    }
  
    let response = [];
    for (let i = 0; i < 2; i++) {
      response.push({
        value_array: status_array_temp[i],
        show_total: 0
      })
    }

    response[1].value_array = status_array_pressure['systolic'];
    response[1].value_array1 = status_array_pressure['diastolic'];

    response[1].value_array2 = status_dot_pressure['systolic'];
    response[1].value_array3 = status_dot_pressure['diastolic'];
    response[1].show_total = `${total_systolic.low}${total_systolic.low !== total_systolic.high ? "-"+total_systolic.high : ''}/${total_diastolic.low}${total_diastolic.low !== total_diastolic.high ? "-"+total_diastolic.high : ''}`;
    
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
                {RangeBtns.map((item, index) => <button className={`range-btn ${current_range_type === item.value ? 'active' : ''}`} key={index} onClick={e => this.clickrange(item.value)}>{item.show}</button>)}
              </div>
            </div>
            <div className="chart_total_value v-c">
              <div className="show_total_step_div">
                <label className="total_steps_header">Systolic/Diastolic: </label>
                <p><label className="total_steps_value">{data[1].show_total}</label>
                <label className="chart_unit"> mmHg</label></p>
              </div>
            </div>
          </div>

          <div className="chart_total">
            <div className="chart-info v-c">
              <p className="step_date_range">Atrial Fibrilation, {show_from}  ~ {show_to}</p>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')} className={`step_date_button webview_prev prev_button_1`} > <label>&#x2039;</label></button>
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
              <button onClick={e => this.moveDate('next')} className={`step_date_button webview_next next_button_1`} ><label>&#x203a;</label></button>
            </div>
            <div style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>

          {/* Step rate */}
          <div className="chart_total ">
            <div className="chart-info v-c">
              <p className="step_date_range">Blood Pressure, {show_from}  ~ {show_to}</p>
              <HeartModal type="Blood Pressure"/>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label>&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.bloodPressureRef = c }
                  options={{
                    ...highOptions,
                    chart: {
                      height: 350,
                      scrollablePlotArea: {
                        minWidth: 600,
                        scrollPositionX: 1
                      }
                    },
                    tooltip: {
                      formatter: function() {
                        return `<b>${current_range_type === 'weekly' ? moment(show_from).add(this.point.index, 'day').format("YYYY-MM-DD") : this.point.category}</b><br/>
                              <span style="color:${this.point.color}">\u25CF</span>${this.point.series.name}:${this.point.low ? ''+this.point.low+' - '+this.point.high : this.point.y}`;
                      }
                    },
                    series: [{
                      type: 'columnrange',
                      name: 'Systolic',
                      data: data[1].value_array,
                      color: 'rgb(254,44,85)',
                    },{
                      type: 'columnrange',
                      name: 'Diastolic',
                      data: data[1].value_array1,
                      color: '#36a2eb',
                    },{
                      name: 'Systolic',
                      data: data[1].value_array2,
                      color: 'rgb(254,44,85)',
                      lineWidth: 0,
                      marker: {
                        enabled: true,
                        radius: 4
                      },
                    },{
                      name: 'Diastolic',
                      data: data[1].value_array3,
                      color: '#36a2eb',
                      lineWidth: 0,
                      marker: {
                        enabled: true,
                        radius: 4
                      },
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
        </CardBody>
      </Card>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ecg:state.heartRate.ecg,
    heart_pressure:state.heartRate.heart_pressure,
  }
}
export default connect(mapStateToProps, { getECG, getHeartPressure})(BloodPressure);