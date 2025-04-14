"use client";
import { useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function GiangVienUI({ giangViens, users, lopHocs, monHocs, fetchData, loading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGiangVien = (giangViens || []).filter(gv => {
    const user = users?.find(u => u.id === gv.user_id);
    return user?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Quản lý giảng viên</h2>

      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên giảng viên..."
          className="border px-4 py-2 rounded-md w-full max-w-md focus:ring-2 focus:ring-orange-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center gap-2">
          <PlusCircle size={20} /> Thêm giảng viên
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-left">
        <thead>
          <tr className="bg-orange-100 text-orange-700">
            <th className="p-3">Mã GV</th>
            <th className="p-3">Họ tên</th>
            <th className="p-3">Ngày sinh</th>
            <th className="p-3">Tài khoản</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredGiangVien.map(gv => {
            const user = users.find(u => u.id === gv.user_id);
            return (
              <tr key={gv.id} className="hover:bg-gray-50">
                <td className="p-3">{gv.maGiangVien}</td>
                <td className="p-3">{user?.hoTen}</td>
                <td className="p-3">{new Date(gv.ngaySinh).toLocaleDateString()}</td>
                <td className="p-3">{user?.tenTaiKhoan}</td>
                <td className="p-3 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {loading && <p className="mt-4 text-orange-600">Đang tải dữ liệu...</p>}
    </div>
  );
}
