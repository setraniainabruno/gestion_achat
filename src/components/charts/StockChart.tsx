
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StockItem {
  nom: string;
  quantite: number;
  seuil: number;
}

interface StockChartProps {
  data: StockItem[];
  title?: string;
  description?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-background p-3 border rounded-lg shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-primary">Quantité: {item.value}</p>
        <p className="text-sm text-destructive">Seuil: {payload[1]?.value}</p>
      </div>
    );
  }

  return null;
};

export function StockChart({ data, title = "État des stocks", description, className }: StockChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="nom" 
              angle={-45} 
              textAnchor="end"
              tick={{ fontSize: 12 }}
              height={70}
              stroke="var(--muted-foreground)"
            />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quantite" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="seuil" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
