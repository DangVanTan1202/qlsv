"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountUI from "./UI";
import {
  fetchUsersClient,
  fetchLoaiTaiKhoans,
  fetchPhanQuyenByLoaiTK,
  fetchChucNangs,
  deleteUser,
} from "../../service/accountService";

export default function Page() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loaiTaiKhoans, setLoaiTaiKhoans] = useState([]);
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
      await fetchUsersClient(setUsers);
      await fetchLoaiTaiKhoans(setLoaiTaiKhoans);

      const quyenData = await new Promise((resolve) => {
        fetchPhanQuyenByLoaiTK(0, resolve); // 👈 Admin có IdLoaiTK = 0
      });

      const chucNangsData = await new Promise((resolve) => {
        fetchChucNangs(resolve);
      });

      const QLTaiKhoanId = chucNangsData.find((c) => c.code === "QLTK")?.id; // 👈 code của chức năng quản lý tài khoản
      const quyenQLTaiKhoan = quyenData.find((q) => q.IdChucNang === QLTaiKhoanId) || {};

      setPermissions({
        Them: quyenQLTaiKhoan?.Them,
        Sua: quyenQLTaiKhoan?.Sua,
        Xoa: quyenQLTaiKhoan?.Xoa,
        Xem: quyenQLTaiKhoan?.Xem,
      });
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <AccountUI
      user={user}
      handleLogout={handleLogout}
      data={users}
      loaiTaiKhoans={loaiTaiKhoans}
      permissions={permissions}
      onDelete={handleDelete}
      onSubmitSuccess={async () => {
        await fetchUsersClient(setUsers);
      }}
    />
  );
}
