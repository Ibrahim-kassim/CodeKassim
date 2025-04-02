// src/components/StatsCard.tsx
import React from "react";
import { Card, Statistic } from "antd";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";

type Props = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
};

const StatsCard: React.FC<Props> = ({ title, value, icon, color }) => {
  const IconComponent = icon;

  return (
    <Card className="shadow-lg rounded-lg">
      <div className="flex items-center space-x-4">
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: color, color: "white" }}
        >
          <IconComponent style={{ fontSize: "20px" }} />
        </div>
        <Statistic title={title} value={value} />
      </div>
    </Card>
  );
};

export default StatsCard;
