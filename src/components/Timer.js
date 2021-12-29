const Timer = (props) => (
  <div className="main-timer">
    <div className="timer" style={props.alarmColor}>
      <div className="timer-wrapper">
        <div id="timer-label">{props.timerType}</div>
        <div id="time-left" className="display">{props.getText()}</div>
      </div>
    </div>
    <div className="timer-control">
      <button id="start_stop" onClick={props.handleTimer}>
        <i className="fa fa-play fa-2x" />
        <i className="fa fa-pause fa-2x" />
      </button>
      <button id="reset" onClick={props.handleReset}>
        <i className="fa fa-refresh fa-2x" />
      </button>
    </div>
  </div>
);

export default Timer;
