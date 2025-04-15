"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountUI from "./UI";
import {
  fetchUsers,
  fetchLoaiTKs,
  fetchPhanQuyenLoaiTK,
  updateUser,
  deleteUser,
  createUser,
} from "../../service/accountService";
export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loaiTKs, setLoaiTKs] = useState([]);
  const [phanQuyen, setPhanQuyen] = useState([]);
  const [loading, setLoading] = useState(true);
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
    loadData(parsedUser.LoaiTK_Id);
  }, []);

  const loadData = async (loaiTKId) => {
    setLoading(true);
    const [userList, loaiList, phanQuyenList] = await Promise.all([
      fetchUsers(),
      fetchLoaiTKs(),
      fetchPhanQuyenLoaiTK(loaiTKId),
    ]);
    setUsers(userList);
    setLoaiTKs(loaiList);
    setPhanQuyen(phanQuyenList);
    setLoading(false);
  };

  const handleCreateOrUpdateUser = async (data, isEdit = false) => {
    if (isEdit) {
      await updateUser(data.id, data);
    } else {
      await createUser(data);
    }
    loadData(user.LoaiTK_Id);
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    loadData(user.LoaiTK_Id);
  };

  return (
    <AccountUI
      user={user}
      handleLogout={handleLogout}
      users={users}
      loaiTKs={loaiTKs}
      phanQuyen={phanQuyen}
      onSaveUser={handleCreateOrUpdateUser}
      onDeleteUser={handleDeleteUser}
      loading={loading}
    />
  );
}
