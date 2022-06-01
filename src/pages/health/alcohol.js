import React from "react";
import "./chart.scss";
import { connect } from 'react-redux';
import HeartModal from './heartModal.js';
import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { RangeBtns, getEndOfMonth, getMonday, getInitalDates, generateLabelArray, generateHighOptions } from '../../utils/chartfunc';
import { getECG, getAlcoholUse } from '../../redux/actions';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

class Alcohol extends React.Component {
  state = {
    chart: [[],[]],
    label_array : ["Mon", "Tue", "Wed", "Thu", "Fri","Sat","Sun"],
    show_from: getInitalDates().first_day,
    show_to: getInitalDates().last_day,
    current_range_type:"weekly",
    healthData:[],
    rate_string:["heart_rate", "alcohol"]
  }
  
  static getDerivedStateFromProps(props, state) {
    return {
      healthData: [
        props.ecg,
        props.alcohol_use,
      ]
    };
  }

  componentDidMount() {
    this.props.getECG();
    this.props.getAlcoholUse();
  }

  componentDidUpdate(prevProps) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.atrialRef.chart.redraw();
      this.alcoholRef.chart.redraw();
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
    let status_array_temp = [[],[],[],[]];
    
    let total_steps = [];

    for (let m = 0; m < 2; m++) {
      if (current_range_type === "daily") {
        let total_step =0;
        for(let j=0; j<24; j++){
          let stamp = moment(show_from).set({ hour: j }).format("YYYY-MM-DD HH:00");
          if(m===0){
            let houlry_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD HH:00") === stamp && temp.type === 2;
            }).length;
            status_array_temp[m].push(houlry_value)
          } else {
            let filter_hour = healthData[m].filter(item => moment(item.date).format("YYYY-MM-DD HH:00") === stamp);
            let houlry_value=0;
            for(let j=0; j<filter_hour.length; j++){
              houlry_value+= filter_hour[j][rate_string[m]];
            }
            total_step+=houlry_value;
            status_array_temp[m].push(Math.floor(houlry_value));
          }
        }
        total_steps[m] = total_step.toFixed(0);
      } else if(current_range_type === "weekly") {
        let today = new Date(show_from);
        let total_step =0;
       
        let non_zero_count = 0;
        for(let i=0; i< 7; i++){
          let start_day_date = moment(today).add(i, 'days').format("YYYY-MM-DD");
          if (m === 0) {
            let daily_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === start_day_date && temp.type === 2;
            }).length;
            status_array_temp[m].push(daily_value);
          } else {
            let filter_day = healthData[m].filter(item => moment(item.date).format("YYYY-MM-DD") === start_day_date);
            let daily_value=0;
            for(let j=0; j<filter_day.length; j++){
              daily_value+= filter_day[j][rate_string[m]];
            }
            non_zero_count = daily_value > 0 ? non_zero_count+1 : non_zero_count;
            total_step+=daily_value;
            status_array_temp[m].push(Math.floor(daily_value));
          }
        }
        total_steps[m] = non_zero_count>0 ? (total_step/non_zero_count).toFixed(0) : 0;
      } else if(current_range_type === "monthly") {
        let total_step =0;
        let non_zero_count = 0;
        
        for(let i=1; i<= getEndOfMonth(show_from); i++){
          let compare = moment(show_from).set({ date: i }).format("YYYY-MM-DD");
          if (m === 0) {
            let daily_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-DD") === compare && temp.type === 2;
            }).length;
            status_array_temp[m].push(daily_value);
          } else {
            let filter_day = healthData[m].filter(item => moment(item.date).format("YYYY-MM-DD") === compare)
            let daily_value=0;
            for(let j=0; j<filter_day.length; j++){
              daily_value+= filter_day[j][rate_string[m]];
            }
            non_zero_count = daily_value > 0 ? non_zero_count+1 : non_zero_count;
            total_step+=daily_value;
            status_array_temp[m].push(Math.floor(daily_value));
          }
        }
        total_steps[m] = non_zero_count >0 ? (total_step/non_zero_count).toFixed(0) : 0;
      } else if(current_range_type === "yearly") {
        let non_zero_count = 0;
        let total_step = 0;
        for(let k=0; k < 12; k++){
          let compare = moment(show_from).set({ month: k }).format("YYYY-MM-01");
          if (m === 0) {
            let monthly_value = healthData[m].filter(temp => {
              return moment.utc(temp.date).format("YYYY-MM-01") === compare && temp.type === 2;
            }).length;
            status_array_temp[m].push(monthly_value);
          } else {
            let filter_month = healthData[m].filter(item => moment(item.date).format("YYYY-MM-01") === compare);
            let monthly_value = 0;
            
            for(let j=0; j<filter_month.length; j++){
              monthly_value+=filter_month[j][rate_string[m]];
            }

            non_zero_count = monthly_value > 0 ? non_zero_count+1 : non_zero_count;
            status_array_temp[m].push(Math.floor(monthly_value));
            total_step+=monthly_value;
          }
        }
        total_steps[m] = non_zero_count > 0 ? (total_step/non_zero_count).toFixed(0) : 0;
      }
    }
  
    let response = [];
    for (let i = 0; i < 2; i++) {
      response.push({
        value_array: status_array_temp[i],
        show_total: i === 0 ? 0 : total_steps[i]
      })
    }
    return response;
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
            {/* <div className="chart_total_value">
              <div className="show_total_step_div">
                <label className="total_steps_header">Blood Alcohol: </label>
                <p><label className="total_steps_value">{data[1].show_total}</label>
                <label className="chart_unit"> %</label></p>
              </div>
            </div> */}
          </div>

          <div className="chart_total">
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
                      data: data[0].value_array,
                      color: 'rgb(255,0,0)',
                      events: {
                        click: e => this.navigateToECG(e, 2)
                      }
                    }],
                }} />
              </div>
              <button onClick={e => this.moveDate('next')} className={`step_date_button webview_next next_button_1`} ><label >&#x203a;</label></button>
            </div>
            <div style={{display:'flex',justifyContent:"center"}}>
              <button onClick={e => this.moveDate('prev')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x2039;</label></button>
              <button onClick={e => this.moveDate('next')} className={`step_date_button mobileview_prev prev_button_1 `} ><label>&#x203a;</label></button>
            </div>
          </div>

          {/* Step rate */}
          <div className="chart_total ">
            <div className="chart-info v-c">
              <p className="step_date_range">Alcohol, {show_from}  ~ {show_to}</p>
              <HeartModal type="Number of drinks"/>
            </div>
            <div className="chart_div v-c">
              <button onClick={e => this.moveDate('prev')}  className={`step_date_button webview_prev prev_button_1 `} > <label>&#x2039;</label></button>
              <div className="chart_desktop">
                <HighchartsReact
                  highcharts={Highcharts}
                  ref={ c => this.alcoholRef = c }
                  options={{
                    ...highOptions,
                    series: [{
                      name: 'Number of drinks',
                      data: data[1].value_array,
                      color: 'rgb(142,141,146)',
                    }],
                }} />
              </div>
              <button onClick={e => this.moveDate('next')}  className={`step_date_button webview_next next_button_1 `} ><label >&#x203a;</label></button>
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
    alcohol_use:state.heartRate.alcohol_use,
  }
}
export default connect(mapStateToProps, { getECG, getAlcoholUse})(Alcohol);