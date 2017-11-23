"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
require("rxjs/add/operator/find");
require("rxjs/add/operator/map");
var app = express();
var Product = (function () {
    // 定义一个对象，存放产品信息，在构造函数中声明产品所拥有的属性
    function Product(id, // 主键
        title, // 标题
        price, // 价格
        rating, // 评分
        desc, // 描述
        categories // 类别
    ) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories; // 类别
    }
    return Product;
}());
exports.Product = Product;
var Comment = (function () {
    // 定义一个对象，存放评论信息，在构造函数中声明评论所拥有的属性
    function Comment(id, productId, // 产品id
        timestamp, // 评论时间
        user, // 用户名
        rating, // 评分
        content // 评论内容
    ) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content; // 评论内容
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, '第一个商品', 1.99, 3.0, '这是商品的第一个描述，是我在学习慕课网angular入门实战时创建的', ['电子产品', '硬件设备']),
    new Product(2, '第二个商品', 2.99, 4.0, '这是商品的第二个描述，是我在学习慕课网angular入门实战时创建的', ['图书']),
    new Product(3, '第三个商品', 3.99, 4.5, '这是商品的第三个描述，是我在学习慕课网angular入门实战时创建的', ['硬件设备']),
    new Product(4, '第四个商品', 4.99, 1.5, '这是商品的第四个描述，是我在学习慕课网angular入门实战时创建的', ['电子产品', '硬件设备']),
    new Product(5, '第五个商品', 5.99, 3.5, '这是商品的第五个描述，是我在学习慕课网angular入门实战时创建的', ['电子产品']),
    new Product(6, '第六个商品', 6.99, 2.5, '这是商品的第六个描述，是我在学习慕课网angular入门实战时创建的', ['图书'])
];
var comments = [
    new Comment(1, 1, '2017-11-01 11:05:00', '张三', 3, '东西1不错'),
    new Comment(2, 1, '2017-11-02 12:05:00', '李四', 4, '东西2不错'),
    new Comment(3, 1, '2017-11-03 13:05:00', '王五', 2, '东西3不错'),
    new Comment(4, 2, '2017-11-04 14:05:00', '赵六', 4, '东西4不错')
];
app.get('/', function (req, res) {
    res.send('hello express');
});
// 产品列表
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category !== '-1' && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
// 产品详情
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
// 产品评论
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log('服务器已启动，地址是http://localhost:8000');
});
//-----------------------------------------------------------------------------------------
var subscriptions = new Map(); // 储存每个客户端订阅的信息<ws，关注的商品id>
// WebSocket 服务器
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    // websocket.send('个消息是服务器主动推送的');
    websocket.on('message', function (message) {
        var messageObj = JSON.parse(message); // rs
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map(); // 储存每个商品的最新出价<商品id，最新价格>
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    // 两个入参顺序千万不能换
    subscriptions.forEach(function (productIds, ws) {
        // 生成一个已关注商品最新报价的数组 (将商品和最新报价，封装为一个对象)
        // console.log('server productIds', productIds);
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            // console.log('server new Bids:', newBids);
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
