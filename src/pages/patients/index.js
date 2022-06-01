import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader } from 'reactstrap';
import ReactTable from 'react-table';
import { addNotification } from '../../redux/actions';

class User extends Component {
  state = {
    users: [],
  }

  static getDerivedStateFromProps(props, state) {
    return {
      users: [],
    };
  }

  render() {
    const { users } = this.state;
    return (
    <div className='animated fadeIn' style={{marginTop:"80px"}}>
      <Card>
        <CardHeader>
          <i className='cil-people'></i> All Users
        </CardHeader>
        <CardBody>
          <ReactTable
            data={users}
            className='-striped -highlight'
            defaultPageSize={10}
            filterable
            columns={[
              {
                Header: 'ID',
                width: 100,
                id: 'id',
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  return row.id.props.children.toString().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <Link to={`/admin/patients/${r.id}`}>{r.id}</Link>, 
              },
              {
                Header: 'Name',
                id: 'Name',
                width: 200,
                className: 'v-c',
                filterMethod: (filter, row) => {
                  return row.name.props.children.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <Link to={`/admin/patients/${r.id}`}>{r.name}</Link>, 
              },
             
              {
                Header: 'Email',
                width: 300,
                accessor: 'email',
                className: 'v-c',
              },
              {
                Header: 'Phone Number',
                width: 200,
                accessor: 'phonenumber',
                className: 'v-c',
              },
             
           
              {
                Header: 'Date registered',
                id: 'createdAt',
                width: 200,
                className: 'v-c',
                accessor: r => moment(r.createdAt).format('YYYY-MM-DD'), 
              },
              {
                Header: 'Status',
                id: 'status',
                width: 100,
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  if (filter.value === 'all') {
                    return true;
                  }
                  return row.status.props.children === filter.value
                },
                Filter: ({ filter, onChange }) =>
                  <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: '100%' }}
                    value={filter ? filter.value : 'all'}
                  >
                    <option value='all'>All</option>
                    <option value='Unverified'>Unverified</option>
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                    <option value='Deleted'>Deleted</option>
                  </select>,
                accessor: r => r.status === 0 ? <Badge color='info'>Unverified</Badge>
                                :r.status === 1 ? <Badge color='success'>Active</Badge>
                                : r.status === 2 ? <Badge color='warning'>Inactive</Badge>
                                : <Badge color='Active'>Active</Badge>
              },
            ]}
          />
        </CardBody>
      </Card>
    </div>
    )
  }
} 

const mapStateToProps = (state) => {
  return {
    me : state.auth.me,
    isLoggedin:state.auth.loggedin
  }
}

export default connect(mapStateToProps, { addNotification })(User);