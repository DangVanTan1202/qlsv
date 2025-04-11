"use client";
import { useState, useEffect } from "react";
import {
  fetchLoaiTKs,
  fetchPhanQuyenLoaiTK,
  fetchChucNangs,
} from "../../service/accountService";
export default function AccountManagerUI({ users }) {
    console.log("Danh sách users:", users);
  const [loaiTKList, setLoaiTKList] = useState([]);
  const [phanQuyenMap, setPhanQuyenMap] = useState({});
  const [chucNangs, setChucNangs] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      const [roles, chucnangs] = await Promise.all([
        fetchLoaiTKs(),
        fetchChucNangs(),
      ]);
      setLoaiTKList(roles);
      setChucNangs(chucnangs);
      console.log("Danh sách chức năng:", chucnangs);
      const uniqueLoaiTKIds = [...new Set(users.map((u) => u.LoaiTK_Id))];
      const allPermissions = {};
      await Promise.all(
        uniqueLoaiTKIds.map(async (id) => {
          const pq = await fetchPhanQuyenLoaiTK(id);
          allPermissions[id] = pq;
        })
      );
      setPhanQuyenMap(allPermissions);
      console.log("Dữ liệu phân quyền từng loại tài khoản:", allPermissions);

    };

    loadData();
  }, [users]);
  const getQuyen = (loaiTKId, chucNangCode, action) => {
    console.log("🔍 getQuyen", { loaiTKId, chucNangCode, action });
  
    const chucNang = chucNangs.find((c) => c.code === chucNangCode);
    console.log("🔍 -> chucNang tìm được:", chucNang);
    if (!chucNang) return false;
  
    const danhSachQuyen = phanQuyenMap[Number(loaiTKId)] || [];
    console.log("🔍 -> danhSachQuyen của loạiTK", loaiTKId, danhSachQuyen);
  
    const quyen = danhSachQuyen.find((p) => p.IdChucNang === chucNang.id);
    console.log("🔍 -> quyền tìm được:", quyen);
    if (!quyen) return false;
    const key = action.charAt(0).toUpperCase() + action.slice(1); // "xem" -> "Xem"
    return quyen[key] === true;
  };
  
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý tài khoản</h2>

      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-orange-100">
          <tr>
            <th className="border px-3 py-2">Tên tài khoản</th>
            <th className="border px-3 py-2">Họ tên</th>
            <th className="border px-3 py-2">Loại TK</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users.map((user) => {
                console.log("🧪 user object:", user);
              const role = loaiTKList.find((r) => r.Id === user.LoaiTK_Id);
             const canXem = getQuyen(user.LoaiTK_Id, "QLTK", "xem");
             console.log(`👀 Quyền xem của ${user.tenTaiKhoan}:`, canXem);
              const canSua = getQuyen(user.LoaiTK_Id, "QLTK", "sua");
              const canXoa = getQuyen(user.LoaiTK_Id, "QLTK", "xoa");
             if (!canXem) return null;
              return (
                <tr key={user.id} className="hover:bg-orange-50">
                  <td className="border px-3 py-2">{user.tenTaiKhoan}</td>
                  <td className="border px-3 py-2">{user.hoTen}</td>
                  <td className="border px-3 py-2">{role?.Name || "N/A"}</td>
                  <td className="border px-3 py-2 flex gap-2">
                    {canSua && (
                      <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                        Sửa
                      </button>
                    )}
                    {canXoa && (
                      <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                        Xoá
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
