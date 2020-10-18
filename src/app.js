require('dotenv').config();
const Express = require("express");
const mongoose = require("mongoose");
const BodyParser = require("body-parser");
const danhmuc = require('./routes/DanhMuc.route');
const thuonghieu = require('./routes/ThuongHieu.route');
const trangthai = require('./routes/TrangThai.route');
const hinhthucvanchuyen = require('./routes/HTVC.route');
const hinhthucthanhtoan = require('./routes/HTTT.route');
const quyen = require('./routes/Quyen.route');
const kichco = require('./routes/KichCo.route');
const mausac = require('./routes/MauSac.route');
const nhacungcap = require('./routes/NhaCungCap.route');
const diachi = require('./routes/DiaChi.route');
const hinhanh = require('./routes/HinhAnh.route');
const file = require('./routes/File.route');
const sanpham = require('./routes/SanPham.route');
const mausanpham = require('./routes/MauSanPham.route');
const chitietsanpham = require('./routes/ChiTietSanPham.route');
const nguoidung = require('./routes/NguoiDung.route');
const khuyenmai = require('./routes/KhuyenMai.route');
const dongia = require('./routes/DonGia.route');
const phieunhap = require('./routes/PhieuNhap.route');
const donhang = require('./routes/DonHang.route');
const donhangad = require('./routes/DonHangAdmin.route');
const user = require('./routes/Auth.route');
const binhluan = require('./routes/BinhLuan.route');
const giohang = require('./routes/GioHang.route');
const yeuthich = require('./routes/YeuThich.route');
const overview = require('./routes/Overview.route');
const landing = require('./routes/Landing.route')




var app = Express();
var cors = require('cors')

// app.use(require('morgan')('combined'))
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(cors())

//ADMIN
app.use('/api/v1/admin/danhmuc', danhmuc);
app.use('/api/v1/admin/thuonghieu', thuonghieu);
app.use('/api/v1/admin/trangthai', trangthai);
app.use('/api/v1/admin/htvc', hinhthucvanchuyen);
app.use('/api/v1/admin/httt', hinhthucthanhtoan);
app.use('/api/v1/admin/quyen', quyen);
app.use('/api/v1/admin/kichco', kichco);
app.use('/api/v1/admin/mausac', mausac);
app.use('/api/v1/admin/nhacungcap', nhacungcap);
app.use('/api/v1/admin/sanpham', sanpham);
app.use('/api/v1/admin/mausanpham', mausanpham);
app.use('/api/v1/admin/chitietsanpham', chitietsanpham);
app.use('/api/v1/admin/khuyenmai', khuyenmai);
app.use('/api/v1/admin/dongia', dongia);
app.use('/api/v1/admin/phieunhap', phieunhap);
app.use('/api/v1/admin/donhang', donhangad);
app.use('/api/v1/admin/overview', overview);

//app.use('/api/v1', file);
app.use('/uploads', Express.static('images'));

//CUSTOMER
app.use('/api/v1/customer/diachi', diachi);
app.use('/api/v1/customer/donhang', donhang);
app.use('/api/v1/customer/binhluan', binhluan);
app.use('/api/v1/customer/giohang', giohang);
app.use('/api/v1/customer/yeuthich', yeuthich);

//USER
app.use('/api/v1/hinhanh', hinhanh);
app.use('/api/v1/user', nguoidung);
//PUBLIC
app.use('/api/v1/auth', user);
app.use('/api/v1/', landing);


const port = 3000

app.listen(port, () => {
    console.log("Listening at :3000...");
});

const dbConfig = 'mongodb://localhost:27017/shoesshop';

//connecting to the database
mongoose.set('useCreateIndex', true);
mongoose.connect(dbConfig, {
    useNewUrlParser: true
}).then(()=>{
    console.log("Successfully connected to the database");
}).catch(err=>{
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
})