import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

type Props = {
  onChange: (value: string) => void;
  placeholder: string;
  dataCy?: string;
};

export default function Search({
  onChange,
  placeholder,
  dataCy = "search-input",
}: Props) {
  return (
    <Input
      placeholder={placeholder}
      allowClear
      onChange={(e) => onChange(e.target.value)}
      className="!w-[250px]"
      suffix={<SearchOutlined />}
      data-cy={dataCy}
    />
  );
}
