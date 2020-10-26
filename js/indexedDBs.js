import {Pages} from './pages.js'
class IndexedDB {
  _db_name = 'iNotes';
  _db_version = 1;
  _db_tOne = 'profile';
  _db_tTwo = 'posts'
  
  startDB = () => {
    if(window.indexedDB) {
      const open = indexedDB.open(this._db_name, this._db_version)
      open.onupgradeneeded = e => {
        e.target.result.createObjectStore(this._db_tOne, {keyPath : 'id', unique : true});
        e.target.result.createObjectStore(this._db_tTwo, {keyPath : 'id', autoIncrement:true});
      }
      open.onsuccess = e => {
        console.log('INDEXEDDB IS INVOKED!!!!!!');
      }
      open.onerror = e => {
        console.log(e);
      }
    } else {
    console.log('indexedDB is not supported');
    }
  }

  loadProfile = () => {
    const open = indexedDB.open(this._db_name, this._db_version),
          reader = new FileReader;

      open.onsuccess = () =>{
        const db = open.result,
              tx = db.transaction(this._db_tOne, 'readonly'),
              store = tx.objectStore(this._db_tOne),
              request = store.get('profPic')
        request.onsuccess = e => {
          if(e.target.result != undefined) {
            reader.readAsDataURL(e.target.result.profile)
            reader.onload = e => {
              document.querySelector('.fp').setAttribute('src', e.target.result)
            }
            document.querySelector('.fp').style.borderRadius = e.target.result.style
          }
        }
      }       
  }

  loadDesc = () => {
    const open = indexedDB.open(this._db_name, this._db_version),
          desc = document.querySelector('.desc')

      open.onsuccess = () =>{
        const db = open.result,
              tx = db.transaction(this._db_tOne, 'readonly'),
              store = tx.objectStore(this._db_tOne),
              request = store.getAll()
              request.onsuccess = e => {
                window.delDesc = this.delDesc
                e.target.result.forEach(e => {
                  if(e.id != 'profPic'){
                    desc.innerHTML += `
                      <p>${e.id} : ${e.desc}</p><button onclick="delDesc('${e.id}')">Delete</button>
                    `
                  }
                })
              }
      }
  }

  addProfilepic = () => {
    const file = document.querySelector('.inputPic').files[0],
          filetype = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/gif'],
          pages = new Pages;
          

    if(file !== undefined) 
      if(filetype.includes(file.type)) {
        const open = indexedDB.open(this._db_name, this._db_version)
        open.onsuccess = () =>{
          const db = open.result,
                tx = db.transaction(this._db_tOne, 'readwrite'),
                request = tx.objectStore(this._db_tOne),
                style = document.querySelector('#style').value,
                data = {id : 'profPic', profile: file, style : style}
        request.put(data)
        }
      } else {
        console.log('false')
        pages.upToggle()
      }

    this.loadProfile()
    pages.upToggle()
  }

  addDesc = () => {
    const input = document.querySelectorAll('.addDesc input'),
          pages = new Pages

    if(input[0].value.length != 0 && input[0].value != 'profPic'){
      const open = indexedDB.open(this._db_name, this._db_version)
        open.onsuccess = () =>{
          const db = open.result,
                tx = db.transaction(this._db_tOne, 'readwrite'),
                request = tx.objectStore(this._db_tOne),
                data = {id : `${input[0].value}`, desc : `${input[1].value}`}
          request.put(data)
          this.loadDesc()
        }
      console.log('success')
      
    }
    pages.upToggle()
  }
  
  addPosts = (types, moods, values) => {
    const open = indexedDB.open(this._db_name, this._db_version),
          date = new Date,
          dates = [date.getDate(), date.getMonth(), date.getFullYear()],
          mnt = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
          time = [date.getHours(), mnt],
          pages = new Pages
    
    open.onsuccess = () => {
      const db = open.result,
            tx = db.transaction(this._db_tTwo, 'readwrite'),
            request = tx.objectStore(this._db_tTwo),
            data = {type : types, date : dates, time : time, mood : moods, val : values}
      request.add(data)
    }
    this.loadPosts()
    pages.upToggle()
  }
  loadPosts = () => {
    const open = indexedDB.open(this._db_name, this._db_version),
          posts = document.querySelector('.posts'),
          date = new Date,
          today = [date.getDate(), date.getMonth(), date.getFullYear()]
    let   el = 'moods'

    open.onsuccess = () => {
      const db = open.result,
            tx = db.transaction(this._db_tTwo, 'readonly'),
            store = tx.objectStore(this._db_tTwo),
            request = store.getAll()
            request.onsuccess = e => {
              posts.innerHTML = ''
              e.target.result.forEach(e => {
                if(JSON.stringify(today) == JSON.stringify(e.date)) {
                  el = e.type == 'mood' ? 'moods' : 'p';
                  posts.innerHTML += `
                  <li>
                    <h3>&#128336; : ${e.time[0]}:${e.time[1]}</h3>
                    <${el}>${e.mood}</${el}>
                  </li>`;
                }
              })
            }
    }
  }

  loadStats = () => {
    return new Promise (resolve => {
      let i = 0,
          sum = 0
      const open = indexedDB.open(this._db_name, this._db_version),
            tes = (item) => {sum += item}
      
      
      open.onsuccess = () => {
        const db = open.result,
              tx = db.transaction(this._db_tTwo, 'readonly'),
              store = tx.objectStore(this._db_tTwo),
              request = store.getAll()
        request.onsuccess = e => {
          
          e.target.result.forEach(e => {
            if(e.type == 'mood') {
              tes(parseInt(e.val))
              i++
            }
          })
          resolve([i,sum]) 
        }
      }
    })
  }

  loadHistory = () => {
    const open = indexedDB.open(this._db_name, this._db_version),
          posts = document.querySelector('.history'),
          date = new Date,
          today = [date.getDate(), date.getMonth(), date.getFullYear()]
    let   el = 'moods'

    open.onsuccess = () => {
      const db = open.result,
            tx = db.transaction(this._db_tTwo, 'readonly'),
            store = tx.objectStore(this._db_tTwo),
            request = store.getAll()
            request.onsuccess = e => {
              posts.innerHTML = ''
              e.target.result.forEach(e => {

                  el = e.type == 'mood' ? 'moods' : 'p';
                  posts.innerHTML += `
                  <li>
                    <h2>Date : ${e.date[0]}-${e.date[1]}-${e.date[2]}</h2>
                    <h3>&#128336; : ${e.time[0]}:${e.time[1]}</h3>
                    <${el}>${e.mood}</${el}>
                  </li>`;
                
              })
            }
    }
  }

  delDesc = (id) => {
    const open = indexedDB.open(this._db_name, this._db_version)
    open.onsuccess = () => {
      const   db = open.result,
                tx = db.transaction(this._db_tOne, 'readwrite'),
                request = tx.objectStore(this._db_tOne)
      request.delete(id)
    }
  }
}

const init = new IndexedDB
init.startDB()

export {IndexedDB}