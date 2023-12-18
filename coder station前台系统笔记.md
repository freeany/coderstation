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

5. 如何修改打包后的目录

由于我们的静态资源以 *static*，所以我们配置了请求转发，但是 *create-react-app*（基于 *webpack*）默认在打包应用的时候，也会将打包好的资源放置到 *static* 目录下，导致在加载打包好后的资源时，也会进行请求转发，从而报错。

我们需要做的是修改打包好后的目录。首先运行下面的命令：

```js
npm run eject
```

> 注意：弹射的时候要求 *git* 仓库不能有未提交的文件

弹射出来后，会多出来很多隐藏文件，我们就可以修改对应的配置，但是会有一个关于 *Babel* 的错误，最快的解决方案就是在 *package.json* 中删除如下的配置：

```js
"eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
},
```

接下来，在弹射出来的配置文件中，我们就可以修改 *webpack* 的打包配置：

*config/webpack.config.js* 的 *output* 对应的配置

```js
 filename: isEnvProduction
        ? 'assets/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'assets/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? 'assets/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'assets/js/[name].chunk.js',
      assetModuleFilename: 'assets/media/[name].[hash][ext]',
```



6. 关于 *redux* 中将异步获取到的数据填充到状态仓库

之前我们介绍了一种方式，是通过 *action* 来派发一个 *reducer* 从而实现状态填充。例如之前所写学生管理系统：

```js
export const getStuListAsync = createAsyncThunk(
  "stu/getStuListAsync",
  async (_, thunkApi) => {
    // 发送 ajax 请求
    const response = await getStuListApi();
    // 派发 action
    thunkApi.dispatch(initStuList(response.data));
  }
);
```

也可以使用 *redux-toolkit* 官网所示例的方式：

```js
export const getTypeList = createAsyncThunk(
    "type/getTypeList",
    async ()=>{
        const response = await getType();
        // 填充返回的数据到状态仓库
        return response.data;
    }
);

// ....

// 专门处理异步的 reducer
extraReducers : {
  // 这里就会有三种状态
  [getTypeList.fulfilled] : (state, { payload }) => {
    state.typeList = payload;
  }
}
```



7. 关于使用自定义图标字体

首先可以在 *iconfont* 上面下载你喜欢的图标字体：*https://www.iconfont.cn/*

选择了需要下载的图标字体后，添加到购物车，之后可以选择下载代码

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-11-064915.png" alt="image-20221111144914697" style="zoom:50%;" />

下载完成后，是一个压缩包，解压之后会得到一些 *CSS、JS、ttf* 一类的文件，首先我们需要将 *ttf* 字体文件添加到我们的项目中

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-11-065018.png" alt="image-20221111145017874" style="zoom:50%;" />

还需要将一些样式放置到我们的项目中，注意，需要将 *src* 中的 *url* 路径进行一下修改

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-11-065229.png" alt="image-20221111145228623" style="zoom:50%;" />

修改完之后，就可以在我们的代码中使用这些样式类，例如：

```html
<span class="iconfont iconfont-jiangbei"></span>
```



8. 在 *React* 中，如果想要设置多个类名样式，可以借助一个第三方的库，叫做 classnames，官方地址：*https://www.npmjs.com/package/classnames*



9. 关于 *markdown* 的编辑器

我们在项目中会频繁的使用到 *markdown* 的编辑器，我们使用的是 *toast-ui edior*，官网地址：*https://ui.toast.com/tui-editor/*

我们这一次会使用到的是 *react* 版本的编辑器，可以参阅如下链接：

- 关于 *react markdown* 编辑器的使用：*https://github.com/nhn/tui.editor/tree/master/apps/react-editor*
- 详细的配置项目：*https://nhn.github.io/tui.editor/latest/ToastUIEditor#focus*

大家在安装这个编辑器的时候，会遇到一个问题，如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-11-072713.png" alt="image-20221111152713064" style="zoom:50%;" />

该问题的出现是因为该插件内部仍然依赖 *React 17* 版本，解决方式也很简单，直接强制安装即可：

```js
npm install --save @toast-ui/react-editor --force
```

添加 *--force* 参数表示强制安装。



10. 关于使用 *toast-ui markdown editor* 时生成 *source map* 文件失败

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-11-120547.png" alt="image-20221111200546585" style="zoom:50%;" />

出现该问题的根源在于找不到 *purify.js.map* 文件，解决方案参考了 *https://github.com/nhn/tui.editor/issues/2137*

最直接的方案就是不生成 *sourcemap* 文件

```js
"start": "GENERATE_SOURCEMAP=false node scripts/start.js",
```



11. Cross-Origin Read Blocking (CORB) 已屏蔽 MIME 类型为 text/html 的跨域响应

![image-20221112105645409](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-12-025645.png)

参阅官网：

- *https://chromium.googlesource.com/chromium/src/+/refs/heads/main/services/network/cross_origin_read_blocking_explainer.md*
- *https://chromestatus.com/feature/5629709824032768*

简单来讲，这是一种新的 *Web* 平台安全功能，*CORB* 的目的是防止浏览器向网页接收某些跨源网络响应，因为这些响应可能包含敏感信息，而且现有的网页功能不需要这些响应。

**什么样的内容会被 *CORB-protected* ？**

当跨域请求回来的数据 *MIME type* 同跨域标签应有的 *MIME* 类型不匹配时，浏览器会启动 *CORB* 保护数据不被泄漏.
例如: *script* 标签请求的响应是 *json*. *img* 标签请求回来的是 *json*.

**如何解决？**

如果是请求我们自己的服务器出现这样的问题，那就调整服务器的 *MIME* 信息。

## 项目总结

- 没有什么比做一个实际项目让你对某一个技术更有信心（技术是否能够落地）
- 项目由于时间关系，里面可能会存在没有发现的 bug
  - 同学们尝试自己解决一下，然后反馈给我
  - 如果解决不了，直接反馈给我，我这边来处理
- 如果要将项目写入到自己简历里面，可以参阅下面的方式
  - 项目的描述
    - 项目本身的描述（我这是一个什么样的项目，项目提供了哪些功能，项目分为几个模块，每个模块大致是做什么的）
    - 采用的技术的描述（整个项目用到了什么技术栈，前端是什么技术栈，后端是什么技术栈）
  - 你自己在项目中的职责（你在这次项目中负责做了什么）
    - 负责还原 UI 设计师的设计稿
    - 负责使用 *Create-React-App* 搭建前台项目整体框架
    - 负责 xxx 模块的开发
    - ....

示例1:

![image-20221116113057984](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-16-033058.png)

示例2:

![image-20221116113141125](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-16-033141.png)

# *coder station* 后台管理系统笔记



## 项目准备

这一次项目会有一些前置知识需要学习：

- *Antd pro*
- *Dva*
- *UmiJS 4.0*



## 项目笔记



1. 如何修改项目的端口号

在项目根目录下面创建一个 *.env* 文件，之后就可以配置端口号之类的内容

参阅文档：*https://umijs.org/docs/guides/directory-structure#env*



2. 关于路由的配置，需要参阅 *Antd pro* 这个文档的“新增页面”部分的内容

文档：*https://pro.ant.design/zh-CN/docs/new-page*

如果想要某个页面不出现在左侧的导航栏中，可以配置 *hideInMenu:true*



3. 配置代理服务器直接在 *umirc.js* 中进行配置

文档：*https://umijs.org/docs/api/config#proxy*

例如：

```js
proxy : {
    "/api" : {
      target : "http://127.0.0.1:7001",
      changeOrigin : true,
    },
    "/static" : {
      target : "http://127.0.0.1:7001",
      changeOrigin : true,
    },
    "/res" : {
      target : "http://127.0.0.1:7001",
      changeOrigin : true,
    }
  },
```



4. 当我们使用 *antd* 里面的表格的时候，和 *Element-ui* 不同的是，在 *antd* 中的表格需要配置每一列

例如：

```js
// 对应表格每一列的配置
const columns = [{
  title : "登录账号",
  dataIndex : "loginId",
  key : "loginId",
  align : "center"
}];
```

具体请参阅文档：*https://ant.design/components/table-cn/#Column*

注意，在配置列的时候，有一些列选项是输属于 *procomponents* 新增的，所以有些属性我们需要参阅 *procomponents* 的文档

文档：

- *columns* 列定义：*https://procomponents.ant.design/components/table#columns-%E5%88%97%E5%AE%9A%E4%B9%89*

- *valueType* 对应的值：*https://procomponents.ant.design/components/schema#valuetype-%E5%88%97%E8%A1%A8*

如果是单纯的渲染某一个值，那么直接配置 *dataIndex* 即可，但是很多时候，我们是根据数据对应的值渲染成其他的东西，例如：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-18-064046.png" alt="image-20221118144046443" style="zoom:50%;" />

那么这个时候，咱们就需要使用到 *render*。

如果不要搜索，可以将搜索选项关闭：*search：false*



5. 设置全局的 *CSS* 样式

在 *src* 目录下面创建一个 *global.css* 的文件，该 *CSS* 文件就是一个全局的样式：

*https://umijs.org/docs/guides/directory-structure#globalcsslesssassscss*



6. 如何回填表单的值

我们在修改的时候，经常会涉及到回填表单的值，在 *ant design* 里面，使用 *setFieldsValue*

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-11-22-074057.png" alt="image-20221122154057171" style="zoom:50%;" />



7. 关于发送请求获取数据

有两种处理方式：

- 通过 *dispatch* 一个 *action* 到状态仓库，然后状态仓库来发请求，请求回来的数据放入到数据仓库中（管理员模块）
  - 适用于数据量不多
  - 多个组件要共享某一块数据
- 直接在组件里面请求数据
  - 数据量很大，在向服务器发送请求的时候，只能分页请求
  - 不需要和其他组件共享



8. 关于在 *ProTable* 组件中使用 *request* 发送请求

*ProTable* 有一个重要的属性叫做 *request*，该属性对应的值一般是一个异步函数，该异步函数自动接受一个 *params*，*params* 中会有默认的当前页码（*current*）和每一页的条数（*pageSize*），这两个值会有默认值，*current* 默认为 *1*，*pageSize* 默认为 *20*，可以通过配置 *pagination* 属性来修改 *current* 和 *pageSize* 的值

```js
<ProTable
  headerTitle="用户列表"
  pagination={{
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 15, 20],
    ...pagination,
    onChange: handlePageChange
  }}
  request={async (params) => {
    console.log(params);
  }}
/>
```



9. 刷新表格

获取到表格的实例（通过 *ref*），注意这里是 *actionRef*，然后调用 *reload* 方法

```react
<ProTable
  actionRef={tableRef}
 	...
/>
```

```js
tableRef.current.reload();
```

请参阅：*https://procomponents.ant.design/components/table/#actionref-%E6%89%8B%E5%8A%A8%E8%A7%A6%E5%8F%91*



10. 如何新增不再导航栏显示的页面

只需要一个配置项即可

```js
hideInMenu : true
```

更多的配置项，请参阅：*https://pro.ant.design/zh-CN/docs/new-page*



11. *Warning: Cannot update a component (`InternalFormItem`) while rendering a different component (`UserForm`).*

该警告出现的原因，是因为在初次渲染组件的时候，我们设置了数据的回填，导致组件初次还没有渲染完毕，又在更新

如何解决，也非常简单，我们等待第一次渲染完毕后再进行数据的回填，所以我们将回填的代码放入 *useEffect*

```js
useEffect(() => {
  if (formRef.current) {
    formRef.current.setFieldsValue(userInfo);
  }
}, [userInfo]);
```



12. 关于使用 *markdown* 编辑器做修改操作时光标跳转的问题

该问题的出现是因为对应的组件在重新渲染时，*markdown* 编辑器回填了数据多次

要解决这个问题也很简单，我们只需要设置一个状态值，第一次 *markdown* 回填了数据后，之后就不再让编辑器回填数据

```js
useEffect(()=>{
  if(formRef.current && firstIn && bookInfo){
    formRef.current.setFieldsValue(bookInfo);
    // 关键就是关于编辑器的回填
    editorRef.current.getInstance().setHTML(bookInfo?.bookIntro);
    // 将 firstIn 设置为 false
    setFirstIn(false);
  }
  if(formRef.current){
    formRef.current.setFieldsValue(bookInfo);
  }
},[bookInfo])
```



13. 关于登录页面的 Canvas 动画，使用到的是一个第三方库，叫做 *react-canvas-nest*

*https://www.npmjs.com/package/react-canvas-nest*

```react
<ReactCanvasNest
   config={{
   pointColor: '255, 0, 0',
   count: 66,
   follow: false,
   }}
   style={{ zIndex: 1 }}
/>
```



14. 配置初始化数据

在 umi 的运行时配置（*app.js/ts*）中，有一个叫做 *getInitialState* 方法，该方法可以配置一些初始化的数据，回头在其他组件中通过 *useModel* 来获取你返回的初始化数据

*https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81*

后台管理系统导航守卫逻辑如下：

```js
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  if (location.pathname === '/login') {
    // 强行跳登录页
    // 判断是否有有效的 token
    const token = localStorage.getItem('adminToken');
    if (token) {
      const result = await AdminController.getInfo();
      console.log(result, 'result');
      if (result.data) {
        // 不仅有 token，而且 token 是有效的
        // 不允许你去 login
        message.warning('请先退出后在登录');
        history.go(-1);
      }
    }
  } else {
    // 强行要跳内部页面
    const result = await AdminController.getInfo();
    if (result.data) {
      // 说明有 token，并且 token 有效
      // 获取该 id 对应的管理员信息
      const { data } = await AdminController.getAdminById(result.data._id);
      // 这里返回的就是一个全局的初始化数据
      // 之后各个组件都可以通过 useModel 获取到该初始数据
      return {
        name: data.nickname,
        avatar: data.avatar,
        adminInfo: data,
      };
    } else {
      // token 验证失败，跳转至登录
      // 失效可能是因为 token 过期，也有可能是因为压根儿就没有 token，不管有没有，删除掉原有的
      localStorage.removeItem("adminToken");
      location.href = "/login";
      message.warning('请重新登录');
    }
  }
}
```



15. 配置请求和响应拦截器也是在 *app.js/ts* 运行时配置中进行配置

*https://umijs.org/docs/api/runtime-config#request*

```js
export const request = {
  timeout : 3000,
  // 请求拦截器
  requestInterceptors: [function(url, options){
    // 从本地获取 token
    const token = localStorage.getItem("adminToken");
    if(token){
      options.headers['Authorization'] = "Bearer " + token;
    }
    return {url, options};
  }]
}
```



16. 退出登录

退出登录只需要在运行时配置文件 *app.js/ts* 的 *layout* 里面书写 *logout* 对应的回调函数逻辑即可：

```js
logout : ()=>{
  // 删除本地 token
  localStorage.removeItem("adminToken");
  // 跳转到登录页面
  location.href = "/login";
  message.success('退出登录成功');
}
```



17. 关于权限

*https://umijs.org/docs/max/access*

首先需要在构建时配置文件 *umirn.js/ts* 中启动 *access*，之后在 *src* 目录下面创建一个 *access.js/ts* 文件

接下来在路由配置中，为每一个路由配置对应权限，例如：

```js
{
  name: '首页',
  path: '/home',
  component: './Home',
  icon : "HomeOutlined",
  access : "NormalAdmin"  // 普通管理员能够访问
},
{
  name : "管理员",
  path : "/admin",
  icon: 'UserOutlined',
  access : "SuperAdmin",  // 超级管理员能够访问
  ...
},
```

最后在 *access.js* 文件中，根据登录的账户的 *permission* 来确定返回的对象

```js
// 在该函数中，我们需要返回一个对象，对象里面对应一个一个权限项目，每个权限项目对应的值是一个布尔值
// true 代表有权限 false 代表没有权限

// 假设现在是超管登录 adminInfo.permission ---> 1
// { SuperAdmin : true, NormalAdmin : true}
// 假设现在登录的是普通管理员 adminInfo.permission ---> 2
// { SuperAdmin : false, NormalAdmin : true}

if (initialState) {
  return {
    SuperAdmin: initialState.adminInfo.permission === 1,
    NormalAdmin:
    initialState.adminInfo.permission === 1 ||
    initialState.adminInfo.permission === 2,
  };
} else {
  return {
    SuperAdmin : false, 
    NormalAdmin : false
  }
}
```

针对页面中某一块区域如果要设置权限，那么可以通过 *useAccess* *hook* 函数获取到当前的权限对象（*access.js* 中我们返回的对象）

之后通过 *Access* 组件包裹有权限的区域，设置 *accessible* 属性即可

```react
<Access accessible={access.SuperAdmin}>
 	//...
</Access>
```



18. 在页面中获取全局初始化数据

可以通过 *useModel* 来进行获取，示例如下：

```js
const { initialState } = useModel("@@ininitialState");
```



19. 关于首页的 Echarts

*https://umijs.org/docs/max/charts*

首先安装 *Echart* 相关的依赖：

```js
npm install @ant-design/charts
```

之后引入对应的图表，做好数据配置，直接使用即可。

具体可以使用的图表类型可以参阅：*https://charts.ant.design/*



20. *mf-dep____vendor.0d0d1aca.js:389066 Warning: [antd: Dropdown] `overlay` is deprecated. Please use `menu` instead.*

该问题是 *umi.js* 内部的问题，并非我们的代码，随着 *umi.js* 的升级，期望后期官方能够修复这个问题。

可以参阅：*https://github.com/ant-design/pro-components/issues/6162*

关于运行时配置中，*layout* 能够配置的项目，可以参阅：*https://procomponents.ant.design/components/layout/#prolayout*



## 项目总结

- *dva*
- *antd* 组件库以及 *antd pro* 后台集成方案
- *umi.js 4.x*

整个项目使用到的是 *react* 技术栈，前端路由使用到了 *react-router*，数据流方案采用的是基于 *redux* 和 *redux-saga* 的 *dva*，整体项目框架采用 *umijs.4.x* 搭建，里面使用到了 *antd pro* 后台集成解决方案。

