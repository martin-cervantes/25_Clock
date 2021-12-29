const Controls = (props) => (
  <div className="length-control">
    <div id={props.titleID}>{props.title}</div>

    <div className="controls">
      <button
        id={props.decID}
        onClick={props.onClick}
        value="-"
      >
        <i className="fa fa-minus fa-2x" />
      </button>

      <div className="display" id={props.lengthID}>
        {props.length}
      </div>

      <button
        id={props.incID}
        onClick={props.onClick}
        value="+"
      >
        <i className="fa fa-plus fa-2x" />
      </button>
    </div>
  </div>
);

export default Controls;
