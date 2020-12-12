let { default: styles } = require('./video.css')


interface IComponent {
  templateContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

interface IOption {
  ele: string | HTMLElement;
  url: string;
  height?: string;
  width?: string;
  autoplay?: boolean;
}


class Video implements IComponent {
  templateContainer;
  constructor(private settings: IOption) {
    this.settings = Object.assign({
      height: '100%',
      width: '100%',
      autoplay: false
    }, settings)

    this.init()
  }
  init() {
    this.template()
    this.handle()
  }
  template() {
    this.templateContainer = document.createElement('div')
    this.templateContainer.className = styles.video
    this.templateContainer.style.width = this.settings.width
    this.templateContainer.style.height = this.settings.height
    this.templateContainer.innerHTML = `
      <video class="${styles['video-content']}" src="${this.settings.url}"></video>
      <div class="${styles['video-controls']}">
        <div class="${styles['video-progress']}">
          <div class="${styles['video-progress-now']}"></div>
          <div class="${styles['video-progress-suc']}"></div>
          <div class="${styles['video-progress-bar']}"></div>
        </div>
        <div class="${styles['video-play']}">
          <i class="iconfont icon-bofang"></i>
        </div>
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styles['video-full']}">
          <i class="iconfont iconfull"></i>          
        </div>
        <div class="${styles['video-volume']}">
          <i class="iconfont iconvolume"></i>
          <div class="${styles['video-volprogress']}">
            <div class="${styles['video-volprogress-now']}"></div>
            <div class="${styles['video-volprogress-bar']}"></div>
          </div>
        </div>
      </div>
    `

    if (typeof this.settings.ele === 'object') {
      this.settings.ele.appendChild(this.templateContainer)
    } else {
      document.querySelector(`.${this.settings.ele}`).appendChild(this.templateContainer)
    }
  }
  handle() {
    let timer;
    let videoContent: HTMLVideoElement = this.templateContainer.querySelector(`.${styles['video-content']}`)
    let videoProgress = this.templateContainer.querySelectorAll(`.${styles['video-progress']} div`)
    let videoTime = this.templateContainer.querySelectorAll(`.${styles['video-time']} span`)
    let videoPlay = this.templateContainer.querySelector(`.${styles['video-play']} i`)
    let videoVolume = this.templateContainer.querySelector(`.${styles['video-volprogress']} div`)
    if (this.settings.autoplay) {
      timer = setInterval(playing, 1000)
      videoContent.play()
    }

    videoContent.addEventListener('canplay', () => {
      videoTime[1].innerHTML = formatTime(videoContent.duration)
    })
    videoContent.addEventListener('play', () => {
      videoPlay.className = 'iconfont iconzanting';
      timer = setInterval(playing, 1000)
    });
    videoContent.addEventListener('ended', (event) => {
      clearInterval(timer)
    })
    videoContent.addEventListener('pause', () => {
      videoPlay.className = 'iconfont icon-bofang';
    });
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play()
      }
      else {
        videoContent.pause()
      }
    })
    videoProgress[2].addEventListener('mousedown', function (e: MouseEvent) {
      let downX = e.pageX // 按下点的x坐标
      let downL = this.offsetLeft // 到当前有定位的父元素节点的左偏移
      
      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        scale < 0 && (scale = 0);
        scale > 1 && (scale = 1);

        videoProgress[0].style.width = scale * 100 + '%'
        videoProgress[1].style.width = scale * 100 + '%'
        this.style.left = scale * 100 + '%'
        console.log(videoContent.currentTime)
        videoContent.currentTime = scale * videoContent.duration
        console.log(videoContent.currentTime)
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
        videoContent.paused && videoContent.play()
      }
      e.preventDefault()
    })

    function playing() {
      let scale = videoContent.currentTime / videoContent.duration
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
      videoProgress[0].style.width = scale * 100 + '%';
      videoProgress[1].style.width = scaleSuc * 100 + '%';
      videoProgress[2].style.left = scale * 100 + '%';
      videoTime[0].innerHTML = formatTime(videoContent.currentTime)
    }

    function formatTime(number: number): string {
      number = Math.round(number);
      let min = Math.floor(number / 60);
      let sec = Math.floor(number % 60);
      return setZero(min) + ':' + setZero(sec);
    }
    function setZero(number: number): string {
      if (number < 10) {
        return '0' + number;
      }
      return '' + number;
    }
  }
}
function video(option: IOption) {
  return new Video(option)
}


export default video