import {Pages} from './pages.js'

class IndexedDb{
  // IndexedDB property
  _db_name ='iNotes';
  _db_version = 1;
  _db_tOne = 'profile';
  _db_tTwo = 'posts';

  constructor() {
    this.buildInit();
  }

  // Method init IndexedDB
  buildInit() {
    if(window.indexedDB){
      const open = indexedDB.open(this._db_name, this._db_version);
      open.onupgradeneeded = e => {
        // Build table for profile and input
        e.target.result.createObjectStore(this._db_tOne, {keyPath : 'id', unique : true});
        e.target.result.createObjectStore(this._db_tTwo, {keyPath : 'id', autoIncrement:true});
      }
      open.onsuccess = e => {
        // Overdramatic IndexedDB success message
        console.log('INDEXEDDB IS INVOKED!!!!!!');
      }
      open.onerror = e => {
        console.log(e);
      }
    }
  };

  // Method to check image
   checkImage = () => {
    //  Return promise to check data in IndexedDb
     return new Promise( resolve => {
      const open = indexedDB.open(this._db_name, this._db_version)

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tOne, 'readonly'),
          store = tx.objectStore(this._db_tOne),
          request = store.get('profPic')
          request.onsuccess = e => {
            // Send result in promise
            resolve(e.target.result)
          }
      };
     });
  };

  // Method to check description
  checkDescription = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version)

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tOne, 'readonly'),
          store = tx.objectStore(this._db_tOne),
          request = store.getAll()
        request.onsuccess = e => {
          resolve(e.target.result)
        }
      }
    })
  }

  // Method to upload image to IndexedDB
  addProfileImage = () => {
    const file = document.querySelector('.inputPic').files[0],
      open = indexedDB.open(this._db_name, this._db_version)

    open.onsuccess = () => {
      const db = open.result,
            tx = db.transaction(this._db_tOne, 'readwrite'),
            request = tx.objectStore(this._db_tOne),
            style = document.querySelector('#style').value,
            data = {id : 'profPic', profile: file, style : style}
    request.put(data)
    }
  };

  // Method load image
  loadImage = () => {
    // Open IndexedDB and prepare file reader
    const open = indexedDB.open(this._db_name, this._db_version),
      reader = new FileReader;

    open.onsuccess = () => {
      const db = open.result,
            tx = db.transaction(this._db_tOne, 'readonly'),
            store = tx.objectStore(this._db_tOne),
            request = store.get('profPic')
      request.onsuccess = e => {
        if(e.target.result != undefined) {
          reader.readAsDataURL(e.target.result.profile)
          reader.onload = e => {
            document.querySelector('.profPic img').src = e.target.result;
          }
          document.querySelector('.profPic img').style.borderRadius = e.target.result.style;
        }
      }
    }     
  };

  // Method to add profile description
  addDescription = () => {
    return new Promise((resolve)=> {
      const input = document.querySelectorAll('.addDescription input')

      // Check if input is empty
      if(input[0].value.length > 0 && input[0].value != 'profPic' && input[0].value.length > 0 ){
        const open = indexedDB.open(this._db_name, this._db_version)

        open.onsuccess = () =>{
          const db = open.result,
                tx = db.transaction(this._db_tOne, 'readwrite'),
                request = tx.objectStore(this._db_tOne),
                data = {id : `${input[0].value}`, desc : `${input[1].value}`}
          request.put(data)
          resolve(true);
        }
      } else {
        resolve(false);
      }
    });
  };

  // Method to load profile description
  loadDescription = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version),
      desc = document.querySelector('.desc')
      // Remove default example
      desc.removeChild(desc.childNodes[1])
      desc.removeChild(desc.childNodes[2])

      open.onsuccess = () =>{
        const db = open.result,
          tx = db.transaction(this._db_tOne, 'readonly'),
          store = tx.objectStore(this._db_tOne),
          request = store.getAll()
        request.onsuccess = e => {
          window.deleteDescription = this.deleteDescription
          e.target.result.forEach(e => {
            if(e.id != 'profPic'){
              desc.innerHTML += `
                <li>
                <div class="deleteDesc">
                  <button onclick="deleteDescription('${e.id}')">Delete</button>
                </div>
                <p>${e.id} :</p>
                <h3>${e.desc}</h3>
                </li>
              `}
          })
          resolve(true)
        }
      }
    })
  };

  // Method to delete profile description
  deleteDescription =  (id) => {
    const open = indexedDB.open(this._db_name, this._db_version)

    open.onsuccess = () => {
      const db = open.result,
        tx = db.transaction(this._db_tOne, 'readwrite'),
        request = tx.objectStore(this._db_tOne)

      request.delete(id)
      
    }
    location.reload()
  };

  // Method to post mood
  addPosts = (types, moods, values) => {
    return new Promise(resolve => {
      // Prepare Indexeddb and time
      const open = indexedDB.open(this._db_name, this._db_version),
        date = new Date,
        dates = [date.getDate(), date.getMonth(), date.getFullYear()],
        mnt = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
        time = [date.getHours(), mnt]
    
      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tTwo, 'readwrite'),
          request = tx.objectStore(this._db_tTwo),
          data = {type : types, date : dates, time : time, mood : moods, val : values}

        request.add(data)
        resolve(true)
      }
    })
  }

  // Method load posts today
  loadPosts = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version),
        dates = new Date,
        today = [dates.getDate(), dates.getMonth(), dates.getFullYear()]
      let el = 'mood';

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tTwo, 'readonly'),
          store = tx.objectStore(this._db_tTwo),
          request = store.getAll()

        request.onsuccess = e => {
          const posts = document.querySelector('.moodAndThought')
          posts.innerHTML = ''
          e.target.result.forEach(e => {
            // Check if date of data is today
            if(JSON.stringify(today) == JSON.stringify(e.date)) {
              el = e.type == 'mood' ? 'mood' : 'h3';
              window.deletePosts = this.deletePosts;
              posts.innerHTML += `
              <li>
                <div class="deleteDesc">
                  <button onclick="deletePosts(${e.id})">Delete</button>
                </div>
                <p>Today, Time: ${e.time[0]}:${e.time[1]}</p>
                <${el}>${e.mood}</${el}>
              </li>`;
            }
          })
          resolve(true)
        }
      }
    })
  };

  // Method check posts today
  checkPosts = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version),
        dates = new Date,
        today = [dates.getDate(), dates.getMonth(), dates.getFullYear()]
      let value = 0;

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tTwo, 'readonly'),
          store = tx.objectStore(this._db_tTwo),
          request = store.getAll()

        request.onsuccess = e => {
          e.target.result.forEach(e => {
            // Check posts today and send the value
            if(JSON.stringify(today) == JSON.stringify(e.date)) {
              value++
            }
          })
          resolve(value)
        }
      }
    })
  };

  // Method delete posts
  deletePosts = (id) =>{
    const open = indexedDB.open(this._db_name, this._db_version)

    open.onsuccess = () => {
      const db = open.result,
        tx = db.transaction(this._db_tTwo, 'readwrite'),
        request = tx.objectStore(this._db_tTwo)

      request.delete(id)
      
    }
    location.reload()
  }

  // Method to check all post and return the value
  checkAllPosts = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version),
        dates = new Date
      let value = 0;

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tTwo, 'readonly'),
          store = tx.objectStore(this._db_tTwo),
          request = store.getAll()

        request.onsuccess = e => {
          // check all posts and send the length
          e.target.result.forEach(() => value++) 
          resolve(value)
        } 
      }      
    })
  };

  // Method to check all description and return the value
  checkAllDescription = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version),
        dates = new Date
      let value = 0;

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tOne, 'readonly'),
          store = tx.objectStore(this._db_tOne),
          request = store.getAll()

        request.onsuccess = e => {
          e.target.result.forEach(e => {
            // Check description is not profile picture then send the value
            if(e.id != 'profPic'){
              value ++
            }
          })
          resolve(value)
        }
      }      
    });
  };

  // Method to delete all description
  deleteAllPosts = () => {
    const open = indexedDB.open(this._db_name, this._db_version)

    open.onsuccess = () => {
      const db = open.result,
        tx = db.transaction(this._db_tTwo, 'readwrite'),
        request = tx.objectStore(this._db_tTwo)

      request.clear()
      
    }
    location.reload()
  }

  // Method to delete description
  deleteAllDescription = async () => {
    let list = await this.getDescription().then(r => r);
    const open = indexedDB.open(this._db_name, this._db_version)

    open.onsuccess = () => {
      const db = open.result,
        tx = db.transaction(this._db_tOne, 'readwrite'),
        request = tx.objectStore(this._db_tOne)
      // repeat delete method as the list length
      list.forEach(e => {
        console.log(e)
        request.delete(e)
      }) 
    }
    location.reload()
  }

  // Method Check all description
  getDescription = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version)
      let list = [];

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tOne, 'readwrite'),
          store = tx.objectStore(this._db_tOne),
          request = store.getAll()
        request.onsuccess = e => {
          e.target.result.forEach( e => {
            // Check if description is not profile picture
            if(e.id != 'profPic'){
              list.push(e.id)
            }
          })
          resolve(list)
        }
      }
    });
  };

  // Method to load history
  loadAllPosts = () => {
    return new Promise(resolve => {
      const open = indexedDB.open(this._db_name, this._db_version),
        dates = new Date,
        today = [dates.getDate(), dates.getMonth(), dates.getFullYear()]
      let el = 'mood';

      open.onsuccess = () => {
        const db = open.result,
          tx = db.transaction(this._db_tTwo, 'readonly'),
          store = tx.objectStore(this._db_tTwo),
          request = store.getAll()

        request.onsuccess = e => {
          const posts = document.querySelector('.listHistory')
          posts.innerHTML = ''
          e.target.result.forEach(e => {
              el = e.type == 'mood' ? 'mood' : 'h3';
              window.deletePosts = this.deletePosts;
              posts.innerHTML += `
              <li>
                <div class="deleteDesc">
                  <button onclick="deletePosts(${e.id})">Delete</button>
                </div>
                <p>Date: ${e.date[0]}-${e.date[1]}-${e.date[2]}, Time: ${e.time[0]}:${e.time[1]}</p>
                <${el}>${e.mood}</${el}>
              </li>`;
          })
          resolve(true)
        }
      }
    });
  };
};

export {IndexedDb};