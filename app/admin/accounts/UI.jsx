"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import toast from "react-hot-toast";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
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
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Tìm kiếm tài khoản:
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 shadow-sm"
              placeholder="Nhập tên tài khoản cần tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách tài khoản */}
        <div className="overflow-auto">
          <button
            className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-orange-600 transition mb-4 shadow-md"
            onClick={() => setEditingUser({})}
          >
            <PlusCircle className="w-5 h-5" />
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
                  <tr key={u.id} className="hover:bg-green-100">
                    <td className="p-3">{u.tenTaiKhoan}</td>
                    <td className="p-3">{u.hoTen}</td>
                    <td className="p-3">
                      {loaiTKs.find((l) => l.Id === u.LoaiTK_Id)?.Name}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition"
                        title="Sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          onDeleteUser(u.id);
                        }}
                        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-xl shadow-2xl px-8 py-6 w-full max-w-md space-y-5 animate-fadeIn"
            >
              <h3 className="text-xl font-bold text-orange-600">
                {editingUser?.id
                  ? " Chỉnh sửa tài khoản"
                  : "Thêm tài khoản mới"}
              </h3>

              <input
                name="tenTaiKhoan"
                defaultValue={editingUser?.TenTaiKhoan || ""}
                placeholder="Tên tài khoản"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                name="hoTen"
                defaultValue={editingUser?.HoTen || ""}
                placeholder="Họ tên"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                name="matKhau"
                defaultValue={editingUser?.MatKhau || ""}
                placeholder="Mật khẩu"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <select
                name="loaiTK"
                defaultValue={editingUser?.LoaiTK_Id || ""}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Chọn loại tài khoản --</option>
                {loaiTKs.map((l) => (
                  <option key={l.Id} value={l.Id}>
                    {l.Name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-800 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
                >
                  {editingUser?.id ? " Cập nhật" : " Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
