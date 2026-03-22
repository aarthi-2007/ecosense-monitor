import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AQIReading, WQIReading, Prediction } from '@/lib/data';

interface TrendChartProps {
  aqiData: AQIReading[];
  wqiData: WQIReading[];
  predictions?: Prediction[];
  title: string;
}

export default function TrendChart({ aqiData, wqiData, predictions, title }: TrendChartProps) {
  const combined = aqiData.map((a, i) => ({
    date: a.date.slice(5),
    AQI: a.aqi,
    WQI: wqiData[i]?.wqi ?? 0,
  }));

  if (predictions) {
    predictions.forEach(p => {
      combined.push({ date: p.date.slice(5), AQI: p.aqiPredicted, WQI: p.wqiPredicted });
    });
  }

  // Show last 30 + predictions
  const display = combined.slice(-37);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card p-5"
    >
      <h3 className="text-foreground font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={display}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="date" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'hsl(220, 18%, 12%)', border: '1px solid hsl(220, 14%, 22%)', borderRadius: 8, color: 'hsl(210, 20%, 92%)' }}
          />
          <Legend />
          <Line type="monotone" dataKey="AQI" stroke="hsl(200, 90%, 50%)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="WQI" stroke="hsl(160, 84%, 45%)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
