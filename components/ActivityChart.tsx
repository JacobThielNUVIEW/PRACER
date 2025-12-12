
import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { CHART_DATA } from '../constants';

const ActivityChart: React.FC = () => {
  return (
    // Explicit inline style ensures height is present before CSS loads
    <div className="w-full font-sans" style={{ height: 300, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={CHART_DATA}
          margin={{
            top: 10,
            right: 10,
            bottom: 0,
            left: -20,
          }}
        >
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#007BFF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#007BFF" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E9ECEF" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }} 
            dy={10}
          />
          {/* Volume Axis (Left) */}
          <YAxis 
            yAxisId="left"
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
          />
          {/* Intensity/Pace Axis (Right) */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false} 
            tickLine={false}
            domain={[4, 6]} // Approx pace range 4:00 - 6:00
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            tickFormatter={(val) => `${val}:00`}
          />
          
          <Tooltip 
            cursor={{ stroke: '#007BFF', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: '#FFFFFF',
              fontFamily: 'Inter',
              fontSize: '12px'
            }}
          />
          
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />

          {/* Training Volume Bar */}
          <Bar 
            yAxisId="left"
            dataKey="volume" 
            name="Volume (km)" 
            fill="url(#colorVolume)" 
            barSize={16}
            radius={[4, 4, 0, 0]}
          />

          {/* VDOT / Intensity Line */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="pace" 
            name="Avg Pace" 
            stroke="#FFD700" 
            strokeWidth={2}
            dot={{ r: 3, fill: '#FFD700', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />

          {/* Reference Line for Race Day */}
          <ReferenceLine 
            x="W6" 
            stroke="#DC3545" 
            strokeDasharray="3 3" 
            label={{ position: 'top', value: 'RACE', fill: '#DC3545', fontSize: 9, fontWeight: 'bold' }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
