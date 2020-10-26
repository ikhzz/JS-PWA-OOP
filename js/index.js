import {Pages} from './pages.js';
const pages = new Pages;
pages.startDB()
pages.loadPages('home')

let links = document.querySelectorAll('.link li a')

document.querySelector('.nyam').addEventListener('click', () => {
  document.querySelector('aside').classList.toggle('open')
  document.querySelector('main').classList.toggle('openc')
})

links.forEach(e => {
  e.addEventListener('click', ()=> {
    const page = e.getAttribute('href').split('#')[1]
    if(page === 'home') {
      pages.loadPages(page)
    } else if (page === 'yDay') {
      pages.loadPages(page)
    } else if (page == 'status') {
      pages.loadPages(page)
    }
    document.querySelector('aside').classList.toggle('open')
    document.querySelector('main').classList.toggle('openc')
  })
})