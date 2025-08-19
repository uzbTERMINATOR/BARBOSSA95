const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Получение всех товаров
app.get('/products', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'products.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Ошибка сервера');
    res.json(JSON.parse(data));
  });
});

// Добавление нового товара
app.post('/products', (req, res) => {
  const newProduct = req.body;
  if (!newProduct.name || !newProduct.price || !newProduct.image) {
    return res.status(400).send('Неверные данные товара');
  }

  const filePath = path.join(__dirname, 'data', 'products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Ошибка сервера');

    const products = JSON.parse(data);
    newProduct.id = products.length + 1;
    products.push(newProduct);

    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).send('Ошибка сохранения');
      res.json(newProduct);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));