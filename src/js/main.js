import '../css/main.css';
import ExternalAviationServices from './ExternalAviationServices.mjs';
import AirportDashboard from './AirportDashboard.mjs';
import WeatherProcessor from './WeatherProcessor.mjs';

// 1. Inicializar o serviço de dados e os componentes de UI
const apiService = new ExternalAviationServices();
const dashboard = new AirportDashboard('dashboard-content', 'search-form');
const weatherProcessor = new WeatherProcessor('weather-container');

// Estado local da aplicação para gerir os filtros em memória
let currentFlights = [];
let currentFilterType = 'departure'; // 'departure' ou 'arrival'

/**
 * Coordenador principal de busca e renderização
 * @param {string} airportIata - Código do aeroporto introduzido pelo utilizador
 */
async function handleAirportSearch(airportIata) {
    const mainDisplay = document.getElementById('dashboard-content');

    try {
        // 2. Procurar e renderizar a meteorologia (AVWX)
        const weatherData = await apiService.getAirportWeather(airportIata);
        weatherProcessor.render(weatherData);

        // 3. Procurar os dados de voo com base no tipo ativo (Partidas/Chegadas)
        currentFlights = await apiService.getAirportFlights(airportIata, currentFilterType);

        // 4. Renderizar a lista de cartões usando o módulo UI
        dashboard.renderFlights(currentFlights);

        // Revelar a barra de controlos de filtros (caso estivesse escondida)
        document.getElementById('filter-controls')?.classList.remove('hidden');

    } catch (error) {
        console.error('Erro ao processar dados aeronáuticos:', error);

        // Tratamento visual de erros conforme os padrões exigidos
        mainDisplay.innerHTML = `
      <div class="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg col-span-full">
        <h2 class="font-bold">Operational Connection Failure</h2>
        <p class="text-sm mt-1">Unable to load telemetry for network node ${airportIata}. Please verify the code and try again.</p>
      </div>
    `;
    }
}

/**
 * Configuração dos escutadores de eventos para os Filtros Dinâmicos
 */
function setupFilterListeners() {
    const btnDepartures = document.getElementById('btn-departures');
    const btnArrivals = document.getElementById('btn-arrivals');
    const chkDelays = document.getElementById('chk-delays-45');

    // Alternar para Fluxo de Partidas
    btnDepartures?.addEventListener('click', () => {
        currentFilterType = 'departure';
        btnDepartures.classList.add('bg-blue-600', 'text-white');
        btnArrivals?.classList.remove('bg-blue-600', 'text-white');

        triggerRefetch();
    });

    // Alternar para Fluxo de Chegadas
    btnArrivals?.addEventListener('click', () => {
        currentFilterType = 'arrival';
        btnArrivals.classList.add('bg-blue-600', 'text-white');
        btnDepartures?.classList.remove('bg-blue-600', 'text-white');

        triggerRefetch();
    });

    // Filtro Avançado em Memória: Atrasos > 45 minutos (Desafio de Manipulação de Arrays JSON)
    chkDelays?.addEventListener('change', (e) => {
        if (e.target.checked) {
            const delayedFlights = currentFlights.filter(f => {
                const delay = f.departure?.delay || f.arrival?.delay || 0;
                return delay > 45;
            });
            dashboard.renderFlights(delayedFlights);
        } else {
            // Restaura o estado original guardado localmente sem sobrecarregar a API
            dashboard.renderFlights(currentFlights);
        }
    });
}

/**
 * Auxiliar para relançar a busca quando o utilizador muda o sentido do tráfego (Partidas/Chegadas)
 */
function triggerRefetch() {
    const input = document.querySelector('#search-form input[type="text"]');
    if (input && input.value.trim() !== '') {
        dashboard.showLoading();
        handleAirportSearch(input.value.trim().toUpperCase());
    }
}

// Inicializar a aplicação assim que a árvore DOM estiver totalmente segura
document.addEventListener('DOMContentLoaded', () => {
    console.log("Aviation Dashboard Lifecycle Hooked.");

    // Passa a função coordenadora para dentro da classe gerir o submit
    dashboard.init(handleAirportSearch);
    setupFilterListeners();
});