import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ReactTable from 'react-table';
import { getMyGoods } from '../../redux/actions';
import { deleteGood as deleteGoodApi } from '../../api';

class GoodManage extends Component {
  state = {
    mygoods:[],
  }

  static getDerivedStateFromProps(props, state) {
    return {
      mygoods:props.mygoods
    };
  }

  removeGood = async (id) =>{
		await deleteGoodApi(id);
		this.props.getMyGoods();
	}

  componentDidMount() {
    this.props.getMyGoods();
  }

  render() {
    const { mygoods } = this.state;
    return (
    <div className='animated fadeIn'>
      <Card>
        <CardHeader>
          <i className='cil-cart'></i> All Goods
        </CardHeader>
        <CardBody>
					<div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom:"20px"}}>
						<Button color="primary" onClick={e => this.props.history.push('/admin/good/create')}>+ Add</Button>
					</div>
          <ReactTable
            data={mygoods}
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
                accessor: r => <Link to={`/admin/good/${r.id}`}>{r.id}</Link>, 
              },
              {
                Header: 'Name',
                id: 'Name',
                className: 'v-c',
                filterMethod: (filter, row) => {
                  return row.Name.props.children.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <Link to={`/admin/good/${r.id}`}>{r.name}</Link>, 
							},
							{
                Header: 'Price',
								id: 'Price',
								width: 100,
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  return row.Price.props.children.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
								},
								accessor: r => <div>${r.price}</div>,
              },
              {
                Header: 'Delete',
								id: 'Delete',
								width: 100,
                className: 'v-c h-c',
                accessor: r => <Button color="danger" id={r.id} onClick={e => this.removeGood(r.id)}>Delete</Button>, 
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
    mygoods:state.good.my_goods
  }
}

export default connect(mapStateToProps, { getMyGoods })(GoodManage);