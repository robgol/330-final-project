import '../css/main.css';
import ExternalAviationServices from './ExternalAviationServices.mjs';
import AirportDashboard from './AirportDashboard.mjs';
import WeatherProcessor from './WeatherProcessor.mjs';

// Declaração das variáveis de controlo no âmbito global do módulo
let apiService;
let dashboard;
let weatherProcessor;
let currentFlights = [];
let currentFilterType = 'departure';

/**
 * Main coordinator for lookup validation and rendering
 */
async function handleAirportSearch(airportIata) {
    const cleanInput = airportIata.trim().toUpperCase();
    const aviationCodeRegex = /^[A-Z]{3,4}$/;

    if (!aviationCodeRegex.test(cleanInput)) {
        document.getElementById('weather-container').innerHTML = '';
        document.getElementById('filter-controls')?.classList.add('hidden');
        dashboard.renderError('Invalid airport code format. Please enter a valid 3-letter IATA (e.g., RAI) or 4-letter ICAO (e.g., GVNP) code containing only letters.');
        return;
    }

    try {
        // Procurar e renderizar a meteorologia (AVWX)
        const weatherData = await apiService.getAirportWeather(cleanInput);
        weatherProcessor.render(weatherData);

        // Procurar os dados de voo com base no tipo ativo (Partidas/Chegadas)
        currentFlights = await apiService.getAirportFlights(cleanInput, currentFilterType);

        // Renderizar a lista de cartões usando o módulo UI
        dashboard.renderFlights(currentFlights);

        // Revelar a barra de controlos de filtros
        document.getElementById('filter-controls')?.classList.remove('hidden');

    } catch (error) {
        console.error('Erro ao processar dados aeronáuticos:', error);

        document.getElementById('weather-container').innerHTML = '';
        document.getElementById('filter-controls')?.classList.add('hidden');

        dashboard.renderError(`Operational Connection Failure: Unable to load telemetry for network node ${cleanInput}. Please verify the code and try again.`);
    }
}

/**
 * Configuração dos escutadores de eventos para os Filtros Dinâmicos
 */
function setupFilterListeners() {
    const btnDepartures = document.getElementById('btn-departures');
    const btnArrivals = document.getElementById('btn-arrivals');
    const chkDelays = document.getElementById('chk-delays-45');

    btnDepartures?.addEventListener('click', () => {
        currentFilterType = 'departure';
        btnDepartures.classList.add('bg-blue-600', 'text-white');
        btnArrivals?.classList.remove('bg-blue-600', 'text-white');
        triggerRefetch();
    });

    btnArrivals?.addEventListener('click', () => {
        currentFilterType = 'arrival';
        btnArrivals.classList.add('bg-blue-600', 'text-white');
        btnDepartures?.classList.remove('bg-blue-600', 'text-white');
        triggerRefetch();
    });

    chkDelays?.addEventListener('change', (e) => {
        if (e.target.checked) {
            const delayedFlights = currentFlights.filter(f => {
                const delay = f.departure?.delay || f.arrival?.delay || 0;
                return delay > 45;
            });
            dashboard.renderFlights(delayedFlights);
        } else {
            dashboard.renderFlights(currentFlights);
        }
    });
}

function triggerRefetch() {
    const input = document.querySelector('#search-form input[type="text"]');
    if (input && input.value.trim() !== '') {
        dashboard.showLoading();
        handleAirportSearch(input.value.trim().toUpperCase());
    }
}

// Inicializar de forma segura garantindo que o DOM está mapeado
document.addEventListener('DOMContentLoaded', () => {
    console.log("Aviation Dashboard Lifecycle Hooked.");

    // Instanciar os serviços APENAS quando o DOM estiver pronto
    apiService = new ExternalAviationServices();
    dashboard = new AirportDashboard('dashboard-content', 'search-form');
    weatherProcessor = new WeatherProcessor('weather-container');

    // Inicializar o escutador do formulário e filtros
    dashboard.init(handleAirportSearch);
    setupFilterListeners();
});