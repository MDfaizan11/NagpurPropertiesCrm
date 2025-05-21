import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "../StatisticCard/StatisticCard.css";

export default function StatisticCard({
  title,
  value,
  icon,
  change,
  color,
  isNegative = false,
}) {
  return (
    <div className={`statistic-card ${color}`}>
      <div className="statistic-icon-container">
        <div className="statistic-icon">{icon}</div>
      </div>
      <div className="statistic-content">
        <h3 className="statistic-title">{title}</h3>
        <div className="statistic-value">{value}</div>
        <div
          className={`statistic-change ${isNegative ? "negative" : "positive"}`}
        >
          {isNegative ? (
            <ArrowDownRight size={16} />
          ) : (
            <ArrowUpRight size={16} />
          )}
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}
