class IndexedDB {
  _db_name = 'iNotes';
  _db_version = 1;
  _db_tOne = 'profile';
  
  constructor() {
    this.startDB()
    this.loadProfile()
    this.loadDesc()
  }

  startDB = () => {
    if(window.indexedDB) {
      const open = indexedDB.open(this._db_name, this._db_version)
      open.onupgradeneeded = e => {
        e.target.result.createObjectStore(this._db_tOne, {keyPath : 'id', unique : true});
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
                e.target.result.forEach(e => {
                  if(e.id != 'profPic'){
                    desc.innerHTML += `
                    <p>${e.id} : ${e.desc}`
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
}

class Pages extends IndexedDB {
  loadPages = (page) => {
    fetch(page)
      .then(res => res.text())
      .then(res => {
          document.querySelector('.content').innerHTML = res
    })
  }

  upToggle = () => {
    document.querySelectorAll('.option>div').forEach(e => {
      if(e.classList.contains('uploads'))
        e.classList.toggle('uploads')
    })
    setTimeout(()=>{
      document.querySelector('.prevProfile').setAttribute('src','')
      document.querySelector('.inputPic').value = '';
      document.querySelectorAll('.addDesc input').forEach(e => e.value = '')
    }, 1000)
    
  }

  prev = () => {
    const file = document.querySelector('.inputPic').files[0],
          filetype = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/gif'],
          reader = new FileReader;
    if(file !== undefined) 
      if(filetype.includes(file.type)) {
              reader.readAsDataURL(file)
              reader.onload = e => {
                document.querySelector('.prevProfile').setAttribute('src', e.target.result)
              }
      } else {
        document.querySelector('.inputPic').value = ''
        document.querySelector('.prevProfile').setAttribute('src','')
      }
  }
}

export {IndexedDB, Pages}