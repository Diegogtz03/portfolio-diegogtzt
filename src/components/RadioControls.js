import { Component } from 'react';
import styles from '../styles/RadioControls.module.css';
import ReactHowler from 'react-howler';
import raf from 'raf';
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

// Song count is the number of songs in the music folder (1 -> SONG_COUNT) inclusive
const SONG_COUNT = 21

// Volume of the music when it is not focused on
const AMBIENT_VOLUME = 0.5

class RadioControls extends Component {
  // Constructor for the RadioControls component
  constructor(props) {
    super(props);

    // History is used to keep track of the songs that have been played
    this.history = [];
    this.src = this.getRandomSong();

    this.state = {
      playing: false,
      loop: false,
      mute: false,
      seek: 0.0,
      volume: AMBIENT_VOLUME
    }

    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.seekPos = this.seekPos.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleUnmute = this.handleUnmute.bind(this);
  }
  
  handlePlay() {
    this.setState({
      playing: true
    })

    this.seekPos();
  }

  handlePause() {
    this.setState({
      playing: false
    })

    this.seekPos()
  }

  handleNext() {
    this.setState({
      playing: false
    })

    this.src = this.getRandomSong();

    this.setState({
      playing: true
    })
  }

  handlePrevious() {
    this.setState({
      playing: false
    })
    
    if (this.history.length <= 1) {
      this.src = this.getRandomSong();
    } else {
      this.src = '/media/sounds/music/' + this.history.at(this.history.length - 2) + '.mp3';
      this.history.pop();
    }

    this.setState({
      playing: true
    })
  }

  handleMute() {
    this.setState({
      mute: true
    })
  }

  handleUnmute() {
    this.setState({
      mute: false
    })
  }

  seekPos() {
    if (this.state.playing) {
      this._raf = raf(this.seekPos)
    }
  }

  // Gets a random song from the music folder accounting for the history
  getRandomSong() {
    // If the history is full, reset it
    if (this.history.length === SONG_COUNT) {
      this.history = []
    }

    let songFound = false
    let randomInt = 0

    // Keep generating random numbers until one is found that is not in the history
    while (!songFound) {
      randomInt = Math.floor(Math.random() * SONG_COUNT) + 1
      if (!this.history.includes(randomInt)) {
        songFound = true
        this.history.push(randomInt)
      }
    }

    // Return the path to the song
    const fileName = randomInt.toString() + '.mp3'
    return '/media/sounds/music/' + fileName
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <ReactHowler 
          src={this.src}
          playing={this.state.playing}
          loop={this.state.loop}
          mute={this.state.mute}
          onEnd={this.handleNext}
          onPlay={this.handlePlay}
          volume={this.state.volume}
          ref={(ref) => (this.player = ref)}
        />
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={this.handlePrevious}><FaBackward /></button>
          {this.state.playing ?
            <button className={styles.button} onClick={this.handlePause}><FaPause /></button>
            :
            <button className={styles.button} onClick={this.handlePlay}><FaPlay /></button>
          }
          <button className={styles.button} onClick={this.handleNext}><FaForward /></button>

          {this.state.mute ?
            <button className={styles.button} onClick={this.handleUnmute}><FaVolumeMute /></button>
            :
            <button className={styles.button} onClick={this.handleMute}><FaVolumeUp /></button>
          }
        </div>
      </div>
    )
  }
}

export default RadioControls;