const {check} = require('express-validator')
const {trim} = require('express-validator/check')

let validateDiaChi = () =>{
    
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten must contain only alphabetic characters').not().matches(/\d/),
        check('ten', 'Ten length should be 5 to 50 characters').isLength({ min: 5, max: 50}),
        check('dienthoai', 'DienThoai is required').not().isEmpty(),
        check('dienthoai', 'DienThoai length should be 10 to 12 digits').isLength({min: 10, max:12}),
        check('dienthoai', 'DienThoai must be digits').isMobilePhone(),
        check('diachi', 'DiaChi is required').not().isEmpty(),
        check('diachi', 'DiaChi length should be 10 to 100 characters').isLength({min: 10, max:100})
    ];
}

let validateTimKiem = () =>{
    return [
        check('ten', 'Keyword is required').not().isEmpty(),
        check('ten', 'Keyword should be 1 to 100 characters').isLength({min: 1, max:100})
    ];
}

let validateBinhLuan = () =>{
    return [
        check('noidung', 'Content is required').not().isEmpty(),
        check('noidung', 'Content must be 5 to 100 characters').isLength({ min: 5, max:100}),
        check('danhgia', 'You have not rated yet').isIn([1,2,3,4,5])
    ];
}

let validateGioHang = () =>{
    return [
        check('soluongdat', 'Quantity is required').not().isEmpty(),
        check('soluongdat', 'Quantity must be number').isInt()
    ];
}

let validateDanhMuc = () =>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten should be 2 to 50 characters').trim().isLength({ min: 2, max:50})
    ]
}

let validateThuongHieu = () =>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten should be 2 to 50 characters').trim().isLength({ min: 2, max:50})
    ]
}

let validateCTSP = () =>{

}

let validateDonGia = () =>{
    return [
        check('dongia', 'DonGia is required').not().isEmpty(),
        check('dongia', 'DonGia must be number').isInt()
    ]
}

let validateDonHang = () =>{

}

let validateHTTT = ()=>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten should be 2 to 50 characters').trim().isLength({min: 2, max: 50})
    ]
} 

let validateHTVC = () =>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten should be 2 to 50 characters').trim().isLength({min: 2, max: 50}),
        check('phi', 'Phi is required').not().isEmpty(),
        check('phi', 'Phi must be number').isInt()
    ]
}
let validateKhuyenMai = () => {
    return [
        check('chude', 'ChuDe is required').not().isEmpty(),
        check('chude', 'ChuDe length should be 5 to 50 characters').trim().isLength({min: 5, max: 50}),
        check('mota', 'Mota is required').not().isEmpty(),
        check('mota', 'Mota length should be 10 to 100 characters').trim().isLength({min: 10, max: 100}),
        check('giamgia', 'GiamGia is required').not().isEmpty(),
        check('giamgia', 'GiamGia must be number').isInt(),
        check('ngaybd', 'NgayBD is required').not().isEmpty(),
        check('ngaykt', 'NgayKT is required').not().isEmpty()
    ]
}

let validateKichCo = () =>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten should be 2 to 50 characters').trim().isLength({min: 2, max: 50})
    ]
}

let validateMauSac = () =>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten should be 2 to 50 characters').trim().isLength({min: 2, max: 50}),
        check('hinh', 'Hinh is required').not().isEmpty()
    ]
}

let validateMauSanPham = () =>{
    return [
        check('sanpham_id', 'SanPham is required').not().isEmpty(),
        check('mausac_id', 'MauSac is required').not().isEmpty(),
        check('hinh', 'Hinh is required').not().isEmpty()
    ]
}

let validateNguoiDung = () =>{

}

let validateNhaCungCap = () =>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten should be 5 to 50 characters').trim().isLength({min: 5, max: 50}),
        check('dienthoai', 'DienThoai is required').not().isEmpty(),
        check('dienthoai', 'DienThoai length should be 10 to 12 digits').isLength({min: 10, max:12}),
        check('dienthoai', 'DienThoai must be digits').isMobilePhone(),
        check('diachi', 'DiaChi is required').not().isEmpty(),
        check('diachi', 'DiaChi should be 10 to 100 characters').trim().isLength({min: 10, max: 100}),
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Invalid email').isEmail()
    ]
}

let validatePhieuNhap = () =>{
    return [
        check('nhacungcap_id', 'Nhacungcap is required').not().isEmpty()
    ]
}

let validateSanPham = () =>{
    return [
        check('ten', 'Ten is required').not().isEmpty(),
        check('ten', 'Ten length should be 5 to 50 characters').trim().isLength({min: 5, max: 50}),
        check('mota', 'Mota is required').not().isEmpty(),
        check('mota', 'Mota length should be 10 to 100 characters').trim().isLength({min: 10, max: 100}),
        check('danhmuc_id', 'DanhMuc is required').not().isEmpty(),
        check('thuonghieu_id', 'ThuongHieu is required').not().isEmpty()
    ]
}


let validate = {
    validateDiaChi: validateDiaChi,
    validateTimKiem: validateTimKiem,
    validateBinhLuan: validateBinhLuan,
    validateGioHang: validateGioHang,
    validateDanhMuc: validateDanhMuc,
    validateThuongHieu: validateThuongHieu,
    validateCTSP: validateCTSP,
    validateDonGia: validateDonGia,
    validateDonHang: validateDonHang,
    validateHTTT: validateHTTT,
    validateHTVC: validateHTVC,
    validateKhuyenMai: validateKhuyenMai,
    validateKichCo: validateKichCo,
    validateMauSac: validateMauSac,
    validateMauSanPham: validateMauSanPham,
    validateNguoiDung: validateNguoiDung,
    validateNhaCungCap: validateNhaCungCap,
    validatePhieuNhap: validatePhieuNhap,
    validateSanPham: validateSanPham
  };

module.exports = {validate};