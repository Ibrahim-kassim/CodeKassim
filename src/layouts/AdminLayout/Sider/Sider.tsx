// src/components/Sider/Sider.tsx

import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  ProductOutlined
} from "@ant-design/icons";
import { ROUTES } from "../../../constants/routes";

const { Sider } = Layout;

const ROUTE_ITEMS = [
  {
    label: 'Overview',
    route: `${ROUTES.DASHBOARD}/${ROUTES.OVERVIEW}`,
    icon: <DashboardOutlined />,
  },
  {
    label: 'Categories',
    route: `${ROUTES.DASHBOARD}/${ROUTES.CATIGORIES}`,
    icon: <ShoppingOutlined />,
  },
  {
    label: 'Products',
    route: `${ROUTES.DASHBOARD}/${ROUTES.PRODUCTS}`,
    icon: <ProductOutlined />,
  },
];

type Props = {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
};

export default function CustomSider({ collapsed, onCollapse }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Normalize pathname to match route keys
  const normalizedPath = pathname.split("/").slice(1, 3).join("/");

  const handleClick = ({ key }: { key: string }) => {
    navigate(`/${key.replace(/^\//, "")}`); 
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="md"
      theme="light"
      width={220}
      collapsedWidth={70}
      style={{
        backgroundColor: "#fff",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      {/* Collapse/Expand Button */}
      <div className="flex justify-center items-center py-4">
        {collapsed ? (
          <MenuUnfoldOutlined
            onClick={() => onCollapse(false)}
            style={{ fontSize: 22, color: "red", cursor: "pointer" }}
          />
        ) : (
          <MenuFoldOutlined
            onClick={() => onCollapse(true)}
            style={{ fontSize: 22, color: "red", cursor: "pointer" }}
          />
        )}
      </div>
      {/* Updated Menu with items prop */}
      <Menu
        mode="inline"
        theme="light"
        onClick={handleClick}
        selectedKeys={[normalizedPath]} 
        style={{
          backgroundColor: "#fff",
          color: "red",
          fontWeight: "500",
        }}
        items={ROUTE_ITEMS.map(({ label, route, icon }) => ({
          key: route, // Key matches the URL path
          icon,
          label,
        }))}
      />
    </Sider>
  );
}
