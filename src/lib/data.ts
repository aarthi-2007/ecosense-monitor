// Zone and environmental data service

export interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface AQIReading {
  date: string;
  pm25: number;
  pm10: number;
  co: number;
  aqi: number;
  zone: string;
}

export interface WQIReading {
  date: string;
  ph: number;
  turbidity: number;
  dissolvedOxygen: number;
  wqi: number;
  zone: string;
}

export interface Prediction {
  date: string;
  aqiPredicted: number;
  wqiPredicted: number;
  zone: string;
}

export type StatusLevel = 'good' | 'moderate' | 'poor' | 'hazardous';

export const zones: Zone[] = [
  { id: 'zone-a', name: 'Downtown Industrial', lat: 28.6139, lng: 77.2090, description: 'Heavy industrial area' },
  { id: 'zone-b', name: 'Riverside District', lat: 28.6329, lng: 77.2195, description: 'Near river, mixed use' },
  { id: 'zone-c', name: 'Green Park Area', lat: 28.5921, lng: 77.2307, description: 'Residential with parks' },
  { id: 'zone-d', name: 'Highway Corridor', lat: 28.6280, lng: 77.1780, description: 'Major traffic route' },
  { id: 'zone-e', name: 'Suburban East', lat: 28.6508, lng: 77.2510, description: 'Suburban residential' },
];

const seed = (s: number) => {
  let v = s;
  return () => {
    v = (v * 16807) % 2147483647;
    return (v - 1) / 2147483646;
  };
};

export function generateHistoricalData(zoneId: string, days: number = 90) {
  const rng = seed(zoneId.charCodeAt(zoneId.length - 1) * 1000 + days);
  const zone = zones.find(z => z.id === zoneId);
  const baseAQI = zone?.id === 'zone-a' ? 160 : zone?.id === 'zone-d' ? 140 : zone?.id === 'zone-c' ? 60 : 100;
  const baseWQI = zone?.id === 'zone-b' ? 55 : zone?.id === 'zone-c' ? 85 : 70;

  const aqiData: AQIReading[] = [];
  const wqiData: WQIReading[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const seasonal = Math.sin((i / 365) * Math.PI * 2) * 20;
    const trend = (days - i) * 0.05;

    const aqi = Math.max(10, Math.min(400, Math.round(baseAQI + seasonal + (rng() - 0.5) * 60 + trend)));
    const pm25 = Math.round(aqi * 0.4 + rng() * 20);
    const pm10 = Math.round(aqi * 0.6 + rng() * 30);
    const co = +(aqi * 0.02 + rng() * 0.5).toFixed(2);

    aqiData.push({ date: dateStr, pm25, pm10, co, aqi, zone: zoneId });

    const wqi = Math.max(10, Math.min(100, Math.round(baseWQI + seasonal * 0.3 + (rng() - 0.5) * 20)));
    const ph = +(6.5 + rng() * 2).toFixed(1);
    const turbidity = +(1 + rng() * 8).toFixed(1);
    const dissolvedOxygen = +(4 + rng() * 6).toFixed(1);

    wqiData.push({ date: dateStr, ph, turbidity, dissolvedOxygen, wqi, zone: zoneId });
  }

  return { aqiData, wqiData };
}

export function getAQIStatus(aqi: number): StatusLevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'poor';
  return 'hazardous';
}

export function getWQIStatus(wqi: number): StatusLevel {
  if (wqi >= 80) return 'good';
  if (wqi >= 50) return 'moderate';
  if (wqi >= 25) return 'poor';
  return 'hazardous';
}

export function getStatusLabel(status: StatusLevel): string {
  return { good: 'Good', moderate: 'Moderate', poor: 'Poor', hazardous: 'Hazardous' }[status];
}

export function getStatusColor(status: StatusLevel): string {
  return {
    good: 'hsl(160, 84%, 45%)',
    moderate: 'hsl(45, 93%, 55%)',
    poor: 'hsl(0, 72%, 55%)',
    hazardous: 'hsl(280, 70%, 55%)',
  }[status];
}

// Simple linear regression for predictions
export function predictValues(data: number[], futureDays: number = 7): number[] {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += data[i]; sumXY += i * data[i]; sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predictions: number[] = [];
  for (let i = 0; i < futureDays; i++) {
    const val = slope * (n + i) + intercept + (Math.random() - 0.5) * 10;
    predictions.push(Math.max(10, Math.round(val)));
  }
  return predictions;
}

export function generatePredictions(zoneId: string): Prediction[] {
  const { aqiData, wqiData } = generateHistoricalData(zoneId, 30);
  const aqiValues = aqiData.map(d => d.aqi);
  const wqiValues = wqiData.map(d => d.wqi);
  const futureAQI = predictValues(aqiValues, 7);
  const futureWQI = predictValues(wqiValues, 7);

  const now = new Date();
  return futureAQI.map((aqi, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() + i + 1);
    return {
      date: date.toISOString().split('T')[0],
      aqiPredicted: aqi,
      wqiPredicted: Math.min(100, Math.max(10, futureWQI[i])),
      zone: zoneId,
    };
  });
}

export function getAlerts(zoneId: string): { message: string; level: StatusLevel; zone: string }[] {
  const { aqiData, wqiData } = generateHistoricalData(zoneId, 1);
  const alerts: { message: string; level: StatusLevel; zone: string }[] = [];
  const zone = zones.find(z => z.id === zoneId);
  const latest = aqiData[aqiData.length - 1];
  const latestWQI = wqiData[wqiData.length - 1];

  const aqiStatus = getAQIStatus(latest.aqi);
  if (aqiStatus === 'poor' || aqiStatus === 'hazardous') {
    alerts.push({ message: `Air Quality is ${getStatusLabel(aqiStatus)} in ${zone?.name} (AQI: ${latest.aqi})`, level: aqiStatus, zone: zoneId });
  }
  const wqiStatus = getWQIStatus(latestWQI.wqi);
  if (wqiStatus === 'poor' || wqiStatus === 'hazardous') {
    alerts.push({ message: `Water Quality is ${getStatusLabel(wqiStatus)} in ${zone?.name} (WQI: ${latestWQI.wqi})`, level: wqiStatus, zone: zoneId });
  }
  return alerts;
}
