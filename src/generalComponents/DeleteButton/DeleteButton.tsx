import { DeleteOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import React from "react";

type Props = ButtonProps & {
  disabled?: boolean;
  style?: React.CSSProperties;
};

export default function DeleteButton({ disabled, onClick, style, ...props }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      e.stopPropagation(); // Prevent event bubbling
      onClick(e);
    }
  };

  return (
    <Button
      style={{ color: "black", ...style }}
      disabled={disabled}
      icon={<DeleteOutlined />}
      onClick={handleClick}
      danger
      {...props}
    />
  );
}
