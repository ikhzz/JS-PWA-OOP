import {IndexedDB} from './indexedDB.js'

class Pages extends IndexedDB {
    loadPages = (data) => {
      const url = `pages/${data}.html`
      let a =''
      fetch(url)
        .then(res => res.text())
        .then(res => {
            document.querySelector('.content').innerHTML = res
            if(data === 'home') {
              this.loadHome()
              clearInterval(a)
            } else if(data === 'yDay') {
              this.loadyDay()
               a = setInterval(this.clock,1000)
            } else if(data === 'status'){
              this.loadStatus()
              clearInterval(a)
            }
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
    loadHome = () => {
      document.querySelector('.fp').addEventListener('click', ()=> {
        document.querySelector('.upload').classList.toggle('uploads') 
      
        document.querySelector('#style').addEventListener('change', (e)=> {
          document.querySelector('.prevProfile').style.borderRadius = e.target.value
        })
      })
  
      document.querySelector('.confirmProfile').addEventListener('click', this.addProfilepic)
  
      document.querySelector('.addProfile').addEventListener('click', ()=> {
      document.querySelector('.addDesc').classList.toggle('uploads')
      })
  
      document.querySelector('.inputPic').addEventListener('change', this.prev)
  
      document.querySelector('.confirmDesc').addEventListener('click', ()=> {
        this.addDesc()
      })
      document.querySelectorAll('.cancel').forEach(e => {
        e.addEventListener('click', this.upToggle)
      })
      this.loadProfile()
      this.loadDesc()
    }
  
    loadStatus = () => {
      this.loadStats().then(r => {
        let val = r[1] * (90/r[0])
        if(val > 90) {
          val = 90
        } else if (val < -90) {
          val = -90
        }
        document.querySelector('.mtr').style.transform = `rotateZ(${val}deg)`
      })
      this.loadHistory()
    }
  
    loadyDay = () => {
      document.querySelector('.mood').addEventListener('click', ()=> {
        document.querySelector('.addMood').classList.toggle('uploads')
      })
      document.querySelector('.thought').addEventListener('click', ()=> {
        document.querySelector('.addThought').classList.toggle('uploads')
      })
      document.querySelectorAll('.moods').forEach(e => {
        e.addEventListener('click', ()=> {
          this.addPosts('mood', e.innerHTML, e.getAttribute('value'))
        })
      })
      document.querySelector('.confirmThought').addEventListener('click', () => {  
        this.addPosts('thought', document.querySelector('.thoughts').value, '0')
      })
      document.querySelectorAll('.cancel').forEach(e => {
        e.addEventListener('click', this.upToggle)
      })
      
      
      this.loadPosts()
    }
    clock = () => {
        if(document.querySelector('.clock')) {
            const a = new Date,
        mnt = a.getMinutes() < 10 ? '0'+a.getMinutes() : a.getMinutes();
    
        document.querySelector('.hrs').innerHTML = a.getHours()
        document.querySelector('.min').innerHTML = mnt
        }
    }
  }

export {Pages}