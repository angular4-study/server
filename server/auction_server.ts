import * as express from 'express';
import {Server} from 'ws';

const app = express();

export class Product {
    // 定义一个对象，存放产品信息，在构造函数中声明产品所拥有的属性
    constructor(public id: number, // 主键
                public title: string, // 标题
                public price: number, // 价格
                public rating: number, // 评分
                public desc: string, // 描述
                public categories: Array<string> // 类别
    ) {

    }
}

export class Comment {
    // 定义一个对象，存放评论信息，在构造函数中声明评论所拥有的属性
    constructor(public id: number,
                public productId: number, // 产品id
                public timestamp: string, // 评论时间
                public user: string, // 用户名
                public rating: number, // 评分
                public content: string // 评论内容
    ) {

    }
}

const products: Product [] = [
    new Product(1, '第一个商品', 1.99, 3.0, '这是商品的第一个描述，是我在学习慕课网angular入门实战时创建的', ['电子产品', '硬件设备']),
    new Product(2, '第二个商品', 2.99, 4.0, '这是商品的第二个描述，是我在学习慕课网angular入门实战时创建的', ['图书']),
    new Product(3, '第三个商品', 3.99, 4.5, '这是商品的第三个描述，是我在学习慕课网angular入门实战时创建的', ['硬件设备']),
    new Product(4, '第四个商品', 4.99, 1.5, '这是商品的第四个描述，是我在学习慕课网angular入门实战时创建的', ['电子产品', '硬件设备']),
    new Product(5, '第五个商品', 5.99, 3.5, '这是商品的第五个描述，是我在学习慕课网angular入门实战时创建的', ['电子产品']),
    new Product(6, '第六个商品', 6.99, 2.5, '这是商品的第六个描述，是我在学习慕课网angular入门实战时创建的', ['图书'])
];

const comments: Comment [] = [
    new Comment(1, 1, '2017-11-01 11:05:00', '张三', 3, '东西1不错'),
    new Comment(2, 1, '2017-11-02 12:05:00', '李四', 4, '东西2不错'),
    new Comment(3, 1, '2017-11-03 13:05:00', '王五', 2, '东西3不错'),
    new Comment(4, 2, '2017-11-04 14:05:00', '赵六', 4, '东西4不错')
];

app.get('/', (req, res) => {
    res.send('hello express');
});

// 产品列表
app.get('/api/products', (req, res) => {
    let result = products;
    let params = req.query;

    if (params.title) {
        result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }
    if (params.price && result.length > 0) {
        result = result.filter((p) => p.price <= parseInt(params.price));
    }
    if (params.category !== '-1' && result.length > 0) {
        result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
    }
    res.json(result);
});

// 产品详情
app.get('/api/product/:id', (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});

// 产品评论
app.get('/api/product/:id/comments', (req, res) => {
    res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
});

const server = app.listen(8000, 'localhost', () => {
    console.log('服务器已启动，地址是http://localhost:8000');
});

// WebSocket
const wsServer = new Server({port: 8085});
wsServer.on('connection', websocket => {
    websocket.send('这个消息是服务器主动推送的');
});