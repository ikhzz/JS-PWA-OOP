import {Pages} from './pages.js'

const pages = new Pages,
  links = document.querySelectorAll('.links li a')

pages.loadPages('home')
links.forEach(e => {
  e.addEventListener('click', ()=> {
    const page = e.getAttribute('href').split('#')[1]
    if(page === 'home') {
      pages.loadPages(page)
    } else if (page === 'yourDay') {
      pages.loadPages(page)
    } else if (page == 'history') {
      pages.loadPages(page)
    }
  })
})

document.querySelectorAll('.cancel').forEach(e =>{
  e.addEventListener('click',pages.clear)
})