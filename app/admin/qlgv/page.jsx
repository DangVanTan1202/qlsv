"use client";
import { useEffect, useState } from "react";
import GiangVienUI from "./UI";
import {
  fetchGiangViensClient,
  fetchUsers,
  fetchLopHocs,
  fetchPhanQuyenByLoaiTK,
  fetchChucNangs,
  fetchMonHocs,
  deleteGiangVien,
} from "../../service/giangVienService";
export default function Page() {
  const [giangViens, setGiangViens] = useState([]);
  const [users, setUsers] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [permissions, setPermissions] = useState({
    Them: false,
    Sua: false,
    Xoa: false,
    Xem: false,
  });
  useEffect(() => {
    const loadData = async () => {
      await fetchGiangViensClient(setGiangViens);
      await fetchUsers(setUsers);
      await fetchLopHocs(setLopHocs);
      await fetchMonHocs(setMonHocs); // 👈 Thêm dòng này

      const quyenData = await new Promise((resolve) => {
        fetchPhanQuyenByLoaiTK(0, resolve); // 1 là loại tài khoản giảng viên
      });

      const chucNangsData = await new Promise((resolve) => {
        fetchChucNangs(resolve);
      });

      const QLGVId = chucNangsData.find((c) => c.code === "QLGV")?.id;
      const quyenQLGV = quyenData.find((q) => q.IdChucNang === QLGVId) || {};

      setPermissions({
        Them: quyenQLGV?.Them,
        Sua: quyenQLGV?.Sua,
        Xoa: quyenQLGV?.Xoa,
        Xem: quyenQLGV?.Xem,
      });
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteGiangVien(id);
    setGiangViens((prev) => prev.filter((gv) => gv.id !== id));
  };

  return (
    <GiangVienUI
      data={giangViens}
      users={users}
      lopHocs={lopHocs}
      monHocs={monHocs} // 👈 Thêm dòng này
      permissions={permissions}
      onDelete={handleDelete}
      onSubmitSuccess={async () => {
        await fetchGiangViensClient(setGiangViens);
      }}
    />
  );
}
