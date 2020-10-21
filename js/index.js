import {IndexedDB, Pages} from './indexedDb.js';
const indexedDB = new IndexedDB();
const pages = new Pages();

document.querySelectorAll('.cancel').forEach(e => {
  e.addEventListener('click', pages.upToggle)
})

document.querySelector('.fp').addEventListener('click', ()=> {
    document.querySelector('.upload').classList.toggle('uploads') 
    
    document.querySelector('#style').addEventListener('change', (e)=> {
      document.querySelector('.prevProfile').style.borderRadius = e.target.value
    })
})

document.querySelector('.confirmProfile').addEventListener('click', indexedDB.addProfilepic)

document.querySelector('.addProfile').addEventListener('click', ()=> {
  document.querySelector('.addDesc').classList.toggle('uploads')
})

document.querySelector('.inputPic').addEventListener('change', pages.prev)





