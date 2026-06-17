/**
 * @class AirportDashboard
 * @description Handles the operational dashboard user interface, user input listening, and data grid rendering.
 */
export default class AirportDashboard {
  constructor(listContainerId, searchFormId) {
    this.listContainer = document.getElementById(listContainerId);
    this.searchForm = document.getElementById(searchFormId);
    this.onSearchCallback = null;
  }

  /**
   * Initializes event listeners for the lookup search action
   */
  init(onSearch) {
    this.onSearchCallback = onSearch;

    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = this.searchForm.querySelector('input[type="text"]');
        if (input && input.value.trim() !== '') {
          this.showLoading();
          this.onSearchCallback(input.value.trim().toUpperCase());
        }
      });
    }
  }

  /**
   * Displays an animated spinner during async operations
   */
  showLoading() {
    this.listContainer.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-500 rounded-full" role="status"></div>
        <p class="text-slate-400 mt-2 font-medium">Processing real-time telemetry...</p>
      </div>
    `;
  }

  /**
   * Generates the tabular card list from the flight array object
   */
  renderFlights(flights) {
    if (!flights || flights.length === 0) {
      this.listContainer.innerHTML = `
        <div class="col-span-full bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
          <p class="text-slate-400">No commercial movements detected for this node.</p>
        </div>
      `;
      return;
    }

    const cardsHtml = flights.map(f => {
      const flightNum = f.flight?.number || '---';
      const airline = f.airline?.name || 'Unknown Carrier';
      const status = f.flight_status || 'scheduled';
      const date = f.flight_date || '---';
      const airport = f.departure?.airport || f.arrival?.airport || '---';
      const iata = f.departure?.iata || f.arrival?.iata || '---';
      const terminal = f.departure?.terminal || f.arrival?.terminal || 'Mnd';
      const gate = f.departure?.gate || f.arrival?.gate || '---';
      const delay = f.departure?.delay || f.arrival?.delay || 0;

      let statusClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      if (status === 'active') statusClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      if (status === 'delayed' || delay > 0) statusClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

      return `
        <div class="bg-[#153053] rounded-xl p-5 border border-slate-700/60 shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="text-xs font-mono tracking-wider text-slate-400 block">${date}</span>
                <h4 class="text-lg font-bold text-white tracking-tight">${airline}</h4>
              </div>
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded border ${statusClass} uppercase font-mono">
                ${status} ${delay > 0 ? `(+${delay}m)` : ''}
              </span>
            </div>
            
            <div class="text-sm space-y-1 text-slate-300">
              <p><span class="text-slate-400 font-medium">Flight:</span> <span class="font-mono text-white font-semibold">${flightNum}</span></p>
              <p><span class="text-slate-400 font-medium">Airport:</span> ${airport} (${iata})</p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-700/50 flex justify-between text-xs text-slate-400 font-mono">
            <span>Terminal: <strong class="text-white">${terminal}</strong></span>
            <span>Gate: <strong class="text-white">${gate}</strong></span>
          </div>
        </div>
      `;
    }).join('');

    this.listContainer.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cardsHtml}</div>`;
  }

  /**
   * Renders a clean, tactical error notification block inside the dynamic grid container.
   * @param {string} message - The contextual error message to exhibit
   */
  renderError(message) {
    this.listContainer.innerHTML = `
          <div class="col-span-full p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start space-x-3 shadow-md">
            <span class="text-xl">⚠️</span>
            <div>
              <h4 class="font-bold text-white text-base">Operational Alert</h4>
              <p class="text-sm mt-0.5 text-slate-300">${message}</p>
            </div>
          </div>
        `;
  }
}