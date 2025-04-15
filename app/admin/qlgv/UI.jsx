"use client";
import { useState } from "react";
import {
  addGiangVien,
  updateGiangVien,
} from "../../service/giangVienService";

export default function GiangVienUI({
  data,
  users,
  lopHocs,
  monHocs,
  permissions,
  onDelete,
  onSubmitSuccess,
}) {
  const [formData, setFormData] = useState({
    id: null,
    maGiangVien: "",
    ngaySinh: "",
    user_id: "",
    lopHoc_id: "",
    monHoc_id: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (isEdit) {
      await updateGiangVien(formData.id, formData);
    } else {
      await addGiangVien(formData);
    }
    setFormData({
      id: null,
      maGiangVien: "",
      ngaySinh: "",
      user_id: "",
      lopHoc_id: "",
      monHoc_id: "",
    });
    setIsEdit(false);
    setShowForm(false);
    onSubmitSuccess();
  };

  const filteredData = data.filter(
    (gv) =>
      gv.maGiangVien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users
        .find((u) => u.id === gv.user_id)
        ?.hoTen?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Tìm kiếm + Thêm */}
      <div className="flex gap-2 items-center">
        {permissions.Them && (
          <button
            className="btn btn-success"
            onClick={() => {
              setIsEdit(false);
              setShowForm(true);
              setFormData({
                id: null,
                maGiangVien: "",
                ngaySinh: "",
                user_id: "",
                lopHoc_id: "",
                monHoc_id: "",
              });
            }}
          >
            + Thêm giảng viên
          </button>
        )}
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      {permissions.Xem ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Mã GV</th>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Lớp</th>
                <th>Môn</th>
                {(permissions.Sua || permissions.Xoa) && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((gv) => {
                const user = users.find((u) => u.id === gv.user_id);
                const lopHoc = lopHocs.find((lh) => lh.id === gv.lopHoc_id);
                const monHoc = monHocs.find((mh) => mh.id === gv.monHoc_id);
                return (
                  <tr key={gv.id}>
                    <td>{gv.maGiangVien}</td>
                    <td>{user?.hoTen}</td>
                    <td>{new Date(gv.ngaySinh).toLocaleDateString()}</td>
                    <td>{lopHoc?.TenLop}</td>
                    <td>{monHoc?.tenMonHoc}</td>
                    {(permissions.Sua || permissions.Xoa) && (
                      <td className="space-x-2">
                        {permissions.Sua && (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              setIsEdit(true);
                              setShowForm(true);
                              setFormData({
                                id: gv.id,
                                maGiangVien: gv.maGiangVien,
                                ngaySinh: gv.ngaySinh,
                                user_id: gv.user_id,
                                lopHoc_id: gv.lopHoc_id,
                                monHoc_id: gv.monHoc_id,
                              });
                            }}
                          >
                            Sửa
                          </button>
                        )}
                        {permissions.Xoa && (
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => onDelete(gv.id)}
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-red-500 font-bold">
          Bạn không có quyền xem dữ liệu!
        </div>
      )}

      {/* Form thêm/sửa */}
      {(permissions.Them || permissions.Sua) && showForm && (
        <div className="space-y-2 border p-4 rounded-md bg-base-100 shadow">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Sửa" : "Thêm"} giảng viên
          </h2>
          <input
            type="text"
            name="maGiangVien"
            placeholder="Mã giảng viên"
            className="input input-bordered w-full"
            value={formData.maGiangVien}
            onChange={handleInput}
          />
          <input
            type="date"
            name="ngaySinh"
            className="input input-bordered w-full"
            value={formData.ngaySinh?.split("T")[0] || ""}
            onChange={handleInput}
          />
          <select
            name="user_id"
            className="select select-bordered w-full"
            value={formData.user_id}
            onChange={handleInput}
          >
            <option value="">-- Chọn tài khoản giảng viên --</option>
            {users
              .filter((u) => u.LoaiTK_Id === 1)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.hoTen}
                </option>
              ))}
          </select>
          <select
            name="lopHoc_id"
            className="select select-bordered w-full"
            value={formData.lopHoc_id}
            onChange={handleInput}
          >
            <option value="">-- Chọn lớp học --</option>
            {lopHocs.map((lh) => (
              <option key={lh.id} value={lh.id}>
                {lh.TenLop}
              </option>
            ))}
          </select>
          <select
            name="monHoc_id"
            className="select select-bordered w-full"
            value={formData.monHoc_id}
            onChange={handleInput}
          >
            <option value="">-- Chọn môn học --</option>
            {monHocs.map((mh) => (
              <option key={mh.id} value={mh.id}>
                {mh.tenMonHoc}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {isEdit ? "Cập nhật" : "Thêm"}
            </button>
            <button className="btn" onClick={() => setShowForm(false)}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
