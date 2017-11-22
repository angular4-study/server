# server
Node搭建的服务器，供angular4学习http调用

- 初始化：npm init -y  （-y表示默认创建package.json）
- 引入Node的ts类型定义文件：npm i @types/node --save
- 新建一个tsconfig.json文件，来告诉编译器如何将typeScript编译成javaScript。内容如下
```
{
  "compilerOptions": { // compilerOptions:编译器的配置
    "target": "es5", // 目标是编译成es5规范的
    "module": "commonjs", // 用的规范是commonjs
    "emitDecoratorMetadata": true, // 保留装饰器元数据
    "outDir": "build", // 编译完的js文件要放在build目录里
    "lib": ["es6"] // 声明当前开发的代码规范是es6
  },
  "exclude": [ // 排除：编译时忽略这些文件
    "node_modules"
  ]
}
```
- 配置完了后还需要让编译器知道，我要用这个配置文件，来编译我的代码。在languages & Frameworks里面
找typeScript，页面上找到compile模块，勾选  Enable TypeScript Compiler，再勾选 Use tsconfig.json，
保存即可。
- 启动编译过的js: node build/hello_server.js
- 安装express框架：npm install express --save
- 安装express类型定义文件： npm install @types/express --save
- 注意：在node服务器启动后，是不会自动加载变化文件的
- 安装node monitor：会监控你的代码，当代码更新后，会自动加载最新的代码,npm i -g nodemon
- 装好后，启动服务器不是用node，而是用nodemon启动

## WebSocket协议：
- 允许在同一个连接中，同时进行双方向的数据传递。
- 客户端和服务器都可以主动发送数据，而不需要明确的请求。
- 是一个长连接协议，不需要在每次发送和接收数据时，重建建立连接，所以延迟低，不需要每次请求时都携带一些
连接相关的信息。所以传递的数据比http少。
- Node生态圈中，有很多项目都实现了WebSocket协议，我们要使用的是ws
- 安装ws依赖库：npm install ws --save
- 安装类型文件：npm install @types/ws --save-dev