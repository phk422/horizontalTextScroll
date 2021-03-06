class HorizontalTextScroll extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollInner = React.createRef();
    this.scrollWrap = React.createRef();
    this.state = {
      wrapWidth: 0,
      innerWidth: 0,
      retry: 0,
      tim: Math.floor(Math.random() * (99999 - 10000) + 10000),
    };
  }

  componentDidMount() {
    this.getWrapWidth();
  }

  wrapStyle() {
    const s = this.state.wrapWidth / (30 + this.props.speed * 5);
    const animationStr = `move${this.state.tim} ${s}s linear infinite`;
    return {
      animation: animationStr,
      webkitAnimation: animationStr,
    };
  }

  getWrapWidth() {
    if (this.scrollWrap.clientWidth && this.state.retry < 3) {
      this.setState(
        {
          retry: this.state.retry + 1,
          wrapWidth: this.scrollWrap.clientWidth,
          innerWidth: this.scrollInner.clientWidth,
        },
        () => {
          this.getWrapWidth();
        }
      );
      return;
    } else if (!this.scrollWrap.clientWidth && this.state.retry === 3) {
      console.error("获取元素高度失败或高度为0");
      return;
    }
    this.createStyle();
  }
  createStyle() {
    const style = `
                @keyframes move${this.state.tim} {
                from {margin-left: 0;}
                to {margin-left: -${this.state.wrapWidth}px;}
                }
            `;
    const el = document.createElement("style");
    el.innerHTML = style;
    document.head.appendChild(el);
  }

  render() {
    const { txtStyle, txtClassName } = this.props;
    const { isScroll = true } = this.props;
    const { width = "auto" } = txtStyle;
    // 滚动时去除width
    if (isScroll) {
      delete txtStyle.width;
    }
    const scrollContent = (
      <ul className="scroll">
        {this.props.arrTxt.map((item) => (
          <li key={item} className={txtClassName} style={txtStyle}>
            {item}
          </li>
        ))}
      </ul>
    );
    return (
      <div
        className="scroll-inner"
        style={{ width }}
        ref={(c) => (this.scrollInner = c)}
      >
        <div
          className="scroll-wrap"
          ref={(c) => (this.scrollWrap = c)}
          style={isScroll ? this.wrapStyle() : {}}
        >
          {scrollContent}
        </div>
        <div className="scroll-wrap">{scrollContent}</div>
      </div>
    );
  }
}
