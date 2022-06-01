import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ReactTable from 'react-table';
import { getMyArticles, updateArticle } from '../../redux/actions';
import { deleteArticle as deleteArticleApi } from '../../api';
import { withSnackbar } from 'notistack';

class ArticleManage extends Component {
  state = {
    myarticles:[],
  }

  static getDerivedStateFromProps(props, state) {
    return {
      myarticles:props.myarticles
    };
  }

  removePost = async (id) =>{
		await deleteArticleApi(id);
		this.props.getMyArticles();
	}

  componentDidMount() {
    this.props.getMyArticles();
  }

  changeOrder = (row) => {
    const { id, banner, title, category, description } = row._original;
    var newOrder = parseInt(window.prompt("Please input order that you want place this article. Leave 0 if you want to place this article at last.", 0), 10);
    if ( /^[0-9.,]+$/.test(newOrder)) {
      this.props.updateArticle(id, { banner, title, category, description, show_order: newOrder });
    } else if (newOrder) {
      this.props.enqueueSnackbar("Please input correct value.", { variant: 'error' })
    }
  }

  render() {
    const { myarticles } = this.state;
    return (
    <div className='animated fadeIn article_app'>
      <Card>
        <CardHeader>
          <i className='cil-newspaper'></i> All Articles
        </CardHeader>
        <CardBody>
					<div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom:"20px"}}>
						<Button color="primary" onClick={e => this.props.history.push('/admin/article/create')}>+ Add</Button>
					</div>
          <ReactTable
            data={myarticles}
            className='-striped -highlight'
            defaultPageSize={10}
            minRows={10}
            filterable
            columns={[
              {
                Header: 'Order',
                width: 60,
                id: 'show_order',
                accessor: 'show_order',
                className: 'v-c h-c',
                Cell: ({ row, value }) => <p style={{cursor: 'pointer', margin: 0, color: '#314d81'}} onClick={e => this.changeOrder(row)}>{value}</p>,
              },
              {
                Header: 'ID',
                width: 60,
                id: 'id',
                accessor: 'id',
                className: 'v-c h-c',
                Cell: ({ row, value }) => <Link to={`/admin/article/${row.id}`}>{value}</Link>, 
              },
              {
                Header: 'Title',
                id: 'Title',
                accessor: 'title',
                className: 'v-c',
                Cell: ({ row, value }) => <Link to={`/admin/article/${row.id}`}>{value}</Link>, 
                filterMethod: (filter, row) => {
                  return row._original.title.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                },
              },
              {
                Header: 'Delete',
								id: 'Delete',
								width: 100,
                className: 'v-c h-c',
                Filter: () => <div />,
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
    myarticles:state.article.my_articles
  }
}

export default withRouter(connect(mapStateToProps, { getMyArticles, updateArticle })(withSnackbar(ArticleManage)));
