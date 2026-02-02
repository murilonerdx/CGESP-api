export interface WeatherPeriod {
    period: string;
    condition: string;
    potential: string;
    image: string;
    title: string;
}

export interface CgeData {
    forecast: {
        date: string;
        year: string;
        minTemp: string;
        maxTemp: string;
        minHumidity: string;
        maxHumidity: string;
        periods: WeatherPeriod[];
    };
    floodPoints: {
        active: number;
        transitable: string;
        intransitable: string;
        totalToday: string;
        details?: any[]; // Zones with pints
    };
    news: {
        title: string;
        dateTime: string;
        link: string;
    }[];
}

export interface FloodPointDetail {
    status: string;
    statusClass: string;
    timeRange: string;
    street: string;
    direction: string;
    reference: string;
}

export interface NeighborhoodFlood {
    name: string;
    totalPoints: string;
    points: FloodPointDetail[];
}

export interface ZoneFlood {
    name: string;
    neighborhoods: NeighborhoodFlood[];
}

export interface FloodDetailsResponse {
    zones: ZoneFlood[];
    summary: {
        active: { transitable: string; intransitable: string };
        inactive: { transitable: string; intransitable: string };
    };
}
