const WORKER = `https://worker.1262sbmdj27dj.workers.dev/`;

// Ensure these functions exist or are imported correctly

class FetchMovie {
    constructor() {
        // Fix: Get the ID from the actual URL search string
        const params = new URLSearchParams(window.location.search);
        this.movieId = params.get("id");

        if (!this.movieId) {
            window.location.href = "/";
        }
    }

    async fetchWorker() {
        try {
            const res = await fetch(`${WORKER}?imdb=${this.movieId}`);
            const data = await res.json();
            this.identifyData(data);
            
        } catch (err) {
            console.error("Fetch failed", err);
        }
    }

    async identifyData(data) {
        if (data.type === "embed") {
            embedUi.init(data); // Call the instance method
        
        }
        if(data.type === "stream"){
            streamUI.init(data)
        }
    }
        
}
class streamUI{
    init(data){
        
    }
}

class EmbedUI {
    init(movie) {
        this.movie = movie;
        this.display();
    }

async  display() {
      const infOmdb = await this.loadExtra()
     const recommended = await this.createRecommendation(this.movie.similar)
        const div = document.createElement("div");
        div.innerHTML = `
        
       <div class="loader" style="display:block;">
  <i class="fas fa-spinner"></i>
</div>
            <h3 id="title">${this.movie.title || 'Movie'}</h3>
            <div class="video-card">
                <div class="video-container">
                <iframe id="player" class="iframe" src="${this.movie.embed}" 
allowfullscreen allow="autoplay; encrypted-media"></iframe>      </div>
                   <div class="controls-bar">
        <div class="left-controls">
            <div id="expand_iframe">
            <i class="fa-solid fa-expand highlight"></i>
            </div>
            <i class="fa-solid fa-forward-step highlight"></i>
        </div>
        <div class="right-controls">
            <div id="store">
            <i class="fa-solid fa-bookmark"></i></div>
            <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
    </div>
</div>
              <div class="server-section">
    <p class="server-hint">If the current server is not working, please try switching to other servers.</p>
    
    <div class="server-switcher">
        <button id="server_1" class="server-btn active" data-server="active">
            <i class="fa-solid fa-cloud"></i>
            <span>Server 1</span>
        </button>
        <button id="server_2" class="server-btn">
            <i class="fa-solid fa-cloud"></i>
            <span>Server 2</span>
        </button>
    </div>
</div>
<br>

  <div class="info_movie-card">
  <div class="header">
    <h1 class="info_h1">${this.movie.title}</h1>
    <div class="badges">
     
      <span class="badge gray">TS</span>
      <span class="badge gray">PG-13</span>
      <span class="badge gray">${this.movie.info.release_date.split("-")[0]}</span>
    </div>
  </div>

  <p class="description">
    ${this.movie.info.overview}
  </p>

  <hr class="divider">

  <div class="content-wrapper">
    <div class="poster-container">
     <img src="https://image.tmdb.org/t/p/w500${this.movie.info.poster_path}" class="poster-img">
    </div>
     <div class="details">
   ${infOmdb[0]}
      </div>
  


  
  </div>

  <div class="rating-footer">
    <div class="stars">
     ${rate(this.movie.info.vote_average)}
    </div>
    <div class="rating-text">
      <strong>${infOmdb[1]}</strong> of <strong>10</strong> 
    </div>
  </div>
  
</div>

<br>
  <div class="recommendation-container">
    <h2 class="section-title-liked">You may also like</h2>
   <div class="scroll-wrapper">
        ${recommended}
      </div>
</div>

<footer id="footer">
    <div id="request_info">
      <span>Request</span>
      <span>Contact</span>
      <span>Privacy Policy</span>
    </div>
    
    <p>
      <strong>Coinresty</strong> is your destination for free high-quality movies and TV shows. 
      Dive into seamless streaming without the hassle of subscriptions or hidden fees.
    </p>
    
    <div id="bottom">
      <img src="/IMG/logo_m.png" alt="Coinresty Logo" width="40" height="40">
      <span>&copy; 2026 Coinresty Streaming. All rights reserved.</span>
    </div>
  </footer>
`;

       
     function rate(stars) {
    let rating = Math.round(stars / 2);
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += `<i class="fas fa-star ${i <= rating ? 'yellow' : 'gray'}"></i>`;
    }
    return html;
    }
    
     function getGenres(ids) {
         const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};
  return ids.map(id => genreMap[id] || "Unknown");
}



        document.body.appendChild(div);
        

        // Fix: Bind "this" so the function can access this.movie
        document.getElementById("server_1").addEventListener("click", (e) => this.serverChange(e));
        document.getElementById("server_2").addEventListener("click", (e) => this.serverChange(e));
        document.getElementById("expand_iframe").addEventListener("click",async ()=> await this.expandUI())
         document.getElementById("store").addEventListener("click",async()=> await this.saveMovie(this.movie.title))
     const iframe = document.getElementById("player");
const loader = document.querySelector(".loader");

const handleLoad = () => {
    console.log("Iframe content fully loaded");
    loader.style.display = "none";
};

if (iframe.complete || iframe.contentDocument?.readyState === 'complete') {
    handleLoad();
} else {
    iframe.addEventListener("load", handleLoad, { once: true });
}
    }
    
    
    async loadExtra() {
  const extraInfo = await this.getMovie(this.movie.title);

  if (!extraInfo) return;

  const html = `
    <p><span>Country:</span> ${extraInfo.Country || "N/A"}</p>
    <p><span>Genres:</span> ${extraInfo.Genre || "N/A"}</p>
    <p><span>Released:</span> ${extraInfo.Released || "N/A"}</p>
    <p><span>Directors:</span> ${extraInfo.Director || "N/A"}</p>
    <p><span>Productions:</span> ${extraInfo.Production || "N/A"}</p>
    <p><span>Casts:</span> ${extraInfo.Actors || "N/A"}</p>
  `;

  return [html,extraInfo.imdbRating]
}

async createRecommendation(movie){
    const recommend = movie
    let html = ``
    recommend.forEach(datarec =>{
        html +=`
        <a href="/movie.html?${this.movie.title.toLowerCase().replace(" ","-").replace(":","-")}&id=${datarec.id}">
         <div class="movie-card-liked">
            <div class="img-container-liked">
                <span class="hd-badge">HD</span>
                <img src="https://image.tmdb.org/t/p/w500${datarec.poster_path}" alt="${datarec.title}" class="poster-liked">
            </div>
            <div class="movie-info-liked">
                <p class="meta-liked">Movie • ${datarec.release_date.split("-")[0]}</p>
                <h3 class="movie-title-liked">${datarec.title}</h3>
            </div>
        </div>
        </a>
        
   
        `
    })
    return html
    
}
    
async getMovie(title){
    const apikey = "afcd4c24";

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apikey}`
    );

    const data = await res.json();
       if (data.Response === "False") {
      alert("Movie not found");
      return data;
    }
    return data
    
}  catch (err) {
    console.error("Error:", err);
  }
}

async saveMovie(title) {
  const apikey = "afcd4c24";

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apikey}`
    );

    const data = await res.json();

    if (data.Response === "False") {
      alert("Movie not found");
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));

    // Save separately (different keys)
    document.cookie = `movieTitle=${data.Title};expires=${expires.toUTCString()};path=/`;
    document.cookie = `moviePoster=${data.Poster};expires=${expires.toUTCString()};path=/`;
    document.cookie = `movieReleased=${data.Released};expires=${expires.toUTCString()};path=/`;

    alert("Saved!");

  } catch (err) {
    console.error("Error:", err);
  }
}

async expandUI(){
    alert("tapped")
    const iframe = document.querySelector(".video-card");

    const container = document.querySelector(".video-container")
    container.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    z-index: 100;
    `
    iframe.requestFullscreen()
}

   serverChange(event) {
    const serverId = event.currentTarget.id;
    const iframe = document.querySelector(".iframe");
    const server1 = document.getElementById("server_1");
    const server2 = document.getElementById("server_2");
    
    if (serverId === "server_1") {
        server1.setAttribute("data-server", "active");
        server2.removeAttribute("data-server");
        iframe.src = this.movie.embed;
    } else {
        server2.setAttribute("data-server", "active");
        server1.removeAttribute("data-server");
        iframe.src = `${this.movie.embed}?server=2`;
    }
}


recommend(){
    
}

}

async function reloadIframeThreeTimes(iframeId) {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;
 let c = 0
  for (let count = 0; count <= 1; count++) {
    iframe.src = iframe.src; //reload
    c +=1
    console.log("attempt", count);

    await (3); // wait 1 second between reloads
  }
  
  if(c>= 4){
      await wait(2)
      iframe.src = `${iframe.src}?server=2`
  }
}

function wait(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}


// Single Export Instances
export const embedUi = new EmbedUI();
export const fetchmovie = new FetchMovie();
