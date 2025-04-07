"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleListUI from "./UI";
import {
  fetchUsers,
  fetchAllFunctions,
  fetchUserFunctions,
  addFunctionToUser as addFunctionToUserService,
} from "../../service/quyenService";

export default function RoleList() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [chucNangs, setChucNangs] = useState([]);
  const [allFunctions, setAllFunctions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.LoaiTK_Id !== 0) {
        router.push("/login");
        return;
      }
      setUser(parsedUser);
      const token = localStorage.getItem("token");
      fetchUsers(token, setUsers);
      fetchAllFunctions(token, setAllFunctions);
    } catch (error) {
      console.error("Lỗi đọc dữ liệu user:", error);
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    console.log("Chọn tài khoản với ID:", userId);
    if (userId) {
      const token = localStorage.getItem("token");
      fetchUserFunctions(userId, token, setChucNangs);
    } else {
      setChucNangs([]);
    }
  };

  const addFunctionToUser = async () => {
    const token = localStorage.getItem("token");
    await addFunctionToUserService({
      selectedUser,
      selectedFunction,
      token,
      fetchUserFunctions: (id) => fetchUserFunctions(id, token, setChucNangs),
    });
  };

  return (
    <RoleListUI
      user={user}
      users={users}
      chucNangs={chucNangs}
      allFunctions={allFunctions}
      selectedUser={selectedUser}
      selectedFunction={selectedFunction}
      handleUserChange={handleUserChange}
      setSelectedFunction={setSelectedFunction}
      addFunctionToUser={addFunctionToUser}
      handleLogout={handleLogout}
    />
  );
}
