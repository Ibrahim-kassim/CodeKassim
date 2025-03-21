import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { CSSProperties } from "react";

type Props = {
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

export default function DeleteButton({ disabled, onClick, style }: Props) {
  return (
    <Button
      style={{ color: "black", ...style }}
      disabled={disabled}
      icon={<DeleteOutlined />}
      onClick={() => onClick && onClick()}
      danger
    ></Button>
  );
}
