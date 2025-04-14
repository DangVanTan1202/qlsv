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
  createUser
} from "../../service/accountService";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loaiTKs, setLoaiTKs] = useState([]);
  const [phanQuyen, setPhanQuyen] = useState([]);
  const [selectedLoaiTKId, setSelectedLoaiTKId] = useState("");
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [userList, loaiList] = await Promise.all([
      fetchUsers(),
      fetchLoaiTKs()
    ]);
    setUsers(userList);
    setLoaiTKs(loaiList);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedLoaiTKId) {
      fetchPhanQuyenLoaiTK(selectedLoaiTKId).then(setPhanQuyen);
    } else {
      setPhanQuyen([]);
    }
  }, [selectedLoaiTKId]);

  const handleCreateOrUpdateUser = async (data, isEdit = false) => {
    if (isEdit) {
      await updateUser(data.id, data);
    } else {
      await createUser(data);
    }
    loadData();
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    loadData();
  };

  return (
    <AccountUI
      user={user}
      handleLogout={handleLogout}
      users={users}
      loaiTKs={loaiTKs}
      phanQuyen={phanQuyen}
      selectedLoaiTKId={selectedLoaiTKId}
      setSelectedLoaiTKId={setSelectedLoaiTKId}
      onSaveUser={handleCreateOrUpdateUser}
      onDeleteUser={handleDeleteUser}
      loading={loading}
    />
  );
}
