# Aecos - 非遗传承电商平台

## 项目简介

Aecos是一个专注于非物质文化遗产传承的电商平台，旨在通过现代化的网络技术保护和推广中国传统文化。平台集成了产品展示、在线购物、工坊介绍、地图导览等功能，为用户提供全方位的非遗文化体验。

## 功能特性

### 🏠 首页展示
- 响应式设计，适配多种设备
- 非遗文化介绍和推广
- 快速导航到各个功能模块

### 🛍️ 商城系统
- 非遗产品展示和销售
- 产品分类和搜索功能
- 购物车管理
- 在线支付系统
- 订单管理

### 🏭 源创工坊
- 传统工艺工坊介绍
- 工匠信息展示
- 工艺制作流程展示

### 🗺️ 非遗导览
- 交互式地图展示
- 非遗文化地点标记
- 地理位置导航功能

### 👥 用户系统
- 用户注册和登录
- 个人中心管理
- 订单历史查看

### 🔧 管理后台
- 用户管理
- 产品管理
- 订单管理
- 系统设置

## 技术栈

### 前端技术
- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript** - 交互逻辑
- **响应式设计** - 适配移动端

### 后端技术
- **MySQL** - 数据库
- **PHP** - 后端逻辑（可选）

### 第三方服务
- 地图API - 地理位置服务
- 支付接口 - 在线支付功能

## 项目结构

```
Aecos/
├── index.html              # 首页
├── mall.html               # 商城页面
├── workshop.html           # 工坊页面
├── map_tour.html          # 地图导览
├── auth.html              # 登录注册
├── cart.html              # 购物车
├── payment_page.html      # 支付页面
├── admin_dashboard.html   # 管理后台
├── admin_users.html       # 用户管理
├── admin_orders.html      # 订单管理
├── admin_system.html      # 系统设置
├── product_detail_*.html  # 产品详情页
├── css/                   # 样式文件
│   ├── style.css         # 主样式
│   ├── cart.css          # 购物车样式
│   └── dashboard.css     # 后台样式
├── js/                    # JavaScript文件
│   ├── script.js         # 主脚本
│   ├── cart.js           # 购物车逻辑
│   └── payment_page.js   # 支付逻辑
├── images/                # 图片资源
├── Aecos.sql             # 数据库结构
└── china.json            # 地图数据
```

## 数据库设计

### 核心表结构
- **users** - 用户信息表
- **products** - 产品信息表
- **orders** - 订单表
- **order_items** - 订单详情表
- **cart_items** - 购物车表
- **workshops** - 工坊信息表
- **map_locations** - 地图位置表

## 安装和部署

### 环境要求
- Web服务器（Apache/Nginx）
- MySQL 5.7+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd Aecos
   ```

2. **配置数据库**
   ```bash
   # 创建数据库
   mysql -u root -p
   CREATE DATABASE aecos;
   USE aecos;
   
   # 导入数据库结构
   mysql -u root -p aecos < Aecos.sql
   ```

3. **配置Web服务器**
   - 将项目文件放置在Web服务器根目录
   - 确保文件权限正确

4. **访问网站**
   - 打开浏览器访问 `http://localhost/Aecos/`

## 使用指南

### 用户端
1. **浏览产品** - 在商城页面查看非遗产品
2. **注册登录** - 创建账户或登录现有账户
3. **购物流程** - 添加商品到购物车，完成支付
4. **地图导览** - 查看非遗文化地点分布

### 管理员端
1. **登录后台** - 使用管理员账户登录
2. **用户管理** - 管理用户账户和权限
3. **产品管理** - 添加、编辑、删除产品
4. **订单管理** - 查看和处理订单
5. **系统设置** - 配置网站参数

## 产品特色

平台展示的非遗产品包括：
- 🎨 非遗漆扇
- 🖼️ 刀笔油画
- 📖 云锦书签
- 🖼️ 甲马拓印
- 🧣 扎染方巾
- 🌸 非遗绒花
- ✂️ 非遗剪纸
- 🏺 新疆土陶

## 开发计划

### 已完成功能
- ✅ 基础页面结构
- ✅ 产品展示系统
- ✅ 购物车功能
- ✅ 用户认证系统
- ✅ 管理后台
- ✅ 地图导览

### 待开发功能
- 🔄 支付系统集成
- 🔄 用户评价系统
- 🔄 推荐算法
- 🔄 移动端APP
- 🔄 多语言支持

## 贡献指南

欢迎贡献代码和提出建议！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者：[vous-me]
- 邮箱：[tian7uio@qq.com]
- 项目地址：[GitHub地址]

## 致谢

感谢所有为非遗文化传承做出贡献的工匠和艺术家们！

