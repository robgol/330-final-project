/**
 * @class AirportDashboard
 * @description UI Component architecture responsible for rendering dynamic flight data boards in English.
 */
import { calculateTimezoneDifference } from './utils.mjs';

export default class AirportDashboard {
  constructor(listContainerId, formId) {
    this.listContainer = document.getElementById(listContainerId);
    this.form = document.getElementById(formId);
  }

  showLoading() {
    this.listContainer.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center p-12 space-y-4">
                <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse">Intercepting live feeds...</p>
            </div>
        `;
  }

  renderError(message) {
    this.listContainer.innerHTML = `
            <div class="col-span-full bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <p class="text-red-400 font-mono text-sm">${message}</p>
            </div>
        `;
  }

  /**
   * Renders standard operational board or targeted track view based on payload flags.
   */
  renderFlights(flights, isSingleTrackView = false) {
    if (!flights || flights.length === 0) {
      this.listContainer.innerHTML = `
                <div class="col-span-full bg-[#153053]/20 border border-slate-800 rounded-xl p-8 text-center">
                    <p class="text-slate-400 font-medium font-mono text-xs">No commercial movements matching criteria.</p>
                </div>
            `;
      return;
    }

    const cardsHtml = flights.map(f => {
      const flightNum = f.flight?.iata || f.flight?.number || '---';
      const airline = f.airline?.name || 'Unknown Carrier';
      const status = (f.flight_status || 'scheduled').toLowerCase();
      const date = f.flight_date || '---';

      const isDepartureFlow = f.departure && f.departure.iata !== null && !f.arrival_board_active;

      const currentFlowData = isDepartureFlow ? f.departure : f.arrival;
      const routePartnerData = isDepartureFlow ? f.arrival : f.departure;

      const airportPartner = routePartnerData?.airport || '---';
      const iataPartner = routePartnerData?.iata || '---';

      const terminal = currentFlowData?.terminal || '---';
      const gate = currentFlowData?.gate || '---';
      const delay = currentFlowData?.delay || 0;

      const tzDep = f.departure?.timezone || '';
      const tzArr = f.arrival?.timezone || '';
      const tzDelta = calculateTimezoneDifference(tzDep, tzArr);
      const tzBadge = tzDelta && tzDelta !== 'Same time'
        ? `<span class="bg-slate-800 text-[9px] text-amber-400 px-1 py-0.2 rounded font-bold font-mono ml-1 border border-slate-700/60">${tzDelta}</span>`
        : '';

      const extractTime = (flowObj) => {
        const raw = flowObj?.scheduled || flowObj?.estimated || '';
        if (!raw) return '--:--';
        try { return raw.split('T')[1].substring(0, 5); } catch (e) { return '--:--'; }
      };

      const mainTime = extractTime(currentFlowData);
      const depTime = extractTime(f.departure);
      const arrTime = extractTime(f.arrival);

      let statusStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      if (status === 'active' || status === 'landed') {
        statusStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      } else if (status === 'delayed' || delay > 0) {
        statusStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      } else if (status === 'cancelled') {
        statusStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
      }

      // Custom Single Flight Tracking View Layout
      if (isSingleTrackView) {
        return `
                    <div class="col-span-full bg-[#112240] rounded-xl p-6 border border-blue-500/40 shadow-2xl space-y-5 max-w-2xl mx-auto w-full">
                        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                            <div>
                                <span class="text-xs font-mono text-blue-400 font-bold tracking-widest uppercase">Target Flight Tracked</span>
                                <h3 class="text-xl font-bold text-white font-mono">${flightNum}</h3>
                                <p class="text-xs text-slate-400">${airline} • ${date}</p>
                            </div>
                            <span class="text-xs font-bold px-3 py-1 rounded border ${statusStyle} uppercase font-mono tracking-wider">
                                ${status}
                            </span>
                        </div>

                        <div class="grid grid-cols-3 gap-4 items-center bg-[#0a192f]/80 p-4 rounded-xl border border-slate-800">
                            <div class="text-left">
                                <span class="text-[10px] font-mono text-slate-500 block uppercase">Departure</span>
                                <span class="text-lg font-bold text-white font-mono">${f.departure?.iata || '---'}</span>
                                <span class="text-xs text-amber-400 font-mono block mt-0.5">${depTime}Z</span>
                                <span class="text-[10px] text-slate-400 block truncate mt-1">${f.departure?.airport || '---'}</span>
                            </div>
                            
                            <div class="flex flex-col items-center">
                                <span class="text-base animate-pulse">✈️</span>
                                <div class="w-full border-t-2 border-dashed border-slate-700 my-1.5"></div>
                                <div class="flex items-center text-[10px] font-mono text-slate-500">
                                    <span>ROUTE</span>${tzBadge}
                                </div>
                            </div>

                            <div class="text-right">
                                <span class="text-[10px] font-mono text-slate-500 block uppercase">Arrival</span>
                                <span class="text-lg font-bold text-white font-mono">${f.arrival?.iata || '---'}</span>
                                <span class="text-xs text-emerald-400 font-mono block mt-0.5">${arrTime}Z</span>
                                <span class="text-[10px] text-slate-400 block truncate mt-1">${f.arrival?.airport || '---'}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-xs font-mono bg-[#153053]/20 p-3 rounded-lg border border-slate-800/60">
                            <div>
                                <span class="text-slate-500 block">Departure Gate:</span>
                                <span class="text-slate-200">Terminal ${f.departure?.terminal || '---'} / Gate ${f.departure?.gate || '---'}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-slate-500 block">Arrival Gate:</span>
                                <span class="text-slate-200">Terminal ${f.arrival?.terminal || '---'} / Gate ${f.arrival?.gate || '---'}</span>
                            </div>
                        </div>
                    </div>
                `;
      }

      // Standard Airport Board Grid Card Template
      return `
                <div class="bg-[#112240] rounded-xl p-5 border border-slate-800/80 shadow-lg hover:border-blue-500/30 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4">
                  <div class="flex justify-between items-start">
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2 text-xs font-mono">
                        <span class="text-slate-400">${date}</span>
                        <span class="text-slate-600">•</span>
                        <span class="text-amber-400 font-bold tracking-wide">${mainTime}</span>
                      </div>
                      <h4 class="text-base font-bold text-white tracking-tight leading-tight">${airline}</h4>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${statusStyle} uppercase font-mono tracking-wider whitespace-nowrap shadow-sm">
                      ${status} ${delay > 0 ? `(+${delay}m)` : ''}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 bg-[#0a192f]/60 p-3 rounded-lg border border-slate-800/40 text-center items-center">
                    <div class="text-left pl-1">
                      <span class="text-[10px] uppercase font-bold text-slate-500 block font-mono">Flight</span>
                      <span class="font-mono text-sm text-blue-400 font-bold tracking-wide">${flightNum}</span>
                    </div>
                    
                    <div class="flex flex-col items-center justify-center">
                      <span class="text-xs">${isDepartureFlow ? '🛫' : '🛬'}</span>
                      <div class="w-full border-t border-dashed border-slate-700 my-1"></div>
                      <div class="flex items-center justify-center">
                        <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                          ${isDepartureFlow ? 'DEST' : 'ORIG'}
                        </span>
                        ${tzBadge}
                      </div>
                    </div>

                    <div class="text-right pr-1">
                      <span class="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                        ${isDepartureFlow ? 'To' : 'From'}
                      </span>
                      <span class="font-mono text-sm text-white font-bold tracking-wide" title="${airportPartner}">${iataPartner}</span>
                    </div>
                  </div>

                  <div class="flex justify-between items-center text-xs font-mono text-slate-400 bg-[#153053]/20 px-3 py-2 rounded-md border border-slate-800/30">
                    <div class="truncate mr-2">
                      <span class="text-slate-500">${isDepartureFlow ? 'Dest:' : 'Orig:'}</span> 
                      <span class="text-slate-300 font-sans text-[12px] font-medium ml-0.5" title="${airportPartner}">${airportPartner}</span>
                    </div>
                    <div class="flex space-x-2 text-right flex-shrink-0 text-[11px]">
                      <span>T:<strong class="text-white font-bold ml-0.5">${terminal}</strong></span>
                      <span>G:<strong class="text-white font-bold ml-0.5">${gate}</strong></span>
                    </div>
                  </div>
                </div>
            `;
    }).join('');

    this.listContainer.innerHTML = `
            <div class="${isSingleTrackView ? 'w-full' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}">
                ${cardsHtml}
            </div>
        `;
  }
}