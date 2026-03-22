import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Brain, MapPin } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import MetricCard from '@/components/MetricCard';
import TrendChart from '@/components/TrendChart';
import ComparisonChart from '@/components/ComparisonChart';
import PredictionCard from '@/components/PredictionCard';
import AlertBanner from '@/components/AlertBanner';
import ZoneMap from '@/components/ZoneMap';
import ParameterDetails from '@/components/ParameterDetails';
import StatusBadge from '@/components/StatusBadge';
import { generateHistoricalData, generatePredictions, getAlerts, getAQIStatus, getWQIStatus, zones } from '@/lib/data';

export default function Dashboard() {
  const [selectedZone, setSelectedZone] = useState('zone-a');
  const [timePeriod, setTimePeriod] = useState('daily');

  const days = timePeriod === 'daily' ? 30 : timePeriod === 'weekly' ? 90 : 365;

  const { aqiData, wqiData } = useMemo(() => generateHistoricalData(selectedZone, days), [selectedZone, days]);
  const predictions = useMemo(() => generatePredictions(selectedZone), [selectedZone]);
  const allAlerts = useMemo(() => zones.flatMap(z => getAlerts(z.id)), []);

  const latestAQI = aqiData[aqiData.length - 1];
  const latestWQI = wqiData[wqiData.length - 1];
  const zone = zones.find(z => z.id === selectedZone)!;

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <DashboardHeader
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          timePeriod={timePeriod}
          onTimePeriodChange={setTimePeriod}
        />

        {allAlerts.length > 0 && (
          <div className="mb-6">
            <AlertBanner alerts={allAlerts} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Air Quality Index"
            value={latestAQI.aqi}
            unit="AQI"
            status={getAQIStatus(latestAQI.aqi)}
            icon={<Wind className="w-5 h-5" />}
            subtitle={zone.name}
            delay={0}
          />
          <MetricCard
            title="Water Quality Index"
            value={latestWQI.wqi}
            unit="WQI"
            status={getWQIStatus(latestWQI.wqi)}
            icon={<Droplets className="w-5 h-5" />}
            subtitle={zone.name}
            delay={0.1}
          />
          <MetricCard
            title="AQI Forecast"
            value={predictions[0]?.aqiPredicted ?? 0}
            unit="Tomorrow"
            status={getAQIStatus(predictions[0]?.aqiPredicted ?? 0)}
            icon={<Brain className="w-5 h-5" />}
            subtitle="ML Prediction"
            delay={0.2}
          />
          <MetricCard
            title="Zones Monitored"
            value={zones.length}
            unit="Active"
            status="good"
            icon={<MapPin className="w-5 h-5" />}
            subtitle="All online"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <TrendChart
            aqiData={aqiData}
            wqiData={wqiData}
            predictions={predictions}
            title={`${zone.name} — Trend & Forecast`}
          />
          <ComparisonChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ZoneMap selectedZone={selectedZone} onSelectZone={setSelectedZone} />
          <PredictionCard predictions={predictions} />
        </div>

        <ParameterDetails aqi={latestAQI} wqi={latestWQI} />
      </div>
    </div>
  );
}
