// src/hooks/useOverviewData.ts
import {
  ShoppingCartOutlined,
  DollarCircleOutlined,
  UserOutlined,
  MessageOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useAllContacts } from "../queries/contactUs.query";
import { useAllOrders } from "../queries/order.query";
import { useAllProducts } from "../queries/products.query";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { ContactUs } from "../models/contactUs.model";

export const useOverviewData = () => {
  const {data:contacts} = useAllContacts();
  const {data:orders} = useAllOrders();
  const {data:products} = useAllProducts();

  // Calculate total messages across all contacts
  const totalMessages = ((contacts || []) as ContactUs[]).reduce((sum: number, contact: ContactUs) => 
    sum + (contact.messages?.length || 0), 0);

  // Calculate revenue from completed orders
  const revenue = ((orders || []) as Order[]).reduce((sum: number, order: Order) => {
    if (order.status === 'completed') {
      return sum + ((order.products || []) as Product[]).reduce((orderSum: number, product: Product) => 
        orderSum + (product.cost || 0), 0);
    }
    return sum;
  }, 0);

  // Calculate total cost of all products (inventory cost)
  const totalCost = ((products || []) as Product[]).reduce((sum: number, product: Product) => 
    sum + (product.cost || 0), 0);

  // Calculate profit (revenue - total cost)
  const profit = revenue - totalCost;

  const statsData = [
    { title: "Orders", value: orders?.length || 0, icon: ShoppingCartOutlined, color: "red" },
    { title: "Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarCircleOutlined, color: "green" },
    { title: "Clients", value: contacts?.length || 0, icon: UserOutlined, color: "blue" },
    { title: "Messages", value: totalMessages, icon: MessageOutlined, color: "orange" },
    { title: "Profits", value: `$${profit.toLocaleString()}`, icon: LineChartOutlined, color: "purple" },
  ];

  const salesData = [
    { month: "Jan", sales: 4000, revenue: 2400 },
    { month: "Feb", sales: 3000, revenue: 1398 },
    { month: "Mar", sales: 5000, revenue: 2210 },
    { month: "Apr", sales: 4780, revenue: 2908 },
    { month: "May", sales: 5890, revenue: 4000 },
    { month: "Jun", sales: 4390, revenue: 3800 },
    { month: "Jul", sales: 4490, revenue: 4300 },
  ];

  const recentOrders = [
    { key: "1", orderId: "#1234", customer: "John Doe", amount: "$120", status: "Completed" },
    { key: "2", orderId: "#1235", customer: "Jane Smith", amount: "$80", status: "Pending" },
    { key: "3", orderId: "#1236", customer: "Bob Johnson", amount: "$230", status: "Completed" },
    { key: "4", orderId: "#1237", customer: "Alice Williams", amount: "$150", status: "Cancelled" },
  ];

  return { statsData, salesData, recentOrders };
};
