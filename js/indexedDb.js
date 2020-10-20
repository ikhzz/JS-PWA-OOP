class IndexedDB {
  constructor() {
    this.db_name = 'iNotes';
    this.db_version = 1;
    this.db_tOne = 'profile'
    this.startDB()
    this.loadProfile(document.querySelector('.prev'))
  }

  startDB = () => {
    if(window.indexedDB) {
      const open = indexedDB.open(this.db_name, this.db_version);
      open.onupgradeneeded = e => {
        e.target.result.createObjectStore(this.db_table, {keyPath : 'id'});
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

  loadProfile = (imgTarget) => {
    const open = indexedDB.open(this.db_name, this.db_version)
      open.onsuccess = () =>{
        const db = open.result,
              tx = db.transaction(this.db_tOne, 'readonly'),
              store = tx.objectStore(this.db_tOne),
              request = store.get(1)
        request.onsuccess = e => {
          const reader = new FileReader()
          reader.readAsDataURL(e.target.result.profile)
          reader.onload = e => {
            imgTarget.setAttribute('src', e.target.result)
          }
        }
      }       
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
}
export {IndexedDB, Pages}