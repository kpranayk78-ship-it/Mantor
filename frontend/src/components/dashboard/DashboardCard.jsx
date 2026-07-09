import React from "react";

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}) {
  const colors = {
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    red: "border-red-500",
  };

  return (
    <div
      className={`bg-industrial-900 rounded-xl border-l-4 ${colors[color]} p-5 shadow-md`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-industrial-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-industrial-100 mt-2">
            {value}
          </h2>

          {subtitle && (
            <p className="text-industrial-500 text-xs mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="text-3xl text-industrial-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}