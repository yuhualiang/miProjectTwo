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
    this.dragPopup();
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
        <i class="iconfont iconguanbi"></i>
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
    let popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} i`);
    popupClose.addEventListener('click', () => {
      document.body.removeChild(this.tempContainer);
      this.settings.mask && document.body.removeChild(this.mask);
    })
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
  dragPopup() {
    let popupTitle = this.tempContainer.querySelector(`.${styles['popup-title']}`);
    let _this = this
    popupTitle.addEventListener('mousedown', function (e) {
      e.stopPropagation();
      this.style.cursor = 'move'
      _this.isDraging = true
      _this.initX = e.clientX
      _this.initY = e.clientY
      _this.initOffsetLeft = _this.tempContainer.offsetLeft
      _this.initOffsetTop = _this.tempContainer.offsetTop
    })
    popupTitle.addEventListener('mouseout', function () {
      _this.isDraging = false
      this.style.cursor = 'default'
    })
    popupTitle.addEventListener('mouseup', function () {
      _this.isDraging = false
      this.style.cursor = 'default'
    })

    window.document.addEventListener('mousemove', (e) => {
      if (this.isDraging) {
        let currX = e.clientX;
        let currY = e.clientY;
        let diffX = currX - this.initX
        let diffY = currY - this.initY

        this.tempContainer.style.left = this.initOffsetLeft + diffX + 'px';
        this.tempContainer.style.top = this.initOffsetTop + diffY + 'px';
      }

    })
  }

}

export default popup