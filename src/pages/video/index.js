import React, { Component } from 'react';
import { connect } from 'react-redux';

class VideoPage extends Component {
	state = {
		video_src:""
	}

	componentDidMount() {
		const searchString = this.props.location.search;
		if (searchString.length > 0 && searchString.split('=').length === 2) {
			const fileName = searchString.split('=')[1];
			this.setState({
				video_src: `${process.env.REACT_APP_S3_BUCKET_URL || ''}/${fileName}`
			})
		}
	}
	
  render() {
		const { video_src } = this.state;
    return (
      <div className="video">
        {video_src.length > 0 && <video  autoPlay controls style={{width:"100%",height:"100vh"}}>
          <source src={video_src}></source>
        </video>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
	}
}

export default connect(mapStateToProps, {})(VideoPage);

