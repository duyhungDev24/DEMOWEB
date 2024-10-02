import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Đảm bảo bạn đã cài đặt các package cần thiết
// npm install json-server

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Endpoint để tạo đơn hàng (thanh toán giả lập)
server.post('/checkout', (req, res) => {
  const { items, customer } = req.body;
  const db = router.db; // Sử dụng LowDB instance

  // Kiểm tra và cập nhật số lượng sản phẩm
  const insufficientStock = [];

  items.forEach((item) => {
    const product = db.get('products').find({ id: item.productId }).value();
    if (!product) {
      insufficientStock.push({ productId: item.productId, message: 'Không tìm thấy sản phẩm' });
    } else if (product.quantity < item.quantity) {
      insufficientStock.push({ productId: item.productId, message: 'Số lượng không đủ' });
    }
  });

  if (insufficientStock.length > 0) {
    return res.status(400).json({ message: 'Sản phẩm không đủ số lượng', details: insufficientStock });
  }

  // Giảm số lượng sản phẩm
  items.forEach((item) => {
    db.get('products')
      .find({ id: item.productId })
      .assign({ quantity: db.get('products').find({ id: item.productId }).value().quantity - item.quantity })
      .write();
  });

  // Tạo đơn hàng mới
  const newOrder = {
    id: Date.now(),
    items,
    customer,
    totalPrice: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    createdAt: new Date().toISOString(),
  };

  db.get('orders').push(newOrder).write();

  res.status(201).json(newOrder);
});

// Endpoint để đăng nhập
server.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db.get('users').find({ email, password }).value();

  if (user) {
    const token = 'mock-token'; // Trong thực tế, bạn nên tạo một token JWT hoặc tương tự
    res.status(200).json({ token, user });
  } else {
    res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
  }
});

// Các route khác
server.use(router);

server.listen(5000, () => {
  console.log('JSON Server is running on port 5000');
});
