// src/layouts/AdminLayout.tsx
import  { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import CustomSider from "./Sider/Sider";


export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-screen">
      <CustomSider collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout
        style={{
          backgroundColor: "#fff",
        }}
      >
        <Layout.Content
          style={{
            padding: "24px",
            backgroundColor: "#fff",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
