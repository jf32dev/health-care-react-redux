import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Card, CardBody, CardHeader } from 'reactstrap';
import './health.scss';

const HealthDatas = [
  { iconClass: 'fas fa-heartbeat', link: '/admin/health/ecg', name: 'ECG', color: 'rgb(52,200,90)' },
  { iconClass: 'fas fa-running', link: '/admin/health/activity', name: 'Activity', color: 'rgb(255,59,47)' },
  { iconClass: 'fas fa-weight', link: '/admin/health/weight', name: 'Body Weight', color: 'rgb(168,89,215)' },
  { iconClass: 'fas fa-walking', link: '/admin/health/steps', name: 'Steps', color: '#314d81' },
  { iconClass: 'fas fa-bed', link: '/admin/health/sleep', name: 'Sleep', color: 'rgb(241,225,121)' },
  { iconClass: 'fas fa-beer', link: '/admin/health/alcohol', name: 'Alcohol Use', color: 'rgb(142,141,146)' },
  { iconClass: 'fas fa-heart', link: '/admin/health/blood-pressure', name: 'Blood Pressure', color: 'rgb(254,44,85)' },
];
class Health extends Component {
  render() {
    return (
    <div className='animated fadeIn post_app'>
      <Card>
        <CardHeader>
          <i className='cil-storage'></i> Health Categories
        </CardHeader>
        <CardBody>
          <div className="v-r">
            {HealthDatas.map((item, index) => <NavLink to={item.link} className="health-link v-c" key={index}>
              <div className="v-c h-c" style={{width: '30px', marginRight: '10px'}}>
                <i className={item.iconClass} style={{margin: 0, color: item.color}}/> 
              </div>
              {item.name}
              <i className="fa fa-arrow-right" aria-hidden="true" />
            </NavLink>)}
          </div>
        </CardBody>
      </Card>
    </div>
    )
  }
} 

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, {})(Health);