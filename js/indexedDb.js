class IndexedDB {
  _db_name = 'iNotes';
  _db_version = 1;
  _db_tOne = 'profile';
  _reader = new FileReader();

  constructor() {
    this.startDB()
    this.loadProfile()
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
    const open = indexedDB.open(this._db_name, this._db_version)
      open.onsuccess = () =>{
        const db = open.result,
              tx = db.transaction(this._db_tOne, 'readonly'),
              store = tx.objectStore(this._db_tOne),
              request = store.get('profPic')
        request.onsuccess = e => {
          this._reader.readAsDataURL(e.target.result.profile)
          this._reader.onload = e => {
            document.querySelector('.fp').setAttribute('src', e.target.result)
            
          }
          document.querySelector('.fp').style.borderRadius = e.target.result.style
        }
      }       
  }

  addProfilepic = () => {
    const file = document.querySelector('.inputPic').files[0],
          filetype = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/gif'],
          pages = new Pages

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
    pages.upToggle('upload')
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
    if(document.querySelector('.prevProfile')) {
      document.querySelector('.prevProfile').setAttribute('src','')
      document.querySelector('.inputPic').value = '';
    }
  }

  prev = () => {
    const file = document.querySelector('.inputPic').files[0],
          filetype = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/gif'];

    if(file !== undefined) 
      if(filetype.includes(file.type)) {
        const reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = e => {
                document.querySelector('.prevProfile').setAttribute('src', e.target.result)
              }
      } else {
        console.log('false')
        document.querySelector('.inputPic').value = ''
        document.querySelector('.prevProfile').setAttribute('src','')
      }
  }
}

export {IndexedDB, Pages}