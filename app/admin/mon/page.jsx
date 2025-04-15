"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MonHocUI from "./ui"; // Sửa tên UI component tương ứng
import {
  fetchMonHocsClient,
  fetchGiangViens,
  fetchLopHocs,
  fetchPhanQuyenByLoaiTK,
  fetchChucNangs,
  deleteMonHoc,
} from "../../service/monHocService"; //  Đường dẫn đến monHocService

export default function Page() {
  const [user, setUser] = useState(null);
  const [monHocs, setMonHocs] = useState([]);
  const [giangViens, setGiangViens] = useState([]);
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
    if (parsedUser.LoaiTK_Name !== "Admin") {
      router.push("/login");
      return;
    }
    setUser(parsedUser);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchMonHocsClient(setMonHocs);
      await fetchGiangViens(setGiangViens);
      await fetchLopHocs(setLopHocs);

      const quyenData = await new Promise((resolve) => {
        fetchPhanQuyenByLoaiTK(0, resolve); // 👈 ID loại tài khoản Admin
      });

      const chucNangsData = await new Promise((resolve) => {
        fetchChucNangs(resolve);
      });

      const QLMonHocId = chucNangsData.find((c) => c.code === "QLMH")?.id; // 👈 code của chức năng quản lý môn học
      const quyenQLMonHoc = quyenData.find((q) => q.IdChucNang === QLMonHocId) || {};

      setPermissions({
        Them: quyenQLMonHoc?.Them,
        Sua: quyenQLMonHoc?.Sua,
        Xoa: quyenQLMonHoc?.Xoa,
        Xem: quyenQLMonHoc?.Xem,
      });
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteMonHoc(id);
    setMonHocs((prev) => prev.filter((mh) => mh.id !== id));
  };

  return (
    <MonHocUI
      user={user}
      handleLogout={handleLogout}
      data={monHocs}
      giangViens={giangViens}
      lopHocs={lopHocs}
      permissions={permissions}
      onDelete={handleDelete}
      onSubmitSuccess={async () => {
        await fetchMonHocsClient(setMonHocs);
      }}
    />
  );
}
