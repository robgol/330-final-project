(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(){this.flightApiUrl=`https://api.aviationstack.com/v1/flights`,this.weatherApiUrl=`https://avwx.rest/api/metar`,this.flightApiKey=`bb79973d3e878629926853ddce3ac4f1`,this.weatherApiKey=`AQr5Qk5OKrSKX_OZV7r-EP36M4azMnLYKinWdHZgiqE`}async getAirportWeather(e){let t=e.trim().toUpperCase();t.length===3&&(t=t===`RAI`?`GVNP`:t===`LIS`?`LPPT`:t===`SID`?`GVAC`:`G${t}`);try{let e=await fetch(`${this.weatherApiUrl}/${t}`,{headers:{Authorization:`Token ${this.weatherApiKey}`}});if(!e.ok)throw Error(`AVWX Telemetry HTTP Error: ${e.status}`);let n=await e.json();return console.log(`Live Weather Data Received:`,n),n}catch(e){return console.warn(`AVWX API failure. Engaging local meteorological sandbox for ${t}.`,e),this._getSandboxWeather(t)}}async getAirportFlights(e,t=`departure`){let n=e.trim().toUpperCase().substring(0,3);try{let e=t===`departure`?`dep_iata`:`arr_iata`,r=`${this.flightApiUrl}?access_key=${this.flightApiKey}&${e}=${n}&limit=20`,i=await fetch(r);if(!i.ok)throw Error(`Aviationstack HTTP Error: ${i.status}`);let a=await i.json();return console.log(`Live Flights Data Received:`,a),!a.data||a.data.length===0?this._getSandboxFlights(n,t):a.data}catch(e){return console.warn(`Aviationstack API throttled. Engaging local flight operations sandbox for ${n}.`,e),this._getSandboxFlights(n,t)}}_getSandboxWeather(e){return{station:e,raw:`${e} 171930Z 21014KT 9999 FEW022 26/20 Q1013 NOSIG`,flight_rules:`VFR`,temperature:{value:26},dewpoint:{value:20},wind_speed:{value:14},wind_direction:{value:210},visibility:{value:10},altimeter:{value:1013},clouds:[{repr:`FEW`,altitude:22}]}}_getSandboxFlights(e,t){let n=t===`departure`;return[{flight_date:`2026-06-17`,flight_status:`active`,flight:{number:`VR601`},airline:{name:`Cabo Verde Airlines`},departure:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`3`,delay:0},arrival:{airport:`Lisbon Humberto Delgado`,iata:`LIS`,icao:`LPPT`,terminal:`T1`,gate:`A12`,delay:0}},{flight_date:`2026-06-17`,flight_status:`delayed`,flight:{number:`TP1492`},airline:{name:`TAP Air Portugal`},departure:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`1`,delay:55},arrival:{airport:`Lisbon Humberto Delgado`,iata:`LIS`,icao:`LPPT`,terminal:`T1`,gate:`B04`,delay:45}},{flight_date:`2026-06-17`,flight_status:`scheduled`,flight:{number:`AT931`},airline:{name:`Royal Air Maroc`},departure:{airport:`Mohammed V Intl`,iata:`CMN`,icao:`GMMN`,terminal:`T2`,gate:`F2`,delay:10},arrival:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`2`,delay:0}}].filter(t=>n?t.departure.iata===e:t.arrival.iata===e)}},t=class{constructor(e,t){this.listContainer=document.getElementById(e),this.searchForm=document.getElementById(t),this.onSearchCallback=null}init(e){this.onSearchCallback=e,this.searchForm&&this.searchForm.addEventListener(`submit`,e=>{e.preventDefault();let t=this.searchForm.querySelector(`input[type="text"]`);t&&t.value.trim()!==``&&(this.showLoading(),this.onSearchCallback(t.value.trim().toUpperCase()))})}showLoading(){this.listContainer.innerHTML=`
      <div class="col-span-full text-center py-12">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-500 rounded-full" role="status"></div>
        <p class="text-slate-400 mt-2 font-medium">Processing real-time telemetry...</p>
      </div>
    `}renderFlights(e){if(!e||e.length===0){this.listContainer.innerHTML=`
        <div class="col-span-full bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
          <p class="text-slate-400">No commercial movements detected for this node.</p>
        </div>
      `;return}let t=e.map(e=>{let t=e.flight?.number||`---`,n=e.airline?.name||`Unknown Carrier`,r=e.flight_status||`scheduled`,i=e.flight_date||`---`,a=e.departure?.airport||e.arrival?.airport||`---`,o=e.departure?.iata||e.arrival?.iata||`---`,s=e.departure?.terminal||e.arrival?.terminal||`Mnd`,c=e.departure?.gate||e.arrival?.gate||`---`,l=e.departure?.delay||e.arrival?.delay||0,u=`bg-blue-500/10 text-blue-400 border-blue-500/20`;return r===`active`&&(u=`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`),(r===`delayed`||l>0)&&(u=`bg-amber-500/10 text-amber-400 border-amber-500/20`),`
        <div class="bg-[#153053] rounded-xl p-5 border border-slate-700/60 shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="text-xs font-mono tracking-wider text-slate-400 block">${i}</span>
                <h4 class="text-lg font-bold text-white tracking-tight">${n}</h4>
              </div>
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded border ${u} uppercase font-mono">
                ${r} ${l>0?`(+${l}m)`:``}
              </span>
            </div>
            
            <div class="text-sm space-y-1 text-slate-300">
              <p><span class="text-slate-400 font-medium">Flight:</span> <span class="font-mono text-white font-semibold">${t}</span></p>
              <p><span class="text-slate-400 font-medium">Airport:</span> ${a} (${o})</p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-700/50 flex justify-between text-xs text-slate-400 font-mono">
            <span>Terminal: <strong class="text-white">${s}</strong></span>
            <span>Gate: <strong class="text-white">${c}</strong></span>
          </div>
        </div>
      `}).join(``);this.listContainer.innerHTML=`<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${t}</div>`}renderError(e){this.listContainer.innerHTML=`
          <div class="col-span-full p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start space-x-3 shadow-md">
            <span class="text-xl">⚠️</span>
            <div>
              <h4 class="font-bold text-white text-base">Operational Alert</h4>
              <p class="text-sm mt-0.5 text-slate-300">${e}</p>
            </div>
          </div>
        `}},n=class{constructor(e){this.container=document.getElementById(e)}render(e){if(!e){this.container.innerHTML=`<p class="text-amber-500">Meteorological data unavailable.</p>`;return}let t=e.station||`---`,n=e.raw||`No raw data available.`,r=e.flight_rules||`VFR`,i=e.temperature?.value??`N/A`,a=e.dewpoint?.value??`N/A`,o=e.wind_speed?.value??0,s=e.wind_direction?.value??0,c=e.visibility?.value??`N/A`,l=`Sky Clear`;e.clouds&&e.clouds.length>0&&(l=e.clouds.map(e=>`${e.repr} at ${e.altitude*100} ft`).join(`, `));let u=r===`VFR`?`bg-emerald-500/20 text-emerald-400 border-emerald-500/30`:`bg-amber-500/20 text-amber-400 border-amber-500/30`;this.container.innerHTML=`
      <div class="bg-[#153053] rounded-xl p-6 border border-slate-700 shadow-xl transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-white">Meteorological Report (${t})</h3>
          <span class="px-3 py-1 text-xs font-semibold rounded-full border ${u}">
            ${r}
          </span>
        </div>

        <div class="bg-[#0b192c] p-3 rounded border border-slate-800 mb-4">
          <code class="text-xs text-amber-400 block break-words font-mono">${n}</code>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Wind</span>
            <span class="text-white font-medium">${s}° @ ${o} KT</span>
          </div>
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Visibility</span>
            <span class="text-white font-medium">${c} SM</span>
          </div>
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Temp / Dewpoint</span>
            <span class="text-white font-medium">${i}°C / ${a}°C</span>
          </div>
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50 col-span-2 md:col-span-3">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Cloud Layers</span>
            <span class="text-white font-medium">${l}</span>
          </div>
        </div>
      </div>
    `}},r,i,a,o=[],s=`departure`;async function c(e){let t=e.trim().toUpperCase();if(!/^[A-Z]{3,4}$/.test(t)){document.getElementById(`weather-container`).innerHTML=``,document.getElementById(`filter-controls`)?.classList.add(`hidden`),i.renderError(`Invalid airport code format. Please enter a valid 3-letter IATA (e.g., RAI) or 4-letter ICAO (e.g., GVNP) code containing only letters.`);return}try{let e=await r.getAirportWeather(t);a.render(e),o=await r.getAirportFlights(t,s),i.renderFlights(o),document.getElementById(`filter-controls`)?.classList.remove(`hidden`)}catch(e){console.error(`Erro ao processar dados aeronáuticos:`,e),document.getElementById(`weather-container`).innerHTML=``,document.getElementById(`filter-controls`)?.classList.add(`hidden`),i.renderError(`Operational Connection Failure: Unable to load telemetry for network node ${t}. Please verify the code and try again.`)}}function l(){let e=document.getElementById(`btn-departures`),t=document.getElementById(`btn-arrivals`),n=document.getElementById(`chk-delays-45`);e?.addEventListener(`click`,()=>{s=`departure`,e.classList.add(`bg-blue-600`,`text-white`),t?.classList.remove(`bg-blue-600`,`text-white`),u()}),t?.addEventListener(`click`,()=>{s=`arrival`,t.classList.add(`bg-blue-600`,`text-white`),e?.classList.remove(`bg-blue-600`,`text-white`),u()}),n?.addEventListener(`change`,e=>{if(e.target.checked){let e=o.filter(e=>(e.departure?.delay||e.arrival?.delay||0)>45);i.renderFlights(e)}else i.renderFlights(o)})}function u(){let e=document.querySelector(`#search-form input[type="text"]`);e&&e.value.trim()!==``&&(i.showLoading(),c(e.value.trim().toUpperCase()))}document.addEventListener(`DOMContentLoaded`,()=>{console.log(`Aviation Dashboard Lifecycle Hooked.`),r=new e,i=new t(`dashboard-content`,`search-form`),a=new n(`weather-container`),i.init(c),l()});