import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ReactTable from 'react-table';
import { getUsers } from '../../redux/actions';
import { modifyUser as modifyUserApi } from '../../api';
import { modifyUser, setDoctorTableInfo } from '../../redux/actions';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { NavLink, withRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class DoctorManage extends Component {
  state = {
    users:[],

    pageSize: 10,
    page: 0
  }

  static getDerivedStateFromProps(props, state) {
    return {
      users:props.users
    };
  }

  componentDidMount() {
    if (this.props.history.action === 'PUSH') {
      this.props.setDoctorTableInfo({
        doctor_page_size: 10,
        doctor_page: 0
      })
    } else if (this.props.history.action === 'POP') {
      this.setState({
        pageSize: this.props.doctor_page_size,
        page: this.props.doctor_page
      })
    }
    this.props.getUsers();
  }

  componentWillUnmount() {
    this.props.setDoctorTableInfo({
      doctor_page_size: this.state.pageSize,
      doctor_page: this.state.page
    })
  }

  modifyUser = async (id, value) => {
    try {
      if (window.confirm('Are you sure want to proceed?')) {
        const response = await modifyUserApi(id, value);
        if (response.data) {
          this.props.modifyUser(id, value);
        } else {
          this.props.enqueueSnackbar('There was a problem modifying user. Please try again later.', { variant: 'error' })
        }
      }
    } catch(e) {
      this.props.enqueueSnackbar('There was a problem modifying user. Please try again later.', { variant: 'error' })
    }
  }

  render() {
    const { users, pageSize, page } = this.state;
    let data = users.filter(temp => temp.type === 1);
    return (
    <div className='animated fadeIn article_app'>
      <Card>
        <CardHeader>
          <i className='cil-people'></i> All Users
        </CardHeader>
        <CardBody>
          <ReactTable
            data={data}
            className='-striped -highlight'
            defaultPageSize={10}
            minRows={10}
            pageSize={pageSize}
            page={page}
            onPageChange={e=>this.setState({ page: e })}
            onPageSizeChange={e=>this.setState({ pageSize: e })}
            filterable
            getTheadFilterThProps={() => {
              return {
                style: {
                  overflow: "inherit"
                }
              }
            }}
            columns={[
              {
                Header: 'ID',
                width: 60,
                id: 'id',
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  return row.id.props.children.toString().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <NavLink to={`/admin/doctor/${r.id}`}>{r.id}</NavLink>, 
              },
              {
                Header: 'Photo',
                width: 60,
                id: 'photo',
                className: 'v-c h-c',
                Filter: ({ filter, onChange }) => <div />,
                accessor: r => <img src={r.photo} alt="" style={{width: '50px', height: '50px', borderRadius: '50%'}}/> 
              },
              {
                Header: 'Username',
                id: 'username',
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  return row._original.username.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <NavLink to={`/admin/doctor/${r.id}`}>{r.username}</NavLink>, 
              },
              {
                Header: 'Name',
                id: 'name',
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  return `${row._original.first_name} ${row._original.last_name}`.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => r.first_name+" "+r.last_name
              },
              {
                Header: 'Email',
                accessor: 'email',
                className: 'v-c h-c',
              },
              {
                Header: 'Member Since',
                className: 'v-c h-c',
                width: 150,
                id: 'createdAt',
                filterMethod: (filter, row) => {
                  return !filter.value ? true : moment(row._original.createdAt).set('hours', 0) >= moment(filter.value).set('hours', 0);
                },
                accessor: r => moment(r.createdAt).format("MM/DD/YYYY"),
                Filter: ({filter, onChange}) => (
                  <DatePicker selected={filter ? filter.value : ''} onChange={date => onChange(date)}/>
                )
              },
              {
                Header: 'Action',
								id: 'Action',
								width: 180,
                className: 'v-c h-c',
                Filter: ({ filter, onChange }) => <div />,
                accessor: r => <div className="v-c">
                  {r.status === 0 && <Button color="primary" style={{marginRight: '5px'}} onClick={e => this.modifyUser(r.id, 1)}>Activate</Button>}
                  {/* {r.status === 1 && <Button color="secondary" onClick={e => this.modifyUser(r.id, 2)}>Block</Button>}
                  {r.status === 2 && <Button color="success" onClick={e => this.modifyUser(r.id, 1)}>Unblock</Button>} */}
                  <Button color="danger" onClick={e => this.modifyUser(r.id, 3)}>Delete</Button>
                </div>
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
    users:state.user.users,
    doctor_page_size: state.user.doctor_page_size,
    doctor_page: state.user.doctor_page
  }
}

export default withRouter(connect(mapStateToProps, { getUsers, modifyUser, setDoctorTableInfo })(withSnackbar(DoctorManage)));
