import './main.css'
import popup from './components/popup/popup'
import video from './components/video/video'

let ele: HTMLElement = document.querySelector('#videoWrapper')
video({
  url: ele.dataset.url,
  ele: ele,
  autoplay: true,
  poster: ele.dataset.poster
})