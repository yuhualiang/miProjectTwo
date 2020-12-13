let styles = require('./popup.css')
styles = styles.default

interface Icomponent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

interface Ipopup {
  width?: string;
  height?: string;
  title?: string;
  pos?: string;
  mask?: boolean;
  content?: (content: HTMLElement) => void
}

function popup(options: Ipopup) {
  return new Popup(options)
}

class Popup implements Icomponent {
  tempContainer;
  private settings;
  mask;
  private isDraging: boolean = false;
  private initX: number = 0;
  private initY: number = 0;
  private initOffsetTop = 0;
  private initOffsetLeft = 0;
  constructor(settings: Ipopup) {
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      pos: 'center',
      mask: true,
      content: function () { }
    }, settings)
    this.init()
  }
  // 初始化
  init() {
    this.template();
    this.settings.mask && this.createMask();
    this.contentCallback();
    this.handle();
  }
  // 创建模板
  template() {
    this.tempContainer = document.createElement('div');
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.className = styles.popup;
    this.tempContainer.innerHTML = `
      <div class="${styles['popup-title']}">
        <h3>${this.settings.title}</h3>
        <i class="iconfont iconclose"></i>
      </div>
      <div class="${styles['popup-content']}"></div>
    `
    document.body.appendChild(this.tempContainer)
    switch (this.settings.pos) {
      case 'left':
        this.tempContainer.style.left = 0;
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px'
        break;
      case 'right':
        this.tempContainer.style.right = 0;
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
        break;
      default:
        this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px';
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px';
        break;
    }
  }
  handle() {
    let _this = this
    let popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} i`);
    let popupTitle = this.tempContainer.querySelector(`.${styles['popup-title']}`);

    popupClose.addEventListener('click', () => {
      document.body.removeChild(this.tempContainer);
      this.settings.mask && document.body.removeChild(this.mask);
    })

    popupTitle.addEventListener('mousedown', function (e: MouseEvent) {
      this.style.cursor = 'move'
      let downX = e.pageX // 鼠标按下时在页面上的x坐标
      let downY = e.pageY // 鼠标按下时在页面上的y坐标

      let downL = this.parentNode.offsetLeft
      let downT = this.parentNode.offsetTop
      document.onmousemove = (ev: MouseEvent) => {
        let pageX = ev.pageX
        let pageY = ev.pageY
        let viewHeight = getViewHeight()
        let viewWidth = getViewWidth()
        let left = pageX - downX + downL
        let top = pageY - downY + downT
        pageX <= 0 && (left = 0)
        console.log('viewWidth: ' + viewWidth + '---' + 'pageX: ' + pageX)
        pageX + 5 >= viewWidth && (left = viewWidth - _this.tempContainer.offsetWidth)
        pageY <= 0 && (top = 0)
        pageY + 5 >= viewHeight && (top = viewHeight - _this.tempContainer.offsetHeight)
        _this.tempContainer.style.left = left + 'px'
        _this.tempContainer.style.top = top + 'px'
      }
      document.onmouseup = () => {
        popupTitle.style.cursor = 'default'
        document.onmousemove = document.onmouseup = null
      }
      e.preventDefault()
    })

    /**
     * 得到浏览器显示的屏幕高度
     */
    function getViewHeight() {
      if (window.innerHeight != window.undefined)
        return window.innerHeight;
      if (document.compatMode == 'CSS1Compat')
        return document.documentElement.clientHeight;
      if (document.body)
        return document.body.clientHeight;
      return window.undefined;
    }
    /**
     * 得到浏览器显示的屏幕宽度
     */
    function getViewWidth() {
      if (window.innerWidth != window.undefined)
        return window.innerWidth;
      if (document.compatMode == 'CSS1Compat')
        return document.documentElement.clientWidth;
      if (document.body)
        return document.body.clientWidth;
    }
  }
  createMask() {
    this.mask = document.createElement('div');
    this.mask.className = styles.mask;
    document.body.appendChild(this.mask);
  }
  contentCallback() {
    let popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`);
    this.settings.content(popupContent)
  }
}

export default popup