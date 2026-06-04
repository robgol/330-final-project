(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(){this.baseUrl=`https://jsonplaceholder.typicode.com/posts`}async getLiveAviationData(){try{let e=await fetch(this.baseUrl);if(!e.ok)throw Error(`Network error: ${e.status}`);return(await e.json()).slice(0,6).map(e=>({properties:{severity:`Minor`,event:`Flight Data Node #${e.id}`,headline:e.title,senderName:`Civil Aviation Authority System`}}))}catch(e){throw console.error(`Error fetching data from external API:`,e),e}}};(async()=>{let t=new e,n=document.getElementById(`dashboard-content`);try{console.log(`Aviation Dashboard Initialized.`);let e=await t.getLiveAviationData();if(n.innerHTML=``,e.length===0){n.innerHTML=`<p class="text-slate-400">No operational data available at the moment.</p>`;return}let r=document.createElement(`div`);r.className=`grid grid-cols-1 md:grid-cols-2 gap-4`,e.forEach(e=>{let t=e.properties||{},n=document.createElement(`div`);n.className=`p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm hover:border-blue-500/50 transition-colors`,n.innerHTML=`
        <span class="inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-red-500/10 text-red-400 mb-2">
          ${t.severity||`Alert`}
        </span>
        <h3 class="text-lg font-bold text-slate-100">${t.event||`Unknown Event`}</h3>
        <p class="text-sm text-slate-400 mt-2 line-clamp-3">${t.headline||`No additional details available.`}</p>
        <div class="mt-4 text-xs text-slate-500 border-t border-slate-800 pt-2">
          Origin: ${t.senderName||`N/A`}
        </div>
      `,r.appendChild(n)}),n.appendChild(r)}catch{n.innerHTML=`
      <div class="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
        <h2 class="font-bold">System Error</h2>
        <p class="text-sm mt-1">Unable to load tactical aviation data. Please try again later.</p>
      </div>
    `}})();