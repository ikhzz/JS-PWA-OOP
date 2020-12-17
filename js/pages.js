import {IndexedDb} from './indexedDb.js';

class Pages extends IndexedDb {
  // Method to load page by link
  loadPages = (page)=> {
    // Setup url to file
    const url = `pages/${page}.html`
    fetch(url)
      .then(res => res.text())
      .then(res => {
        // Set content from result by fetch
        document.querySelector('.content').innerHTML = res;
        // Add additional method for every page
        if(page === 'home'){
          this.homePage();
        }else if(page === 'yourDay'){
          this.yourdayPage();
        } else if(page === 'history'){
          this.historyPage();
        }
      })
  };

  // Additional method to home
  homePage = async()=> {
    // Check saved image and description
    const image = await this.checkImage().then(r => r),
      desc = await this.checkDescription().then(r => r)
    // Set image if image result is not undefined or set default image
    if(image !== undefined){
      this.loadImage();
    } else{
      this.defaultImg();
    }
    // Set description
    // If length of profile data is only one
    if(desc.length === 1){
      // check if its not image data then load description
      if(image === undefined){
        await this.loadDescription();
        const a = document.querySelectorAll('.desc li')
        a.forEach((e,i)=> {
          e.addEventListener('click',()=> {
            document.querySelectorAll('.deleteDesc')[i].classList.toggle('descMenu')
          })
        })
      }
    } else if(desc.length > 1){
      // if profile data is more than one load all data
      await this.loadDescription();
      document.querySelectorAll('.desc li').forEach((e,i)=> {
        e.addEventListener('click',()=> {
          document.querySelectorAll('.deleteDesc')[i].classList.toggle('descMenu')
        })
      })
    }

    // Listener request to change image
    document.querySelector('.profPic img').addEventListener('click',()=> {
      // this.showOption('.changePicture')
      document.querySelector('.option').style.display = 'grid';
      document.querySelector('.changePicture').style.display = 'grid';
    console.log('a')
    });
    // Listener request to add desc
    document.querySelector('.btnDesc').addEventListener('click',()=> {
      this.showOption('.addDescription')
    });
    // Listener to preview image from user
    document.querySelector('.inputPic').addEventListener('change', this.previewImage)
    // Listener to change image style
    document.querySelector('#style').addEventListener('change', (e)=> {
      document.querySelector('.prevProfile').style.borderRadius = e.target.value
    })
    // Listener to confirm profile image
    document.querySelector('.confirmChangePicture').addEventListener('click', ()=>{
      this.addProfileImage()
      this.loadImage()
      this.clear()
    })
    // Listener to add description
    document.querySelector('.confirmAddDesc').addEventListener('click', async ()=> {
      const result = await this.addDescription().then(r => r)
      // Check if result is success then reload pages
      if(result == true){
        location.reload()
        this.clear();
      } else{
        // If result empty send error messages
        this.clear();
        this.snackBar('Input cannot be empty')
      }
    });
    
  };

  // Method to set default image
  defaultImg = ()=> {
    this.snackBar('No image saved')
    const a = document.querySelector('.profPic img');
    a.src = 'assets/img/IMG_0109.JPG';
  };

  // Method to preview image
  previewImage = ()=>{
    // Listen to input file, prepare file type and set FileReader
    const file = document.querySelector('.inputPic').files[0],
      filetype = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/gif'],
      reader = new FileReader;

      // Check if file is exist
      if(file !== undefined) 
        // Check if file is image
        if(filetype.includes(file.type)) {
          // Preview image with file reader
          reader.readAsDataURL(file)
          reader.onload = e => {
            document.querySelector('.prevProfile').setAttribute('src', e.target.result)
          }
        } else {
          // If file input is not image clear the input, preview and show info
          document.querySelector('.inputPic').value = ''
          document.querySelector('.prevProfile').setAttribute('src','')
          this.snackBar('Input is not file image')
        }
  };

  // Snackbar method
  snackBar = (msg)=> {
    // Set snackbar message
    document.querySelector('.snackbar p').innerHTML = msg;
    // Show snackbar for 2 seconds
    document.querySelector('.snackbar').classList.toggle('snackbarShow')
    setTimeout(()=> {
      document.querySelector('.snackbar').classList.toggle('snackbarShow')
    }, 2000);
  };

  // Method to clear option
  clear = () => {
    document.querySelector('.option').style.display = 'none';
    document.querySelector('.changePicture').style.display = 'none';
    document.querySelector('.addDescription').style.display = 'none';
    document.querySelector('.addMood').style.display = 'none';
    document.querySelector('.addThought').style.display = 'none';
    document.querySelector('.profTitle').value = '';
    document.querySelector('.profDesc').value = '';
    document.querySelector('.inputPic').value = '';
    document.querySelector('.prevProfile').src = '';
  };

  // Additional method to yourDay page
  yourdayPage = async () => {
    // Set wallpaper depends of time
    this.setWallpaper();
    // Check if there is any posts today
    const result = await this.checkPosts().then(r => r);
    if(result > 0){
      // Load option and set delete method
      await this.loadPosts();
      document.querySelectorAll('.moodAndThought li').forEach((e,i)=> {
        e.addEventListener('click',()=> {
          document.querySelectorAll('.deleteDesc')[i].classList.toggle('descMenu')
        })
      })
    } else {
      // show messeage
      this.snackBar('There is no posts today')
    }
    //Listener request to add mood
    document.querySelector('.addMoods').addEventListener('click', ()=> {
      this.showOption('.addMood');
    })
    // Listener request to add thought
    document.querySelector('.addThoughts').addEventListener('click', ()=> {
      this.showOption('.addThought');
    })
    // Listener to add mood and load it
    document.querySelectorAll('.addMood .moods').forEach(e => {
      e.addEventListener('click', async () => {
        await this.addPosts('mood', e.innerHTML, e.getAttribute('value'))
        this.clear();
        this.loadPosts();
      })
    })
    // Listener to add thought and load it
    document.querySelector('.confirmThought').addEventListener('click', async ()=> {
      await this.addPosts('thought', document.querySelector('.thought').value, '0')
      this.clear();
      this.loadPosts();
    })
  };

  // Method to set wallpaper
  setWallpaper = () => {
    // Get current hours
    const a = (new Date).getHours();
    // Set hours image based on hours
    if(a > 5 && a < 18){
      document.querySelector('.dailyBackground').style.backgroundImage = "url('/assets/img/day.jpg')";
    } else {
      document.querySelector('.dailyBackground').style.backgroundImage = "url('/assets/img/night.jpg')";
    }
  };

  // Method to show option
  showOption = (option) => {
    document.querySelector('.option').style.display = 'grid';
    document.querySelector(option).style.display = 'grid';
  };

  // Additional method to history page
  historyPage = async() => {
    // Set function to clear description and posts
    window.deleteAllDescription = this.deleteAllDescription;
    window.deleteAllPosts = this.deleteAllPosts;
    // Check posts and description
    const posts = await this.checkAllPosts().then(r => r),
      description = await this.checkAllDescription().then(r => r)

    if(posts > 0 || description > 0){
      // If there is any post or description show the number
      this.setTotalPosts(posts, description)
    } else {
      // send message
      this.snackBar('No Posts or Description')
    }
    
    if(posts > 0){
      // If there is any post load all posts
      await this.loadAllPosts().then(r => r)
      document.querySelectorAll('.listHistory li').forEach((e,i)=> {
        e.addEventListener('click',()=> {
          document.querySelectorAll('.deleteDesc')[i].classList.toggle('descMenu')
        })
      })
    }
  }

  // Method to set total posts and total description
  setTotalPosts = (number, description) => {
    document.querySelector('.totalPosts p').innerHTML = `Total Posts: ${number}`;
    document.querySelector('.totalDescription p').innerHTML = `Total Description: ${description}`;
  }
};

export {Pages};