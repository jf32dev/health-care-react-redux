import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ReactTable from 'react-table';
import { getMyPost } from '../../redux/actions';
import { deletePost as deletePostApi } from '../../api';
class Post extends Component {
  state = {
    myposts:[],
  }

  static getDerivedStateFromProps(props, state) {
    return {
      myposts:props.myposts
    };
  }

  removePost = async (id) =>{
		await deletePostApi(id);
		this.props.getMyPost();
	}

  componentDidMount() {
    this.props.getMyPost();
  }

  render() {
    const { myposts } = this.state;
    return (
    <div className='animated fadeIn post_app'>
      <Card>
        <CardHeader>
          <i className='cil-storage'></i> All Posts
        </CardHeader>
        <CardBody>
					<div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom:"20px"}}>
						<Button color="primary" onClick={e => this.props.history.push('/admin/post/create')}>+ Add</Button>
					</div>
          <ReactTable
            data={myposts}
            className='-striped -highlight'
            defaultPageSize={10}
            filterable
            columns={[
              {
                Header: 'ID',
                width: 60,
                id: 'id',
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  return row.id.props.children.toString().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <Link to={`/admin/post/${r.id}`}>{r.id}</Link>, 
              },
              {
                Header: 'Nickname',
                id: 'Nickname',
                width: 200,
                className: 'v-c h-c',
                filterMethod: (filter, row) => {
                  return row.Nickname.props.children.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <Link to={`/admin/post/${r.id}`}>{r.nickname}</Link>, 
              },
              {
                Header: 'Content',
                id: 'Content',
                className: 'v-c',
                filterMethod: (filter, row) => {
                  return row.Content.props.children.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                },
                accessor: r => <Link to={`/admin/post/${r.id}`}>{r.content}</Link>, 
              },
              {
                Header: 'Delete',
								id: 'Delete',
								width: 100,
                className: 'v-c h-c',
                accessor: r => <Button color="danger" id={r.id} onClick={e => this.removePost(r.id)}>Delete</Button>, 
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
    myposts:state.post.my_posts
  }
}

export default connect(mapStateToProps, { getMyPost })(Post);