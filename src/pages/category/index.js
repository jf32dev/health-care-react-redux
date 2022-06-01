import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import ReactTable from 'react-table';
import { getCategories } from '../../redux/actions';
import { updateCategory as updateCategoryApi } from '../../api';
import { withSnackbar } from 'notistack';
import { ChromePicker } from 'react-color'

class CategoryManage extends Component {
  state = {
    categories:[],
    id: 0,
    title: '',
    color: '',
    showColorPicker: false
  }

  static getDerivedStateFromProps(props, state) {
    return {
      categories:props.categories
    };
  }

  componentDidMount() {
    this.props.getCategories();
  }

  addCategory = async () => {
    const { id, title, color } = this.state;
    if (title.length === 0 || color.length === 0) {
      this.props.enqueueSnackbar("Please fill in all fields.", { variant: 'error' })
      return;
    }
    try {
			const result = await updateCategoryApi(id, { title, color })
			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem adding category. Please try again later.', { variant: 'error' })
				}
			} else {
        this.props.getCategories();
        this.props.enqueueSnackbar('Success', { variant: 'success' });
        this.setState({
          id: 0,
          title: '',
          color: ''
        })
			}
		} catch(e) {
			this.props.enqueueSnackbar('There was a problem adding category. Please try again later.', { variant: 'error' })
		}
  }

  render() {
    const { id, categories, title, color, showColorPicker } = this.state;
    return (
    <div className='animated fadeIn article_app'>
      <Card>
        <CardHeader>
          <i className='cil-newspaper'></i> All Categories
        </CardHeader>
        <CardBody>
					<div style={{width: '100%', marginBottom:"20px"}} className="v-c">
            <InputGroup style={{maxWidth: '40%'}}>
              <InputGroupAddon addonType='prepend'>
                <InputGroupText> Category: </InputGroupText>
              </InputGroupAddon>
              <Input name="title" className="input100" value={title} onChange={e => this.setState({ title: e.target.value })} />
            </InputGroup>
            <div style={{position: 'relative', margin: '0 15px'}}>
              <InputGroup style={{maxWidth: '170px'}}>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText> Color: </InputGroupText>
                </InputGroupAddon>
                <Input name="color" className="input100" value={color} onFocus={e => this.setState({ showColorPicker: true })} onChange={e => {}}/>
              </InputGroup>
              {showColorPicker && <div style={{position: 'absolute', zIndex: 200, right: 0}}>
                <div style={{position: 'fixed', left: 0, right: 0, top: 0, bottom: 0}} onClick={e => this.setState({ showColorPicker: false })}/>
                <ChromePicker color={color} onChangeComplete={color => this.setState({ color: color.hex})} />
              </div>
              }
            </div>
						<Button color="primary" onClick={this.addCategory}>{id === 0 ? 'Add' : 'Update'}</Button>
            {id > 0 && <Button color="success" onClick={e => this.setState({ id: 0, title: '', color: ''})} style={{marginLeft: '15px'}}>Cancel</Button>}
					</div>
          <ReactTable
            data={categories}
            className='-striped -highlight'
            defaultPageSize={10}
            minRows={10}
            columns={[
              {
                Header: 'Category',
                id: 'title',
                accessor: 'title',
                className: 'v-c h-c',
                Cell: ({ row, value }) => <p style={{margin: 0, cursor: 'pointer'}} onClick={e => this.setState({ id: row._original.id, title: row.title, color: row.color })}>{value}</p>
              },
              {
                Header: 'Color',
                id: 'color',
                accessor: 'color',
                className: 'v-c h-c',
                Cell: ({ row, value }) => <p style={{margin: 0, cursor: 'pointer'}} onClick={e => this.setState({ id: row._original.id, title: row.title, color: row.color })}>{value}</p>
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
    categories:state.category.categories
  }
}

export default withRouter(connect(mapStateToProps, { getCategories })(withSnackbar(CategoryManage)));
