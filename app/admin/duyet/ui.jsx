"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DuyetDiemUI({
  user,
  handleLogout,
  monHocs,
  sinhViens,
  permissions,
  onMonHocChange,
  onDuyet,
  onTuChoi,
}) {
  const [selectedMonHoc, setSelectedMonHoc] = useState("");
  const [selectedLop, setSelectedLop] = useState("");
  const handleSelectMonHoc = (e) => {
    const id = e.target.value;
    setSelectedMonHoc(id);
    const mon = monHocs.find((m) => m.id == id);
    if (mon) {
      setSelectedLop(mon.LopHoc.id);
      onMonHocChange(mon.id);
    }
  };
  const trangThaiBangDiem = sinhViens[0]?.IsDuyet;
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-100 text-gray-900 font-sans">
      <Sidebar user={user} />
      <div className="flex-1 px-8 py-6">
        <Header user={user} onLogout={handleLogout} />
        <h2 className="text-4xl font-bold text-orange-600 mb-8">
          Duyệt bảng điểm môn học
        </h2>

        {permissions.Xem ? (
          <>
            <div className="space-y-8 p-6 border-pink-200 mb-10">
              <select
                className="p-3 border border-orange-300 rounded-md w-full bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 transition"
                value={selectedMonHoc}
                onChange={handleSelectMonHoc}
              >
                <option value="">-- Chọn môn học --</option>
                {monHocs.map((mh) => (
                  <option key={mh.id} value={mh.id}>
                    {mh.maMonHoc} - {mh.tenMonHoc} ({mh.LopHoc?.TenLop}) - GV:{" "}
                    {mh.GiangVien?.hoTen}
                  </option>
                ))}
              </select>
            </div>

            {selectedLop && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200">
                <h3 className="text-xl font-semibold mb-4">
                  Danh sách sinh viên lớp{" "}
                  {monHocs.find((m) => m.id == selectedMonHoc)?.LopHoc?.TenLop}
                </h3>

                <table className="w-full text-left border border-gray-200">
                  <thead>
                    <tr className="bg-orange-100 text-red-700">
                      <th className="p-3">Họ tên</th>
                      <th className="p-3">Mã SV</th>
                      <th className="p-3">Điểm</th>
                      <th className="p-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sinhViens || []).map((sv) => (
                      <tr key={sv.id} className="hover:bg-green-100">
                        <td className="p-3">{sv.hoTen}</td>
                        <td className="p-3">{sv.maSinhVien}</td>
                        <td className="p-3">{sv.diem ?? "Chưa có"}</td>
                        <td className="p-3">
                          {sv?.IsDuyet === true
                            ? "✅ Đã duyệt"
                            : sv?.IsDuyet === false
                            ? "❌ Bị từ chối"
                            : "⏳ Chờ duyệt"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Hiển thị trạng thái bảng điểm */}
                {sinhViens.length > 0 && (
                  <div className="mt-4 text-right font-medium">
                    Trạng thái bảng điểm:{" "}
                    <span
                      className={`${
                        trangThaiBangDiem === null
                          ? "text-yellow-500"
                          : trangThaiBangDiem === true
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {trangThaiBangDiem === null
                        ? "Chờ duyệt"
                        : trangThaiBangDiem === true
                        ? "Đã duyệt"
                        : "Bị từ chối"}
                    </span>
                  </div>
                )}
                {/* Chỉ hiển thị nếu bảng điểm chưa duyệt */}
                {(permissions.Duyet || permissions.TuChoi) &&
                  trangThaiBangDiem === null && (
                    <div className="mt-4 flex justify-end space-x-3">
                      {permissions.TuChoi && (
                        <button
                          className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition font-medium"
                          onClick={onTuChoi}
                        >
                          Từ chối bảng điểm
                        </button>
                      )}
                      {permissions.Duyet && (
                        <button
                          className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition font-medium"
                          onClick={onDuyet}
                        >
                          Duyệt bảng điểm
                        </button>
                      )}
                    </div>
                  )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-red-600 font-bold mt-10">
            Bạn không có quyền xem trang này
          </div>
        )}
      </div>
    </div>
  );
}
