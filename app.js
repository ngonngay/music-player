const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const cd= $(".cd");
const player=$(".player");
const header=$("header h2");
const thumb=$(".cd-thumb");
const audio=$("#audio");
const playButton=$(".btn-toggle-play");
const progress=$("#progress");
const nextBtn=$(".btn-next");
const prevBtn=$(".btn-prev");
const repeatBtn=$(".btn-repeat");
const randomBtn=$(".btn-random");
const playlist=$('.playlist');
//console.log(playButton);
const app = {
    currentIndex: 0,
    lastIndex: [],
    isPlaying: false,
    isTimeUpdate: false,
    isRandom: false,
    isReapeating: false,
    songPlayed: [],
    clearSongPlayed: function (clear=false) {
      //console.log('songplayed length : ' +this.songPlayed.length)
      if (clear) {
          while (this.songPlayed.length>0){
            this.songPlayed.pop();
          }
      }else{
        if (this.songPlayed.length==this.songs.length-1) {//đã phát 5 bài nên phải clear để thêm bài mới vào mảng
          while (this.songPlayed.length>0){
               this.songPlayed.pop();
           }
         }
      }
      
    },
    songs: [
        {
          id:1,
          name: "Demon",
          singer: "Imagine Dragon",
          path: "https://tainhacmienphi.biz/get/song/api/10889",
          image: "https://i.pinimg.com/564x/8b/af/55/8baf55b7d8103eca600338b58f04e43d.jpg"
        },
        {
          id:2,
          name: "Rồi tới luôn",
          singer: "Nal",
          path: "https://tainhacmienphi.biz/get/song/api/316769",
          image:
            "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/a/9/e/e/a9ee81fdd1c2b569c1c9631e969ea0aa.jpg"
        },
        {
          id:3,
          name: "Faded",
          singer: "Alan Walker",
          path:"https://tainhacmienphi.biz/get/song/api/2581",
          image: "https://i.pinimg.com/564x/f5/b2/23/f5b223c0d135438c4a94bfda8998402c.jpg"
        },
        {
          id:4,
          name: "2002",
          singer: "Anne Marie",
          path: "https://tainhacmienphi.biz/get/song/api/61880",
          image:"https://i.pinimg.com/564x/da/1f/32/da1f3206326d0a494891187fe3776d38.jpg"
        },
        {
          id:5,
          name: "Nàng Thơ",
          singer: "Hoàng Dũng",
          path: "https://tainhacmienphi.biz/get/song/api/181622",
          image:"https://i.pinimg.com/564x/e1/41/84/e14184a586024165f2fe0b99fd48778a.jpg"
        },
        {
          id:6,
          name: "Từ Ngày Em Đến ",
          singer: "Da LAB",
          path: "https://tainhacmienphi.biz/get/song/api/10847",
          image:"https://i.pinimg.com/originals/0a/31/8c/0a318c7f2556b703a74666feb4a05306.jpg"
        }
      ],
    render: function(){
        const htmls= this.songs.map((song,index)=>{
            return  `
                <div class="song" id="song${song.id}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML=htmls.join('');
      },
    defineProperties: function (){
        Object.defineProperty(this, 'currentSong',{
          get: function () { 
            return this.songs[this.currentIndex];
          }
        })
    },
    loadCurrentSong: function (){
        header.textContent = this.currentSong.name;
        thumb.style.backgroundImage = 'url(' + this.currentSong.image + ')';
        audio.src = this.currentSong.path;
        //console.log("load current song")
        $(".song.active")?.classList.remove("active");
        var activeSong=$(`#song${this.currentSong.id}`)
        activeSong.classList.add("active");
        
    },
    playRandom: function (){
        let newIndex=-1;
        let played=false;
        let loop=0;
        do {
          this.clearSongPlayed();
          newIndex =Math.floor((Math.random() * app.songs.length));
          played=app.songPlayed.some((song) =>song==newIndex);
          loop++;
          if (loop>15) {
            break;
          }
        } while (newIndex==app.currentIndex||played);
        this.songPlayed.push(this.currentIndex);
        this.currentIndex=newIndex;
        this.loadCurrentSong();
    },
    nextSong: function (){
        app.clearSongPlayed();
        app.songPlayed.push(app.currentIndex);
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function (){
      //this.currentIndex = this.lastIndex.pop();
      this.currentIndex--;
      if(this.currentIndex<0){
        this.currentIndex=app.songs.length-1;
      }
      this.loadCurrentSong();
    },
    handleEven: function (){
      //handle event scroll playlist
        const cdWidth= cd.offsetWidth;
        document.onscroll=function (e) {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const newCdWidth=cdWidth-scrollTop;
          //console.log("cdWidth: " + cdWidth +" scrollTop: " + scrollTop +" newCdWidth: " +newCdWidth );
          cd.style.width =newCdWidth>0? newCdWidth + "px":0;
          cd.style.opacity = newCdWidth/cdWidth;
        }
      //handle cd rolate animation 
        var thumbAnimation=thumb.animate([
          { transform: ' rotate(360deg) '}
        ],
        {
          duration:10000,
          iterations:Infinity
        });
        thumbAnimation.pause();
      //handle event click play button

        playButton.onclick = function() {
          //console.log(app.isPlaying);
          if (app.isPlaying) {
            audio.pause();
          }else{
            audio.play();
          }
        }
      //setting status of audio player
        audio.onplay = function(){
          app.isPlaying=true;
          player.classList.add("playing");
          thumbAnimation.play();
        };
        audio.onpause = function(){
          app.isPlaying=false;
          player.classList.remove("playing");
          thumbAnimation.pause();
        };
        audio.onended = function(){
          //app.lastIndex.push(app.currentIndex);
          if (!app.isReapeating) {
            if (app.isRandom) {
              app.playRandom();
            }else{
              app.nextSong();
            }
          }
          audio.play();
        }
      //chang potition range control play
        audio.ontimeupdate = function(){
          if(audio.duration&&!app.isTimeUpdate){
            let processIndex = Math.floor(audio.currentTime / audio.duration *100);
            progress.value=processIndex;
            //fill background color
            progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + processIndex + '%, #d3d3d3 ' + processIndex + '%,  #d3d3d3 100%)'
          }
        }

      //seek 
        progress.onpointerdown = function(){
            app.isTimeUpdate=true;
        }  

        progress.onchange = function(e){
          app.isTimeUpdate=false;
          let newTime = e.target.value*audio.duration/100;
          audio.currentTime=newTime;
        }
      //next 
        nextBtn.onclick=function(){
          //app.lastIndex.push(app.currentIndex);
          if (app.isRandom) {
            app.playRandom();
          }else{
            app.nextSong();
          }
          
          audio.play();
        }
      //prev 
        prevBtn.onclick=function(){
          app.prevSong();
          audio.play();
        }
      //random
        randomBtn.onclick=function(){
          if(app.isRandom){
            randomBtn.classList.remove('active');
            app.isRandom = false;
            app.songPlayed=[];
          }else{
            randomBtn.classList.add('active');
            app.isRandom = true;
          }
          
        };
      //handle repeat
        repeatBtn.onclick=function(){
            app.isReapeating=!app.isReapeating;
            repeatBtn.classList.toggle('active',app.isReapeating);
        }
      //click next song
        playlist.onclick= function(e){
          const songNode=e.target.closest('.song:not(.active)')
          const songNodeOption=e.target.closest('.option')
          if (songNode||songNodeOption) {
             if (songNode&& !songNodeOption) {
                app.currentIndex =songNode.dataset.index;
                app.loadCurrentSong();
                audio.play();
             }else if(!songNode&&songNodeOption){
                console.log("Lười làm lắm ^^");
                
             }
          }
        }
    },
    start: function (){
        this.defineProperties();
        this.render();
        this.loadCurrentSong();
        this.handleEven();
    }
}
app.start();