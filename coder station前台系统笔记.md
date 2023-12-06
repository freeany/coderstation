# *coder station* 前台系统笔记



## 准备工作



1. **启动服务器**

首先从课件资料拿到服务器的项目目录coderstation-server(express+mongo)，进入项目根目录，安装依赖：

```js
npm i
```

启动服务器：

```js
npm start
```

如果看到控制台如下的输出：

```js
服务器端已启动，监听 7001 端口...
coderstation 数据库已经连接...
```

说明服务器已经启动成功。



2. **数据恢复**

在课件资料中，你还能看到提前准备好了一些数据，coderstationData，接下来可以将数据进行一个恢复。

首先需要你安装 *Mongodb*：*https://www.mongodb.com/*

https://juejin.cn/post/7052585815037673479

https://blog.csdn.net/weixin_46019681/article/details/125491883

*Mac* 系统建议放置到 /usr/local/mongodb

要启动 mongodb，需要 bin 目录下面的 mongod (当按照上述的方法安装之后，mongodb的所有命令都能直接使用了，比如mongod、mongorestore)

新版本的 mongodb，有一个特点就是 bin 目录下面的可执行文件大大减少，如果想要补全，需要自己去官网下载，下载下来是一个压缩包，解压就会得到一堆可执行文件，放入到 *Mongodb* 安装目录的 *bin* 目录下面



位置

```bash
mongodb的安装目录 /usr/local/mongodb
mongodb的配置文件位置 /usr/local/etc/mongod.conf  
```



启动 *Mongodb*，使用 *Mongod* 可执行文件

```js
mongod --config 配置文件地址
例如：
mongod --config /usr/local/etc/mongod.conf 
```

配置文件的内容如下：

```js
systemLog:
  destination: file # 日志输出方式。file/syslog,如果是file，需指定path，默认是输出到标准输出流中
  path: /usr/local/mongodb/mongod.log  # 日志路径
  logAppend: true # 启动时，日志追加在已有日志文件内还是备份旧日志后，创建新文件记录日志, 默认false

net:
  port: 27017 # 监听端口，默认27017
  bindIp: 127.0.0.1 # 绑定监听的ip，设置为127.0.0.1时，只会监听本机
  maxIncomingConnections: 65536 # 最大连接数，可接受的连接数还受限于操作系统配置的最大连接数
  wireObjectCheck: true # 校验客户端的请求，防止错误的或无效BSON插入,多层文档嵌套的对象会有轻微性能影响,默认true

processManagement:
  fork: true  # 后台运行

security:
  authorization: disabled  # enabled/disabled # 开启客户端认证

storage:
  dbPath: /usr/local/mongodb/data # 数据库地址
```

> 注意：*Windows* 下面自带配置文件，后缀为 cfg，然后还有就是 *windows* 下面的配置文件的格式会有一些区别



建议安装一个数据库可视化工具，这个自由选择：

- *robo3t*
- *stduio3t*：基础功能是免费的，*https://studio3t.com/*
- *compass*：mongo 官方推出的可视化工具
- *navicat*



我这里选择的是stduio3t， 注册的账号是谷歌账号

关于数据的恢复，这边需要使用到一个可执行命令，*mongorestore*，还需要保证 *mongodb* 的数据库服务器是启动起来的

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-09-064349.png" alt="image-20221109144349195" style="zoom:50%;" />

```js
这个就是把db文件导入到mongodb数据库中
mongorestore -h dbhost -d dbname --dir dbdirectory
例如：
mongorestore -h localhost:27017 -d coderstation --dir /Users/jie/Desktop/coderstationData
```

如果你在恢复数据的时候，名字取了其他名字，服务器那边也需要修改成对应的名字：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-09-064932.png" alt="image-20221109144932400" style="zoom:50%;" />



3. **数据接口**：*https://yapi.duyiedu.com/project/387/interface/api*







## 前台架子

1. 安装react-router-dom路由

2. ```jsx
   root.render(
     <BrowserRouter>
         <App />
     </BrowserRouter>
   );
   ```

3. 布局： 新建components文件夹新建NavHeader和PageFooter组件进行布局，并安装antd

   ```jsx
   npm i antd
   ```

4. 引入antd和中文语言包

   ```jsx
   // ...
   import "antd/dist/antd.min.css";
   import zhCN from "antd/es/locale/zh_CN"; // 中文语言包
   import { ConfigProvider } from "antd";
   root.render(
     <BrowserRouter>
       <ConfigProvider locale={zhCN}>
         <App />
       </ConfigProvider>
     </BrowserRouter>
   );
   ```

5. 新建css文件夹，创建App.css文件

6. App.jsx布局 头部/中间/底部这样的布局

   ```jsx
   import { Layout } from 'antd';
   import NavHeader from "./components/NavHeader";
   import PageFooter from "./components/PageFooter";
   import "./css/App.css";
   
   import RouterConfig from "./router/index.jsx"
   
   const { Header, Footer, Content } = Layout;
   
   function App() {
   
     return (
       <div className="App">
         {/* 头部 */}
         <Header className="header">
           <NavHeader />
         </Header>
         {/* 匹配上的路由页面 */}
         <Content className="content">
           <RouterConfig />
         </Content>
         {/* 底部 */}
         <Footer className="footer">
           <PageFooter />
         </Footer>
       </div>
     )
   
   }
   
   export default App;
   ```



## 项目细节

1. *Icon*

如果要使用 *Icon*，*Antd* 为我们提供了很多实用的 *Icon*，对应的地址为：*https://ant.design/components/icon/*

每一个 *Icon*，使用之前需要引入，例如：

```js
import { UserOutlined } from "@ant-design/icons";
```

2. 请求转发

在 *src* 目录下面新建一个 *setupProxy* 的文件，在该文件中进行请求转发的配置

在使用的时候，还需要安装一个插件 *http-proxy-middleware*，配置示例如下：

```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app){
    app.use(createProxyMiddleware("/res", {
        target: "http://127.0.0.1:7001",
        changeOrigin : true
    }),createProxyMiddleware("/api", {
        target: "http://127.0.0.1:7001",
        changeOrigin : true
    }),createProxyMiddleware("/static", {
        target: "http://127.0.0.1:7001",
        changeOrigin : true
    }))
}
```

3. 如何渲染出 *svg* 图片

之前在使用 *vue* 做个人博客的时候，如果想要渲染一段 *html* 或者 *svg*，需要使用 *v-html*

在 *react* 中，可以通过如下的方式：

```react
 <div dangerouslySetInnerHTML={{ __html: captcha }}></div>
```

