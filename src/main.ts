import './main.css'
import popup from './components/popup/popup'
import video from './components/video/video'

let liNodes = document.querySelectorAll('#list li')

console.log(liNodes)
liNodes.forEach((liNode: HTMLElement, key) => {
  liNode.addEventListener('click', function () {
    let url = this.dataset.url
    let title = this.dataset.title
    popup({
      title,
      width: '800px',
      height: '580px',
      content: (ele) => {
        video({
          ele,
          url,
          autoplay: true
        })
      }
    })
  })
})