import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trendText?: string;
  trendIcon?: ReactNode;
  trendTextColor?: string;
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  title,
  value,
  icon,
  iconBgColor = "bg-indigo-50",
  iconColor = "text-indigo-600",
  trendText,
  trendIcon,
  trendTextColor = "text-slate-500",
  onClick,
  className = "",
}: KpiCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={`bg-white border-slate-200 shadow-sm h-[170px] flex flex-col ${onClick ? 'cursor-pointer hover:border-indigo-600 hover:shadow-md transition-all group' : ''} ${className}`}
    >
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start w-full">
          <div className="min-h-[40px]">
            <p className="text-sm font-medium text-slate-500 leading-tight pr-2">{title}</p>
          </div>
          <div className={`w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
            {icon}
          </div>
        </div>
        
        <div className="mt-auto">
          <p className={`text-3xl font-black leading-none ${onClick ? 'text-slate-900 group-hover:text-indigo-600 transition-colors' : 'text-slate-900'}`}>
            {value}
          </p>
        </div>

        <div className="mt-4 flex items-center text-sm min-h-[20px]">
          {trendIcon}
          {trendText && <span className={`${trendTextColor} font-medium ${trendIcon ? 'ml-1' : ''}`}>{trendText}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
