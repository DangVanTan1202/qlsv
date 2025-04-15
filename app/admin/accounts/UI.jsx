"use client";
import { useState } from "react";
import { PlusCircle, Trash2, Pencil, X, Check } from "lucide-react";
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

  const filteredUsers = users.filter((u) =>
    `${u.tenTaiKhoan} ${u.hoTen}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar user={user} />
      <div className="flex-1 px-8 py-6">
        <Header user={user} onLogout={handleLogout} />
        <h2 className="text-3xl font-semibold text-orange-600 mb-6">
          Quản lý tài khoản
        </h2>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-md w-full max-w-md focus:ring-2 focus:ring-orange-400"
          />
          {getQuyenTheoLoaiTK("Them") && (
            <button
              className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center gap-2"
              onClick={() => setEditingUser({})}
            >
              <PlusCircle className="mr-2" size={18} /> Thêm
            </button>
          )}
        </div>

        <div className="overflow-auto">
          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead>
              <tr className="bg-orange-100 text-red-700">
                <th className="p-3 text-left">Tên tài khoản</th>
                <th className="p-3 text-left">Họ tên</th>
                <th className="p-3 text-left">Loại tài khoản</th>
                {getQuyenTheoLoaiTK("Sua") && <th className="p-3">Sửa</th>}
                {getQuyenTheoLoaiTK("Xoa") && <th className="p-3">Xóa</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-green-100 transition">
                  <td className="p-3">{u.tenTaiKhoan}</td>
                  <td className="p-3">{u.hoTen}</td>
                  <td className="p-3">
                    {loaiTKs.find((l) => l.Id === u.LoaiTK_Id)?.Name}
                  </td>
                  {getQuyenTheoLoaiTK("Sua") && (
                    <td className="p-3 text-center">
                      <button
                        onClick={() => openEdit(u)}
                        className="text-blue-600 hover:underline"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  )}
                  {getQuyenTheoLoaiTK("Xoa") && (
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          onDeleteUser(u.id);
                          toast.success("Xóa thành công");
                        }}
                        className="text-red-600 hover:underline"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {editingUser !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl shadow-xl p-6 w-[400px] space-y-4"
            >
              <h3 className="text-lg font-semibold mb-2 text-orange-600">
                {editingUser?.id ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
              </h3>
              <input
                name="tenTaiKhoan"
                defaultValue={editingUser?.TenTaiKhoan || ""}
                placeholder="Tên tài khoản"
                required
                className="w-full p-2 border border-orange-300 rounded"
              />
              <input
                name="hoTen"
                defaultValue={editingUser?.HoTen || ""}
                placeholder="Họ tên"
                required
                className="w-full p-2 border border-orange-300 rounded"
              />
              <input
                name="matKhau"
                defaultValue={editingUser?.MatKhau || ""}
                placeholder="Mật khẩu"
                required
                className="w-full p-2 border border-orange-300 rounded"
              />
              <select
                name="loaiTK"
                defaultValue={editingUser?.LoaiTK_Id || ""}
                required
                className="w-full p-2 border border-orange-300 rounded"
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
                  className="flex items-center text-gray-600 hover:text-black"
                >
                  <X className="mr-1" size={18} /> Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition"
                >
                  <Check className="mr-1" size={18} />
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
