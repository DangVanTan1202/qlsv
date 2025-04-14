"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import toast from "react-hot-toast";

export default function AccountUI({
  user,
  handleLogout,
  users,
  loaiTKs,
  phanQuyen,
  onSaveUser,
  onDeleteUser,
  loading,
}) {
  console.log("Phân quyền hiện tại:", phanQuyen);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const getQuyenTheoLoaiTK = (quyen) => {
    if (!phanQuyen) return false;
    return phanQuyen.some((q) => q[quyen]);
  };

  const openEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      id: editingUser?.id,
      tenTaiKhoan: form.tenTaiKhoan.value,
      hoTen: form.hoTen.value,
      matKhau: form.matKhau.value,
      LoaiTK_Id: form.loaiTK.value,
    };
    const isEdit = !!editingUser?.id;
    onSaveUser(data, isEdit);
    toast.success(isEdit ? "Cập nhật thành công" : "Thêm mới thành công");
    setEditingUser(null);
  };

  // Lọc danh sách tài khoản theo tên tài khoản
  const filteredUsers = users.filter((u) =>
    u.tenTaiKhoan.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar user={user} />
      <div className="flex-1 px-8 py-6">
        <Header user={user} onLogout={handleLogout} />
        <h2 className="text-3xl font-semibold text-orange-600 mb-6">
          Quản lý tài khoản
        </h2>

        {/* Ô tìm kiếm */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Tìm kiếm tài khoản:</label>
          <input
            type="text"
            className="p-2 border rounded w-full"
            placeholder="Nhập tên tài khoản cần tìm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Danh sách tài khoản */}
        <div className="overflow-auto">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mb-4"
            onClick={() => setEditingUser({})}
          >
            Thêm tài khoản
          </button>
          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead>
              <tr className="bg-orange-100 text-orange-700">
                <th className="p-3 text-left">Tên tài khoản</th>
                <th className="p-3 text-left">Họ tên</th>
                <th className="p-3 text-left">Loại tài khoản</th>
               <th className="p-3">Sửa</th>
                <th className="p-3">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3">{u.tenTaiKhoan}</td>
                    <td className="p-3">{u.hoTen}</td>
                    <td className="p-3">
                      {loaiTKs.find((l) => l.Id === u.LoaiTK_Id)?.Name}
                    </td>
                
                      <td className="p-3 text-center">
                        <button
                          onClick={() => openEdit(u)}
                          className="text-blue-600 hover:underline"
                        >
                          Sửa
                        </button>
                      </td>
                  
                    
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            onDeleteUser(u.id);
                            toast.success("Xóa thành công");
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {editingUser !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSave}
              className="bg-white rounded shadow-lg p-6 w-[400px] space-y-4"
            >
              <h3 className="text-lg font-semibold mb-2">
                {editingUser?.id ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
              </h3>
              <input
                name="tenTaiKhoan"
                defaultValue={editingUser?.TenTaiKhoan || ""}
                placeholder="Tên tài khoản"
                required
                className="w-full p-2 border rounded"
              />
              <input
                name="hoTen"
                defaultValue={editingUser?.HoTen || ""}
                placeholder="Họ tên"
                required
                className="w-full p-2 border rounded"
              />
              <input
                name="matKhau"
                defaultValue={editingUser?.MatKhau || ""}
                placeholder="Mật khẩu"
                required
                className="w-full p-2 border rounded"
              />
              <select
                name="loaiTK"
                defaultValue={editingUser?.LoaiTK_Id || ""}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">-- Loại tài khoản --</option>
                {loaiTKs.map((l) => (
                  <option key={l.Id} value={l.Id}>
                    {l.Name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-gray-600 hover:text-black"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-red-500 px-4 py-2 rounded hover:bg-orange-600"
                >
                  {editingUser?.id ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
