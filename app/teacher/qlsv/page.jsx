"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SinhVienUI from "./ui"; // 👈 Sửa tên UI component tương ứng
import {
  fetchSinhViensClient,
  fetchUsers,
  fetchLopHocs,
  fetchPhanQuyenByLoaiTK,
  fetchChucNangs,
  deleteSinhVien,
} from "../../service/sinhVienService"; // 👈 Đường dẫn đến sinhVienService

export default function Page() {
  const [user, setUser] = useState(null);
  const [sinhViens, setSinhViens] = useState([]);
  const [users, setUsers] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);
  const [permissions, setPermissions] = useState({
    Them: false,
    Sua: false,
    Xoa: false,
    Xem: false,
  });

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (!["Giảng Viên", "Admin"].includes(parsedUser.LoaiTK_Name)) {
      router.push("/login");
      return;
    }
    setUser(parsedUser);
  }, []);
  useEffect(() => {
    const loadData = async () => {
      await fetchSinhViensClient(setSinhViens);
      await fetchUsers(setUsers);
      await fetchLopHocs(setLopHocs);

      const quyenData = await new Promise((resolve) => {
        fetchPhanQuyenByLoaiTK(1, resolve); // 👈 ID loại tài khoản Admin
      });

      const chucNangsData = await new Promise((resolve) => {
        fetchChucNangs(resolve);
      });

      const QLSVId = chucNangsData.find((c) => c.code === "QLSV")?.id; // 👈 code của chức năng quản lý sinh viên
      const quyenQLSV = quyenData.find((q) => q.IdChucNang === QLSVId) || {};

      setPermissions({
        Them: quyenQLSV?.Them,
        Sua: quyenQLSV?.Sua,
        Xoa: quyenQLSV?.Xoa,
        Xem: quyenQLSV?.Xem,
      });
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteSinhVien(id);
    setSinhViens((prev) => prev.filter((sv) => sv.id !== id));
  };

  return (
    <SinhVienUI
      user={user}
      handleLogout={handleLogout}
      data={sinhViens}
      users={users}
      lopHocs={lopHocs}
      permissions={permissions}
      onDelete={handleDelete}
      onSubmitSuccess={async () => {
        await fetchSinhViensClient(setSinhViens);
      }}
    />
  );
}
