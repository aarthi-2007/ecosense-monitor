import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { zones, generateHistoricalData, getAQIStatus, getWQIStatus, getStatusColor } from '@/lib/data';

export default function ComparisonChart() {
  const data = zones.map(zone => {
    const { aqiData, wqiData } = generateHistoricalData(zone.id, 1);
    const latestAQI = aqiData[aqiData.length - 1].aqi;
    const latestWQI = wqiData[wqiData.length - 1].wqi;
    return { name: zone.name.split(' ')[0], AQI: latestAQI, WQI: latestWQI };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="text-foreground font-semibold mb-4">Zone Comparison</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} tickLine={false} />
          <Tooltip contentStyle={{ background: 'hsl(220, 18%, 12%)', border: '1px solid hsl(220, 14%, 22%)', borderRadius: 8, color: 'hsl(210, 20%, 92%)' }} />
          <Legend />
          <Bar dataKey="AQI" fill="hsl(200, 90%, 50%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="WQI" fill="hsl(160, 84%, 45%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
