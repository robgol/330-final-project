export default class ExternalAviationServices {
    constructor() {
        // Stable public testing API that accepts local connections
        this.baseUrl = 'https://jsonplaceholder.typicode.com/posts';
    }

    async getLiveAviationData() {
        try {
            const response = await fetch(this.baseUrl);

            if (!response.ok) {
                throw new Error(`Network error: ${response.status}`);
            }

            const data = await response.json();

            // Map mock data to the structure expected by main.js
            return data.slice(0, 6).map(post => ({
                properties: {
                    severity: 'Minor',
                    event: `Flight Data Node #${post.id}`,
                    headline: post.title,
                    senderName: 'Civil Aviation Authority System'
                }
            }));
        } catch (error) {
            console.error("Error fetching data from external API:", error);
            throw error;
        }
    }
}