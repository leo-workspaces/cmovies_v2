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
    }
        
}

class EmbedUI {
    init(movie) {
        this.movie = movie;
        this.display();
    }

  async  display() {
        const div = document.createElement("div");
        div.innerHTML = `
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
        <button id="server_1" class="server-btn active">
            <i class="fa-solid fa-cloud"></i>
            <span>Server 1</span>
        </button>
        <button id="server_2" class="server-btn">
            <i class="fa-solid fa-cloud"></i>
            <span>Server 2</span>
        </button>
    </div>
</div>`;
        
        document.body.appendChild(div);
        await reloadIframeThreeTimes("player")

        // Fix: Bind "this" so the function can access this.movie
        document.getElementById("server_1").addEventListener("click", (e) => this.serverChange(e));
        document.getElementById("server_2").addEventListener("click", (e) => this.serverChange(e));
    }

    serverChange(event) {
        const serverId = event.currentTarget.id;
        const iframe = document.querySelector(".iframe");
        
        if (serverId === "server_1") {
            iframe.src = this.movie.embed;
        } else {
            iframe.src = `${this.movie.embed}?server=2`;
        }
    }
}
function reloadIframeThreeTimes(iframeId) {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;

  let count = 0;

  const interval = setInterval(() => {
    iframe.src = iframe.src; // reload
      
    count++;
    console.log ("attempt ",count)
    if (count >= 2) {
      clearInterval(interval);
    }
  }, 10);
}
// Single Export Instances
export const embedUi = new EmbedUI();
export const fetchmovie = new FetchMovie();