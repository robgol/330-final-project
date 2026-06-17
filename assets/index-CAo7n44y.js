(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(){this.flightApiUrl=`https://api.aviationstack.com/v1/flights`,this.weatherApiUrl=`https://avwx.rest/api/metar`,this.flightApiKey=`bb79973d3e878629926853ddce3ac4f1`,this.weatherApiKey=`AQr5Qk5OKrSKX_OZV7r-EP36M4azMnLYKinWdHZgiqE`}async getAirportWeather(e){let t=e.trim().toUpperCase();t.length===3&&(t=t===`RAI`?`GVNP`:t===`LIS`?`LPPT`:t===`SID`?`GVAC`:`G${t}`);let n=this.weatherApiKey,r=`https://avwx.rest/api/metar/${t}`,i=`https://avwx.rest/api/taf/${t}`;try{let[e,t]=await Promise.all([fetch(r,{headers:{Authorization:`Token ${n}`}}),fetch(i,{headers:{Authorization:`Token ${n}`}})]);if(!e.ok)throw Error(`AVWX METAR HTTP Error: ${e.status}`);let a=await e.json(),o=null;return t.ok&&(o=await t.json()),{metar:a,taf:o}}catch(e){return console.warn(`AVWX API link failed. Engaging backup simulation for ${t}.`,e),{metar:{station:t,raw:`${t} 171930Z 21014KT 9999 FEW022 26/20 Q1013 NOSIG`,flight_rules:`VFR`,temperature:{value:26},dewpoint:{value:20},wind_speed:{value:14},wind_direction:{value:210},visibility:{value:10},altimeter:{value:1013},clouds:[{repr:`FEW`,altitude:22}]},taf:{raw:`${t} 171700Z 1718/1824 22012KT 9999 FEW020 TX28/1814Z TN22/1806Z BECMG 1722/1724 18008KT`,forecast:[{start_time:{repr:`18:00`},end_time:`24:00`,flight_rules:`VFR`,wind_speed:{value:12},wind_direction:{value:220}},{start_time:{repr:`22:00`},end_time:`00:00`,flight_rules:`VFR`,wind_speed:{value:8},wind_direction:{value:180}}]}}}}async getAirportFlights(e,t=`departure`){let n=e.trim().toUpperCase().substring(0,3);try{let e=t===`departure`?`dep_iata`:`arr_iata`,r=`${this.flightApiUrl}?access_key=${this.flightApiKey}&${e}=${n}&limit=20`,i=await fetch(r);if(!i.ok)throw Error(`Aviationstack HTTP Error: ${i.status}`);let a=await i.json();return!a.data||a.data.length===0?this._getSandboxFlights(n,t):a.data}catch(e){return console.warn(`Aviationstack API throttled. Engaging local airport sandbox for ${n}.`,e),this._getSandboxFlights(n,t)}}async getFlightByNumber(e){let t=e.trim().toUpperCase().replace(/\s+/g,``);try{let e=`${this.flightApiUrl}?access_key=${this.flightApiKey}&flight_iata=${t}&limit=1`,n=await fetch(e);if(!n.ok)throw Error(`Aviationstack Flight Query HTTP Error: ${n.status}`);let r=await n.json();return!r.data||r.data.length===0?this._getSandboxFlightByNumber(t):r.data}catch(e){return console.warn(`Aviationstack Tracking Link failed. Extracting sandbox tracking matrix for ${t}.`,e),this._getSandboxFlightByNumber(t)}}_getSandboxFlightByNumber(e){let t=[{flight_date:`2026-06-17`,flight_status:`active`,flight:{number:`601`,iata:`VR601`},airline:{name:`Cabo Verde Airlines`},departure:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`3`,delay:0,timezone:`Atlantic/Cape_Verde`,scheduled:`2026-06-17T14:30:00+00:00`},arrival:{airport:`Lisbon Humberto Delgado`,iata:`LIS`,icao:`LPPT`,terminal:`T1`,gate:`A12`,delay:0,timezone:`Europe/Lisbon`,scheduled:`2026-06-17T18:45:00+00:00`}},{flight_date:`2026-06-17`,flight_status:`delayed`,flight:{number:`1492`,iata:`TP1492`},airline:{name:`TAP Air Portugal`},departure:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`1`,delay:55,timezone:`Atlantic/Cape_Verde`,scheduled:`2026-06-17T23:05:00+00:00`},arrival:{airport:`Lisbon Humberto Delgado`,iata:`LIS`,icao:`LPPT`,terminal:`T1`,gate:`B04`,delay:45,timezone:`Europe/Lisbon`,scheduled:`2026-06-17T03:20:00+00:00`}}],n=t.find(t=>t.flight.iata===e);return n?[n]:t}_getSandboxFlights(e,t){let n=t===`departure`;return[{flight_date:`2026-06-17`,flight_status:`active`,flight:{number:`VR601`},airline:{name:`Cabo Verde Airlines`},departure:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`3`,delay:0,timezone:`Atlantic/Cape_Verde`,scheduled:`2026-06-17T14:30:00+00:00`},arrival:{airport:`Lisbon Humberto Delgado`,iata:`LIS`,icao:`LPPT`,terminal:`T1`,gate:`A12`,delay:0,timezone:`Europe/Lisbon`,scheduled:`2026-06-17T18:45:00+00:00`}},{flight_date:`2026-06-17`,flight_status:`delayed`,flight:{number:`TP1492`},airline:{name:`TAP Air Portugal`},departure:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`1`,delay:55,timezone:`Atlantic/Cape_Verde`,scheduled:`2026-06-17T23:05:00+00:00`},arrival:{airport:`Lisbon Humberto Delgado`,iata:`LIS`,icao:`LPPT`,terminal:`T1`,gate:`B04`,delay:45,timezone:`Europe/Lisbon`,scheduled:`2026-06-17T03:20:00+00:00`}},{flight_date:`2026-06-17`,flight_status:`scheduled`,flight:{number:`AT931`},airline:{name:`Royal Air Maroc`},departure:{airport:`Mohammed V Intl`,iata:`CMN`,icao:`GMMN`,terminal:`T2`,gate:`F2`,delay:10,timezone:`Africa/Casablanca`,scheduled:`2026-06-17T01:15:00+00:00`},arrival:{airport:`Nelson Mandela Intl`,iata:`RAI`,icao:`GVNP`,terminal:`T1`,gate:`2`,delay:0,timezone:`Atlantic/Cape_Verde`,scheduled:`2026-06-17T04:20:00+00:00`}}].filter(t=>n?t.departure.iata===e:t.arrival.iata===e)}};function t(e,t){if(!e||!t)return``;try{let n=new Date,r=new Intl.DateTimeFormat(`en-US`,{timeZone:e,timeZoneName:`longOffset`}),i=new Intl.DateTimeFormat(`en-US`,{timeZone:t,timeZoneName:`longOffset`}),a=r.formatToParts(n),o=i.formatToParts(n),s=a.find(e=>e.type===`timeZoneName`).value,c=o.find(e=>e.type===`timeZoneName`).value,l=e=>{if(e===`GMT`)return 0;let t=e.match(/GMT([+-])(\d+)(?::(\d+))?/);if(!t)return 0;let[n,r,i,a]=t,o=parseInt(i,10)+(a?parseInt(a,10)/60:0);return r===`+`?o:-o},u=l(s),d=l(c)-u;return d===0?`Same time`:d>0?`+${d}h`:`${d}h`}catch(e){return console.warn(`Failed to calculate timezone delta contextually`,e),``}}var n=class{constructor(e,t){this.listContainer=document.getElementById(e),this.form=document.getElementById(t)}showLoading(){this.listContainer.innerHTML=`
            <div class="col-span-full flex flex-col items-center justify-center p-12 space-y-4">
                <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse">Intercepting live feeds...</p>
            </div>
        `}renderError(e){this.listContainer.innerHTML=`
            <div class="col-span-full bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <p class="text-red-400 font-mono text-sm">${e}</p>
            </div>
        `}renderFlights(e,n=!1){if(!e||e.length===0){this.listContainer.innerHTML=`
                <div class="col-span-full bg-[#153053]/20 border border-slate-800 rounded-xl p-8 text-center">
                    <p class="text-slate-400 font-medium font-mono text-xs">No commercial movements matching criteria.</p>
                </div>
            `;return}let r=e.map(e=>{let r=e.flight?.iata||e.flight?.number||`---`,i=e.airline?.name||`Unknown Carrier`,a=(e.flight_status||`scheduled`).toLowerCase(),o=e.flight_date||`---`,s=e.departure&&e.departure.iata!==null&&!e.arrival_board_active,c=s?e.departure:e.arrival,l=s?e.arrival:e.departure,u=l?.airport||`---`,d=l?.iata||`---`,f=c?.terminal||`---`,p=c?.gate||`---`,m=c?.delay||0,h=t(e.departure?.timezone||``,e.arrival?.timezone||``),g=h&&h!==`Same time`?`<span class="bg-slate-800 text-[9px] text-amber-400 px-1 py-0.2 rounded font-bold font-mono ml-1 border border-slate-700/60">${h}</span>`:``,_=e=>{let t=e?.scheduled||e?.estimated||``;if(!t)return`--:--`;try{return t.split(`T`)[1].substring(0,5)}catch{return`--:--`}},v=_(c),y=_(e.departure),b=_(e.arrival),x=`bg-blue-500/10 text-blue-400 border-blue-500/20`;return a===`active`||a===`landed`?x=`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`:a===`delayed`||m>0?x=`bg-amber-500/10 text-amber-400 border-amber-500/20`:a===`cancelled`&&(x=`bg-red-500/10 text-red-400 border-red-500/20`),n?`
                    <div class="col-span-full bg-[#112240] rounded-xl p-6 border border-blue-500/40 shadow-2xl space-y-5 max-w-2xl mx-auto w-full">
                        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                            <div>
                                <span class="text-xs font-mono text-blue-400 font-bold tracking-widest uppercase">Target Flight Tracked</span>
                                <h3 class="text-xl font-bold text-white font-mono">${r}</h3>
                                <p class="text-xs text-slate-400">${i} • ${o}</p>
                            </div>
                            <span class="text-xs font-bold px-3 py-1 rounded border ${x} uppercase font-mono tracking-wider">
                                ${a}
                            </span>
                        </div>

                        <div class="grid grid-cols-3 gap-4 items-center bg-[#0a192f]/80 p-4 rounded-xl border border-slate-800">
                            <div class="text-left">
                                <span class="text-[10px] font-mono text-slate-500 block uppercase">Departure</span>
                                <span class="text-lg font-bold text-white font-mono">${e.departure?.iata||`---`}</span>
                                <span class="text-xs text-amber-400 font-mono block mt-0.5">${y}Z</span>
                                <span class="text-[10px] text-slate-400 block truncate mt-1">${e.departure?.airport||`---`}</span>
                            </div>
                            
                            <div class="flex flex-col items-center">
                                <span class="text-base animate-pulse">✈️</span>
                                <div class="w-full border-t-2 border-dashed border-slate-700 my-1.5"></div>
                                <div class="flex items-center text-[10px] font-mono text-slate-500">
                                    <span>ROUTE</span>${g}
                                </div>
                            </div>

                            <div class="text-right">
                                <span class="text-[10px] font-mono text-slate-500 block uppercase">Arrival</span>
                                <span class="text-lg font-bold text-white font-mono">${e.arrival?.iata||`---`}</span>
                                <span class="text-xs text-emerald-400 font-mono block mt-0.5">${b}Z</span>
                                <span class="text-[10px] text-slate-400 block truncate mt-1">${e.arrival?.airport||`---`}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-xs font-mono bg-[#153053]/20 p-3 rounded-lg border border-slate-800/60">
                            <div>
                                <span class="text-slate-500 block">Departure Gate:</span>
                                <span class="text-slate-200">Terminal ${e.departure?.terminal||`---`} / Gate ${e.departure?.gate||`---`}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-slate-500 block">Arrival Gate:</span>
                                <span class="text-slate-200">Terminal ${e.arrival?.terminal||`---`} / Gate ${e.arrival?.gate||`---`}</span>
                            </div>
                        </div>
                    </div>
                `:`
                <div class="bg-[#112240] rounded-xl p-5 border border-slate-800/80 shadow-lg hover:border-blue-500/30 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4">
                  <div class="flex justify-between items-start">
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2 text-xs font-mono">
                        <span class="text-slate-400">${o}</span>
                        <span class="text-slate-600">•</span>
                        <span class="text-amber-400 font-bold tracking-wide">${v}</span>
                      </div>
                      <h4 class="text-base font-bold text-white tracking-tight leading-tight">${i}</h4>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${x} uppercase font-mono tracking-wider whitespace-nowrap shadow-sm">
                      ${a} ${m>0?`(+${m}m)`:``}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 bg-[#0a192f]/60 p-3 rounded-lg border border-slate-800/40 text-center items-center">
                    <div class="text-left pl-1">
                      <span class="text-[10px] uppercase font-bold text-slate-500 block font-mono">Flight</span>
                      <span class="font-mono text-sm text-blue-400 font-bold tracking-wide">${r}</span>
                    </div>
                    
                    <div class="flex flex-col items-center justify-center">
                      <span class="text-xs">${s?`🛫`:`🛬`}</span>
                      <div class="w-full border-t border-dashed border-slate-700 my-1"></div>
                      <div class="flex items-center justify-center">
                        <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                          ${s?`DEST`:`ORIG`}
                        </span>
                        ${g}
                      </div>
                    </div>

                    <div class="text-right pr-1">
                      <span class="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                        ${s?`To`:`From`}
                      </span>
                      <span class="font-mono text-sm text-white font-bold tracking-wide" title="${u}">${d}</span>
                    </div>
                  </div>

                  <div class="flex justify-between items-center text-xs font-mono text-slate-400 bg-[#153053]/20 px-3 py-2 rounded-md border border-slate-800/30">
                    <div class="truncate mr-2">
                      <span class="text-slate-500">${s?`Dest:`:`Orig:`}</span> 
                      <span class="text-slate-300 font-sans text-[12px] font-medium ml-0.5" title="${u}">${u}</span>
                    </div>
                    <div class="flex space-x-2 text-right flex-shrink-0 text-[11px]">
                      <span>T:<strong class="text-white font-bold ml-0.5">${f}</strong></span>
                      <span>G:<strong class="text-white font-bold ml-0.5">${p}</strong></span>
                    </div>
                  </div>
                </div>
            `}).join(``);this.listContainer.innerHTML=`
            <div class="${n?`w-full`:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`}">
                ${r}
            </div>
        `}},r=class{constructor(e){this.container=document.getElementById(e)}render(e,t){if(!e){this.container.innerHTML=`
                <div class="bg-[#112240] rounded-xl p-6 border border-slate-800 shadow-md">
                    <p class="text-amber-500 font-mono text-xs">Meteorological telemetry link offline.</p>
                </div>
            `;return}let n=e.station||`---`,r=e.raw||`No operational raw data streams.`,i=e.flight_rules||`VFR`,a=e.temperature?.value??`N/A`,o=e.dewpoint?.value??`N/A`,s=e.wind_speed?.value??0,c=e.wind_direction?.value??0,l=e.visibility?.value??`N/A`,u=`bg-blue-500/20 text-blue-400 border-blue-500/30`;i===`VFR`&&(u=`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`),i===`IFR`&&(u=`bg-red-500/10 text-red-400 border-red-500/20`);let d=``;d=t&&t.forecast&&Array.isArray(t.forecast)?`
                <div class="mt-5 pt-4 border-t border-slate-800">
                    <h4 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 font-mono">Aerodrome Forecast (TAF) — Upcoming Variations</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        ${t.forecast.slice(0,3).map(e=>{let t=e.start_time?.repr||e.start_time||`---`,n=e.wind_speed?.value??e.wind_speed??null,r=e.wind_direction?.value??e.wind_direction??0,i=n===null?`Variable / Light`:`${r}° @ ${n}KT`,a=e.flight_rules||`VFR`;return`
                    <div class="bg-[#0a192f]/40 p-2.5 rounded border border-slate-800 flex flex-col justify-between font-mono">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-bold text-amber-400">⏱️ From ${t.includes(`T`)?t.split(`T`)[1].substring(0,5):t}Z</span>
                            <span class="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-800 text-slate-300">${a}</span>
                        </div>
                        <p class="text-xs text-slate-300">Wind: <strong class="text-white">${i}</strong></p>
                    </div>
                `}).join(``)}
                    </div>
                    <code class="text-[10px] text-slate-500 block mt-2.5 break-words font-mono bg-[#0b192c]/50 p-2 rounded border border-slate-800/60">${t.raw||``}</code>
                </div>
            `:`
                <div class="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 italic font-mono">
                    TAF forecast unavailable for this aerodrome at this time.
                </div>
            `,this.container.innerHTML=`
          <div class="bg-[#112240] rounded-xl p-6 border border-slate-800 shadow-md">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center">
                <h3 class="text-xl font-bold text-white tracking-tight">Weather Report — ${n}</h3>
              </div>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded border ${u} font-mono tracking-wider">
                ${i}
              </span>
            </div>

            <div class="bg-[#0b192c] p-3 rounded border border-slate-800 mb-4">
              <code class="text-xs text-amber-400 block break-words font-mono">${r}</code>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-[#0f243e]/40 p-3 rounded border border-slate-800/50">
                <span class="text-slate-500 block text-[11px] uppercase font-bold font-mono">Wind</span>
                <span class="text-white font-medium font-mono">${c}° @ ${s} KT</span>
              </div>
              <div class="bg-[#0f243e]/40 p-3 rounded border border-slate-800/50">
                <span class="text-slate-500 block text-[11px] uppercase font-bold font-mono">Visibility</span>
                <span class="text-white font-medium font-mono">${l} SM</span>
              </div>
              <div class="bg-[#0f243e]/40 p-3 rounded border border-slate-800/50 col-span-2 md:col-span-1">
                <span class="text-slate-500 block text-[11px] uppercase font-bold font-mono">Temp / Dewpoint</span>
                <span class="text-white font-medium font-mono">${a}°C / ${o}°C</span>
              </div>
            </div>

            ${d}
          </div>
        `}},i=class{constructor(){this.storageKey=`aerodash_favorites`}getFavorites(){let e=localStorage.getItem(this.storageKey);return e?JSON.parse(e):[]}toggleFavorite(e){let t=e.trim().toUpperCase(),n=this.getFavorites(),r=n.indexOf(t);return r>-1?(n.splice(r,1),localStorage.setItem(this.storageKey,JSON.stringify(n)),!1):(n.push(t),localStorage.setItem(this.storageKey,JSON.stringify(n)),!0)}isFavorite(e){return this.getFavorites().includes(e.trim().toUpperCase())}},a=new e,o=new n(`dashboard-content`,`search-form`),s=new r(`weather-container`),c=new i,l=[],u=`departure`,d=``;async function f(e){let t=e.trim().toUpperCase().replace(/[^A-Z0-9]/g,``);if(!t){o.renderError(`Invalid Input: Please enter a valid alphanumeric Airport Code or Flight Number.`);return}if(d=t,/\d/.test(t))try{document.getElementById(`filter-controls`)?.classList.add(`hidden`),document.getElementById(`weather-container`).innerHTML=``;let e=await a.getFlightByNumber(t);o.renderFlights(e,!0)}catch(e){console.error(`Flight Track Error:`,e),o.renderError(`Tracking Link Error: Unable to locate active flight vectors for identifier ${t}.`)}else try{let e=await a.getAirportWeather(t);s.render(e.metar,e.taf),l=(await a.getAirportFlights(t,u)).map(e=>({...e,arrival_board_active:u===`arrival`})),o.renderFlights(l,!1),m(),document.getElementById(`filter-controls`)?.classList.remove(`hidden`)}catch(e){console.error(`Airport Board Error:`,e),document.getElementById(`filter-controls`)?.classList.add(`hidden`),o.renderError(`Operational Connection Failure: Unable to load telemetry for network node ${t}.`)}}function p(){let e=document.getElementById(`favorites-list`);if(!e)return;let t=c.getFavorites();if(t.length===0){e.innerHTML=`<span class="text-slate-600 italic font-mono">No nodes pinned. Click the star on a searched airport.</span>`;return}e.innerHTML=t.map(e=>`
        <button data-code="${e}" class="px-2.5 py-1 bg-[#153053] hover:bg-blue-600 text-slate-200 hover:text-white rounded font-mono font-bold transition-all border border-slate-700/50 shadow-sm flex items-center space-x-1">
           <span>📌</span> <span>${e}</span>
        </button>
    `).join(``),e.querySelectorAll(`button`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-code`),n=document.querySelector(`#search-form input[type="text"]`);n&&(n.value=t),o.showLoading(),f(t)})})}function m(){let e=document.querySelector(`#weather-container h3`);if(!e)return;let t=c.isFavorite(d),n=document.getElementById(`btn-favorite-toggle`);n||(n=document.createElement(`button`),n.id=`btn-favorite-toggle`,e.parentElement.appendChild(n)),n.className=`ml-3 px-3 py-1 text-xs rounded-md border font-medium font-mono transition-all ${t?`bg-amber-500/15 border-amber-500/40 text-amber-400`:`bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200`}`,n.innerHTML=t?`★ Pinned`:`☆ Pin Node`,n.onclick=e=>{e.preventDefault(),c.toggleFavorite(d),m(),p()}}function h(){let e=document.getElementById(`btn-departures`),t=document.getElementById(`btn-arrivals`),n=document.getElementById(`chk-delays-45`);e?.addEventListener(`click`,()=>{u=`departure`,e.classList.add(`bg-blue-600`,`text-white`),t?.classList.remove(`bg-blue-600`,`text-white`),g()}),t?.addEventListener(`click`,()=>{u=`arrival`,t.classList.add(`bg-blue-600`,`text-white`),e?.classList.remove(`bg-blue-600`,`text-white`),g()}),n?.addEventListener(`change`,e=>{if(e.target.checked){let e=l.filter(e=>((u===`departure`?e.departure:e.arrival)?.delay||0)>45);o.renderFlights(e)}else o.renderFlights(l,!1)})}function g(){let e=document.getElementById(`search-form`),t=e?.querySelector(`input[type="text"]`);t&&e.checkValidity()&&!/\d/.test(t.value)&&(o.showLoading(),f(t.value.trim().toUpperCase()))}document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`search-form`);e&&e.addEventListener(`submit`,t=>{t.preventDefault();let n=e.querySelector(`input[type="text"]`);n&&n.value.trim()!==``&&(o.showLoading(),f(n.value.trim().toUpperCase()))}),h(),p()});