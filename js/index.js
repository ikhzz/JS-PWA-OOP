import {IndexedDB, Pages} from './indexedDb.js';
new IndexedDB();

document.querySelector('.prev').addEventListener('click', ()=> {
    document.querySelector('.upload').classList.toggle('uploads')
})

// const write = () => {
//     console.log('hi')
//   const open = indexedDB.open(db_name, db_version)
//     open.onsuccess = () =>{
//       const db = open.result,
//       tx = db.transaction(db_table, 'readwrite'),
//       request = tx.objectStore(db_table),
//       image = prev(),
//       data = {id : 1, profile: image}
//     request.autoIncrement
//     request.put(data)
//     }       
// }

const write = () => {
  const image = prev()
  if(image === null) {
    console.log('null')
  } else {
    console.log('not null')
  }
  //console.log(image)
  //console.log(image.type)
  document.querySelector('.input').value = ''
  document.querySelector('.upload').classList.toggle('uploads')

}
 const input = document.querySelector('.input'),
       btnwrite = document.querySelector('.write')

btnwrite.addEventListener('click', write)
// console.log(input)

// input.addEventListener('change', (e)=> {
//   const file = document.querySelector('.input').files[0];
  
//   document.querySelector('.input').value = ''
// })
function prev() {
  const file = document.querySelector('.input').files[0];
  const filetype = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/gif'];

  if(file !== undefined)
    if(filetype.includes(file.type)) {
      return file
    } else {
      console.log('false')
      document.querySelector('.input').value = ''
      return null
  } else {
      return null
  }
}
window.prev = prev
