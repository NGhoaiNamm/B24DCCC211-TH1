import { Request, Response } from 'express';

// In-memory data
let soVanBangList: any[] = [];
let quyetDinhList: any[] = [];
let cauHinhList: any[] = [];
let thongTinVanBangList: any[] = [];

// Helper
const getPage = (req: Request, res: Response, sourceList: any[]) => {
  const { page = 1, limit = 10 } = req.query as any;
  const start = (page - 1) * limit;
  const end = start + Number(limit);
  const result = sourceList.slice(start, end);
  res.json({
    data: {
      result,
      total: sourceList.length,
    },
  });
};

const getAll = (req: Request, res: Response, sourceList: any[]) => {
  res.json({
    data: sourceList,
  });
};

const getById = (req: Request, res: Response, sourceList: any[]) => {
  const { id } = req.params;
  const item = sourceList.find((i) => i._id === id);
  res.json({ data: item });
};

const create = (req: Request, res: Response, sourceList: any[]) => {
  const newItem = { ...req.body, _id: Date.now().toString() };
  sourceList.push(newItem);
  res.json({ data: newItem });
  return newItem;
};

const update = (req: Request, res: Response, sourceList: any[]) => {
  const { id } = req.params;
  const index = sourceList.findIndex((i) => i._id === id);
  if (index > -1) {
    sourceList[index] = { ...sourceList[index], ...req.body };
    res.json({ data: sourceList[index] });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
};

const remove = (req: Request, res: Response, sourceList: any[]) => {
  const { id } = req.params;
  const index = sourceList.findIndex((i) => i._id === id);
  if (index > -1) {
    sourceList.splice(index, 1);
    res.json({ data: { success: true } });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
};

export default {
  // Sổ Văn Bằng
  'GET /slink/so-van-bang/page': (req: Request, res: Response) => getPage(req, res, soVanBangList),
  'GET /slink/so-van-bang/many': (req: Request, res: Response) => getAll(req, res, soVanBangList),
  'GET /slink/so-van-bang/:id': (req: Request, res: Response) => getById(req, res, soVanBangList),
  'POST /slink/so-van-bang': (req: Request, res: Response) => {
    // Tự động gán soVaoSoHienTai = 1 khi tạo Sổ mới
    req.body.soVaoSoHienTai = 1;
    create(req, res, soVanBangList);
  },
  'PUT /slink/so-van-bang/:id': (req: Request, res: Response) => update(req, res, soVanBangList),
  'DELETE /slink/so-van-bang/:id': (req: Request, res: Response) => remove(req, res, soVanBangList),

  // Quyết Định
  'GET /slink/quyet-dinh/page': (req: Request, res: Response) => getPage(req, res, quyetDinhList),
  'GET /slink/quyet-dinh/many': (req: Request, res: Response) => getAll(req, res, quyetDinhList),
  'GET /slink/quyet-dinh/:id': (req: Request, res: Response) => getById(req, res, quyetDinhList),
  'POST /slink/quyet-dinh': (req: Request, res: Response) => {
    req.body.soLuotTraCuu = 0;
    create(req, res, quyetDinhList);
  },
  'PUT /slink/quyet-dinh/:id': (req: Request, res: Response) => update(req, res, quyetDinhList),
  'DELETE /slink/quyet-dinh/:id': (req: Request, res: Response) => remove(req, res, quyetDinhList),

  // Cấu Hình
  'GET /slink/cau-hinh/page': (req: Request, res: Response) => getPage(req, res, cauHinhList),
  'GET /slink/cau-hinh/many': (req: Request, res: Response) => getAll(req, res, cauHinhList),
  'GET /slink/cau-hinh/:id': (req: Request, res: Response) => getById(req, res, cauHinhList),
  'POST /slink/cau-hinh': (req: Request, res: Response) => create(req, res, cauHinhList),
  'PUT /slink/cau-hinh/:id': (req: Request, res: Response) => update(req, res, cauHinhList),
  'DELETE /slink/cau-hinh/:id': (req: Request, res: Response) => remove(req, res, cauHinhList),

  // Thông Tin Văn Bằng
  'GET /slink/thong-tin-van-bang/page': (req: Request, res: Response) => getPage(req, res, thongTinVanBangList),
  'GET /slink/thong-tin-van-bang/many': (req: Request, res: Response) => getAll(req, res, thongTinVanBangList),
  'GET /slink/thong-tin-van-bang/:id': (req: Request, res: Response) => getById(req, res, thongTinVanBangList),
  'POST /slink/thong-tin-van-bang': (req: Request, res: Response) => {
    // Tự động tăng soVaoSo
    const quyetDinh = quyetDinhList.find(q => q._id === req.body.quyetDinhId);
    if (quyetDinh) {
      const soVanBang = soVanBangList.find(s => s._id === quyetDinh.soVanBangId);
      if (soVanBang) {
        req.body.soVaoSo = soVanBang.soVaoSoHienTai.toString().padStart(5, '0');
        soVanBang.soVaoSoHienTai += 1;
      }
    }
    create(req, res, thongTinVanBangList);
  },
  'PUT /slink/thong-tin-van-bang/:id': (req: Request, res: Response) => update(req, res, thongTinVanBangList),
  'DELETE /slink/thong-tin-van-bang/:id': (req: Request, res: Response) => remove(req, res, thongTinVanBangList),
};
