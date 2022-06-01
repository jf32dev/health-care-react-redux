import React, { Component } from 'react';
import { connect } from 'react-redux';
import './videoplayer.scss';
import playBtn from '../../resources/images/music-player-play.png';

class VideoPlayer extends Component {
	state = {
    playing: false,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex && this.props.originIndex !== this.props.activeIndex) {
      this.videoPlayer.pause();
      this.setState({
        playing: false
      })
    }
  }

  playVideo = (e) => {
    this.videoPlayer.play();
  }

  render() {
    const { playing } = this.state;
    const { info } = this.props;
    return (
      <div className="video-player">
        <div className="player-area">
            {!playing && <img className="play-btn" onClick={e => this.playVideo(e)} src={playBtn} alt="play-btn"/>}
            {!playing && <p className="video-title">{info.title}</p>}
            <video width="100%" height="100%" preload="metadata" ref={c => this.videoPlayer = c} controls={playing} onPlay={e => this.setState({playing: true})} onEnded={e => this.setState({playing: false})}>
              <source src={`${info.video}#t=1`} type="video/mp4" />
            </video>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
	}
}

export default connect(mapStateToProps, {})(VideoPlayer);
