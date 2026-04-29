import { useState } from 'react';

export default () => {
  const [list, setList] = useState([]);
  const [cauHinh, setCauHinh] = useState([]);

  // load config fields
  const getCauHinh = async () => {
    const res = await fetch('/api/cauhinh');
    const data = await res.json();
    setCauHinh(data);
  };

  // thêm văn bằng
  const createVanBang = async (payload: any) => {
    await fetch('/api/vanbang', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return {
    list,
    cauHinh,
    getCauHinh,
    createVanBang,
  };
};