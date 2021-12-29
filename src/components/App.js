import React from 'react';
import Timer from './Timer';
import Controls from './Controls';

import accurateInterval from '../logic';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      timerState: 'stopped',
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
      alarmColor: { color: 'white' }
    };
    this.setBreak = this.setBreak.bind(this);
    this.setSession = this.setSession.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.getText = this.getText.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  setBreak(e) {
    this.lengthControl(
      'break',
      e.currentTarget.value,
      this.state.break,
      'Session'
    );
  }

  setSession(e) {
    this.lengthControl(
      'session',
      e.currentTarget.value,
      this.state.session,
      'Break'
    );
  }

  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === 'running') {
      return;
    }

    if (this.state.timerType === timerType) {
      if (sign === '-' && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === '+' && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else if (sign === '-' && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60
      });
    } else if (sign === '+' && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60
      });
    }
  }

  handleTimer() {
    if (this.state.timerState === 'stopped') {
      this.beginCountDown();
      this.setState({ timerState: 'running' });
    } else {
      this.setState({ timerState: 'stopped' });

      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
    }
  }

  beginCountDown() {
    this.setState({
      intervalID: accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000)
    });
  }

  decrementTimer() {
    this.setState({ timer: this.state.timer - 1 });
  }

  phaseControl() {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);

    if (timer < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }

      if (this.state.timerType === 'Session') {
        this.beginCountDown();
        this.switchTimer(this.state.break * 60, 'Break');
      } else {
        this.beginCountDown();
        this.switchTimer(this.state.session * 60, 'Session');
      }
    }
  }

  warning(_timer) {
    if (_timer < 61) {
      this.setState({ alarmColor: { color: '#a50d0d' } });
    } else {
      this.setState({ alarmColor: { color: 'white' } });
    }
  }

  buzzer(_timer) {
    if (_timer === 0) {
      this.audioBeep.play();
    }
  }

  switchTimer(num, str) {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: { color: 'white' }
    });
  }

  getText() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return minutes + ':' + seconds;
  }

  handleReset() {
    this.setState({
      break: 5,
      session: 25,
      timerState: 'stopped',
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
      alarmColor: { color: 'white' }
    });

    if (this.state.intervalID) {
      this.state.intervalID.cancel();
    }

    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render() {
    return (
      <div className="main-container">
        <div className="main-title">25 + 5 Clock</div>
        <div className="main-controls">
          <Controls
            incID="break-increment"
            length={this.state.break}
            lengthID="break-length"
            decID="break-decrement"
            onClick={this.setBreak}
            title="Break Length"
            titleID="break-label"
          />

          <Controls
            incID="session-increment"
            length={this.state.session}
            lengthID="session-length"
            decID="session-decrement"
            onClick={this.setSession}
            title="Session Length"
            titleID="session-label"
          />
        </div>

        <Timer
          alarmColor={this.state.alarmColor}
          timerType={this.state.timerType}
          getText={this.getText}
          handleTimer={this.handleTimer}
          handleReset={this.handleReset}
        />

        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

export default App;
