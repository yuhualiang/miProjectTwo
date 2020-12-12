import { clear } from "console";

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
      <div class="${styles['video-content-play']}">
      <i class="iconfont iconplay"></i>
      </div>
      <div class="${styles['video-controls']}">
        <div class="${styles['video-progress']}">
          <div class="${styles['video-progress-now']}"></div>
          <div class="${styles['video-progress-suc']}"></div>
          <div class="${styles['video-progress-bar']}"></div>
          <div class="${styles['video-progress-track']}"></div>
        </div>
        <div class="${styles['video-play']}">
          <i class="iconfont icon-iconplay"></i>
        </div>
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styles['video-full']}">
          <i class="iconfont iconfullscreen"></i>          
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
    let videoControls: HTMLElement = this.templateContainer.querySelector(`.${styles['video-controls']}`)
    let videoProgress = this.templateContainer.querySelectorAll(`.${styles['video-progress']} div`)
    let videoTime = this.templateContainer.querySelectorAll(`.${styles['video-time']} span`)
    let videoPlay = this.templateContainer.querySelector(`.${styles['video-play']} i`)
    let videoContentPlay = this.templateContainer.querySelector(`.${styles['video-content-play']} i`)
    let videoVolume = this.templateContainer.querySelectorAll(`.${styles['video-volprogress']} div`)
    let videoVolumeIcon: HTMLElement = this.templateContainer.querySelector(`.${styles['video-volume']} i`)
    let videoVolumeScale: number = 0.5;
    videoVolumeIcon.style.cursor = 'pointer'
    let videoFullScreen = this.templateContainer.querySelector(`.${styles['video-full']} i`)
    if (this.settings.autoplay) {
      timer = setInterval(playing, 1000)
      videoContent.play()
      videoContent.volume = videoVolumeScale
    }

    videoContent.addEventListener('canplay', () => {
      videoTime[1].innerHTML = formatTime(videoContent.duration)
    })
    videoContent.addEventListener('play', () => {
      videoPlay.className = 'iconfont iconpause'
      videoContentPlay.parentNode.style.display = 'none'
      timer = setInterval(playing, 1000)
    });
    videoContent.addEventListener('ended', (event) => {
      videoContentPlay.parentNode.style.display = 'block'
      clearInterval(timer)
    })
    videoContent.addEventListener('pause', () => {
      videoPlay.className = 'iconfont iconplay'
      videoContentPlay.parentNode.style.display = 'block'
      clearInterval(timer)
    });
    videoPlay.addEventListener('click', (e: MouseEvent) => {
      if (videoContent.paused) {
        videoContent.play()
      }
      else {
        videoContent.pause()
      }
      e.preventDefault()
      e.stopPropagation()
    })
    videoContentPlay.addEventListener('click', () => {
      videoPlay.click()
    })
    // 播放进度的控制
    videoProgress[2].addEventListener('mousedown', function (e: MouseEvent) {
      let downX = e.pageX // 按下点的x坐标
      let downL = this.offsetLeft // 到当前有定位的父元素节点的左偏移

      document.onmousemove = (ev: MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        changeVideoProgress(scale)
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      e.preventDefault()
    })
    videoProgress[3].addEventListener('click', function (e: MouseEvent) {
      let scale = e.offsetX / this.parentNode.offsetWidth
      changeVideoProgress(scale)
    })
    // 音量的控制
    videoVolume[1].addEventListener('mousedown', function (e: MouseEvent) {
      let downX = e.pageX // 按下点的x坐标
      let downL = this.offsetLeft + 7 // 到当前有定位的父节点的左偏移
      document.onmousemove = (ev: MouseEvent) => {
        let pageX = ev.pageX
        videoVolumeScale = (pageX - downX + downL) / this.parentNode.offsetWidth
        videoVolumeScale > 1 && (videoVolumeScale = 1)
        if (videoVolumeScale <= 0) {
          videoVolumeScale = 0
          videoVolumeIcon.className = 'iconfont iconmute'
        } else {
          videoVolumeIcon.className = 'iconfont iconvolume'
        }
        this.style.left = videoVolumeScale * 100 + '%'
        videoVolume[0].style.width = videoVolumeScale * 100 + '%'
        videoContent.volume = videoVolumeScale
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      e.preventDefault()
    })
    // 静音操作
    videoVolumeIcon.addEventListener('click', function (e) {
      if (videoContent.volume > 0) {
        videoContent.volume = 0
        this.className = 'iconfont iconmute'
      } else {
        this.className = 'iconfont iconvolume'
        videoContent.volume = videoVolumeScale
      }
      e.preventDefault()
    })
    // 全屏操作
    videoFullScreen.addEventListener('click', function (e: MouseEvent) {
      videoContent.requestFullscreen()
    })
    this.templateContainer.addEventListener('mouseenter', (e: MouseEvent) => {
      videoControls.style.bottom = 0 + 'px'
    })
    this.templateContainer.addEventListener('mouseleave', (e: MouseEvent) => {
      videoControls.style.bottom = -50 + 'px'
    })
    // 点击视频区域改变播放状态
    videoContent.addEventListener('click', (e: MouseEvent) => {
      if (videoContent.paused) {
        videoContent.play()
      } else {
        videoContent.pause()
      }
      e.preventDefault()
      e.stopPropagation()
    })
    function playing() {
      let scale = videoContent.currentTime / videoContent.duration
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
      videoProgress[0].style.width = scale * 100 + '%';
      videoProgress[1].style.width = scaleSuc * 100 + '%';
      videoProgress[2].style.left = scale * 100 + '%';
      videoTime[0].innerHTML = formatTime(videoContent.currentTime)
    }
    function changeVideoProgress(scale) {
      scale < 0 && (scale = 0);
      scale > 1 && (scale = 1);

      videoProgress[0].style.width = scale * 100 + '%'
      videoProgress[1].style.width = scale * 100 + '%'
      videoProgress[2].style.left = scale * 100 + '%'
      videoContent.currentTime = scale * videoContent.duration
      videoContent.paused && videoContent.play()
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