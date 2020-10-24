import {IndexedDB, Pages} from './indexedDb.js';
// //const indexedDB = new IndexedDB;
const pages = new Pages;

document.querySelector('.mood').addEventListener('click', ()=> {
  document.querySelector('.addMood').classList.toggle('uploads')
})
document.querySelector('.thought').addEventListener('click', ()=> {
  document.querySelector('.addThought').classList.toggle('uploads')
})
document.querySelectorAll('.moods').forEach(e => {
  e.addEventListener('click', ()=> {
    pages.addPosts('mood', e.innerHTML, e.getAttribute('value'))
    //console.log(e.getAttribute('value'))
    //console.log(e.innerHTML)
    // time, date

  })
})
document.querySelector('.confirmThought').addEventListener('click', () => {
  const a = document.querySelector('.thoughts')
  console.log(a.value)
  console.log(a)
  pages.addPosts('thought', a.value, '0')
})

pages.loadPosts()















// burger
document.querySelector('.nyam').addEventListener('click', () => {
  document.querySelector('aside').classList.toggle('open')
  document.querySelector('main').classList.toggle('openc')
})

const a = new Date
const b = [23,10,2020];
const c = new Date(a.getFullYear(),a.getMonth(),a.getDate())
function epoch(d) {
  return Math.floor(d/1000)
}
const g = new Date(2020,10,23)
const h = new Date(2020,9,23)
const i = epoch(g)
const j = epoch(h)
const k = epoch(c)
const l = a.getTime()
console.log(k)
console.log(typeof(k))
console.log(k == j)
console.log(i)
console.log(j)
console.log(b[0],b[1],b[2])
// clock
const clock = () => {
  const a = new Date,
        mnt = a.getMinutes() < 10 ? '0'+a.getMinutes() : a.getMinutes();
  
  document.querySelector('.hrs').innerHTML = a.getHours()
  document.querySelector('.min').innerHTML = mnt
}
setInterval(clock,1000)




// later

// //indexedDB.startDB()
// //indexedDB.loadProfile()
// //indexedDB.loadDesc()
document.querySelectorAll('.cancel').forEach(e => {
  e.addEventListener('click', pages.upToggle)
})

// document.querySelector('.fp').addEventListener('click', ()=> {
//     document.querySelector('.upload').classList.toggle('uploads') 
    
//     document.querySelector('#style').addEventListener('change', (e)=> {
//       document.querySelector('.prevProfile').style.borderRadius = e.target.value
//     })
// })

// document.querySelector('.confirmProfile').addEventListener('click', pages.addProfilepic)

// document.querySelector('.addProfile').addEventListener('click', ()=> {
//   document.querySelector('.addDesc').classList.toggle('uploads')
// })

// document.querySelector('.inputPic').addEventListener('change', pages.prev)

// document.querySelector('.confirmDesc').addEventListener('click', ()=> {
//   pages.addDesc()
// })