import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Row, Col, FormGroup, Label } from 'reactstrap';
import { getUsers } from '../../redux/actions';
import { modifyUser as modifyUserApi, resetUserPassword as resetUserPasswordApi, getTransactionHistory as getTransactionHistoryApi } from '../../api';
import { modifyUser } from '../../redux/actions';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

class UserDetail extends Component {
  state = {
    user: {
			id: 0,
    },
    payment_info: []
  }

  static getDerivedStateFromProps(props, state) {
    return {
      users:props.users
    };
  }

  async componentDidMount() {
		if (this.props.match.params.id && this.props.match.params.id !== 'create') {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.users.findIndex(temp => temp.id === id);
			if (index !== -1) {
				this.setState({
					user: this.props.users[index]
        })
        if (this.props.users[index].stripe_customer_id) {
          const result = await getTransactionHistoryApi(this.props.users[index].stripe_customer_id);
          if (result && result.data) {
            this.setState({
              payment_info: result.data.data || []
            })
          }
        }
			} else {
				this.props.getUsers(0);
			}
		}
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.loading && !this.props.loading) {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.users.findIndex(temp => temp.id === id);
			if (index !== -1) {
				this.setState({
					user: this.props.users[index]
        })
        if (this.props.users[index].stripe_customer_id) {
          const result = await getTransactionHistoryApi(this.props.users[index].stripe_customer_id);
          if (result && result.data) {
            this.setState({
              payment_info: result.data.data || []
            })
          }
        }
			}
		}
	}

  modifyUser = async (id, value) => {
    if (window.confirm('Are you sure want to delete this user?')) {
      try {
        const response = await modifyUserApi(id, value);
        if (response.data) {
          this.goBack();
        } else {
          this.props.enqueueSnackbar('There was a problem modifying user. Please try again later.', { variant: 'error' })
        }
      } catch(e) {
        this.props.enqueueSnackbar('There was a problem modifying user. Please try again later.', { variant: 'error' })
      }
    }
  }

  goBack = () => {
    this.props.history.goBack();
  }

  resetPassword = async () => {
    const { user } = this.state;
    var password = prompt("Please enter new password", "");

    if (!password || password.length < 6) {
      this.props.enqueueSnackbar('The password should be at least 6 letters.', { variant: 'error' })
    } else {
      try {
        const response = await resetUserPasswordApi(user.id, password);
        if (response.data) {
          this.props.enqueueSnackbar('Success.', { variant: 'success' })
        } else {
          this.props.enqueueSnackbar('There was a problem modifying user. Please try again later.', { variant: 'error' })
        }
      } catch(e) {
        this.props.enqueueSnackbar('There was a problem modifying user. Please try again later.', { variant: 'error' })
      }
    }
  }

  render() {
    const { user, payment_info } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={8}>
            <Card>
              <CardHeader>
                  <strong><i className="icon-info pr-1"></i>User ID: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                {user.id > 0 ? <div className="v-r">
                  <img src={user.photo} alt="" style={{width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto'}}/>
                  <FormGroup row>
                    <Label sm={2}>Username:</Label>
                    <Label sm={9}>{user.username}</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Name:</Label>
                    <Label sm={9}>{user.first_name} {user.last_name}</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Email:</Label>
                    <Label sm={9}>{user.email}</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Phone Number:</Label>
                    <Label sm={9}>{user.phonenumber}</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Address:</Label>
                    <Label sm={9}>{user.address}</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>About:</Label>
                    <Label sm={9}>{user.about}</Label>
                  </FormGroup>
                  {user.type === 1 && <FormGroup row>
                    <Label sm={2}>Subject:</Label>
                    <Label sm={9}>{user.subject}</Label>
                  </FormGroup>}
                  <FormGroup row>
                    <Label sm={2}>Subscribe:</Label>
                    <Label sm={9}>{user.stripe_customer_id ? 'Yes' : 'No'}</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Member Since:</Label>
                    <Label sm={9}>{moment(user.createdAt).format("MM/DD/YYYY")}</Label>
                  </FormGroup>
                  {user.stripe_customer_id && <div className="v-r">
                    <p>Payment History</p>
                    <ReactTable
                      data={payment_info}
                      className='-striped -highlight'
                      defaultPageSize={5}
                      minRows={5}
                      columns={[
                        {
                          Header: 'Amount',
                          id: 'amount',
                          className: 'v-c h-c',
                          accessor: 'amount',
                          Cell: ({ value }) => (value / 100),
                        },
                        {
                          Header: 'Currency',
                          id: 'currency',
                          className: 'v-c h-c',
                          accessor: 'currency'
                        },
                        {
                          Header: 'Date',
                          id: 'created',
                          className: 'v-c h-c',
                          accessor: 'created',
                          Cell: ({ value }) => moment(value * 1000).format("YYYY-MM-DD HH:mm:ss"),
                        },
                        {
                          Header: 'Status',
                          id: 'status',
                          className: 'v-c h-c',
                          accessor: 'status'
                        },
                      ]}
                    />
                  </div>}
                  <div style={{display: 'flex', marginTop: '20px'}}>
                    <Button color="primary" style={{margin: '0 15px 0 auto'}} onClick={e => this.goBack()}>Go Back</Button>
                    <Button color="success" style={{marginRight: '15px'}} onClick={e => this.resetPassword()}>Reset Password</Button>
                    <Button color="danger" onClick={e => this.modifyUser(user.id, 3)}>Delete</Button>
                  </div>
                </div> : <div>Not Found</div>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
} 

const mapStateToProps = (state) => {
  return {
    users:state.user.users,
    loading: state.user.loading
  }
}

export default withRouter(connect(mapStateToProps, { getUsers, modifyUser })(withSnackbar(UserDetail)));
