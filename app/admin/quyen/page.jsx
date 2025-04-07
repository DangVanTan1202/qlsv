"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleListUI from "./UI";
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
      fetchUsers();
      fetchAllFunctions();
    } catch (error) {
      console.error("Lỗi đọc dữ liệu user:", error);
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://qltruonghoc.ddns.net/odata/Users", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách tài khoản");
      const data = await res.json();
      console.log("Danh sách tài khoản:", data);
      setUsers(data.value || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllFunctions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://qltruonghoc.ddns.net/odata/ChucNangs", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách chức năng!");
      const data = await res.json();
      console.log("Danh sách chức năng từ bảng ChucNang:", data);
      if (data.value && Array.isArray(data.value)) {
               setAllFunctions(data.value);
              } else {
                console.error("Dữ liệu không đúng định dạng:", data);
                setAllFunctions([]);
           }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserFunctions = async (idUser) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://qltruonghoc.ddns.net/QuanLyTaiKhoan/GetChucNangUser?idUser=${idUser}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách chức năng");
      const data = await res.json();
      console.log("Dữ liệu chức năng từ API:", data);
        // hiển thị danh sách chưc năng của user được chọn
       if (data.existChucNang && Array.isArray(data.existChucNang)) {
        setChucNangs(data.existChucNang);
      } else {
       console.error("Dữ liệu không đúng định dạng, API trả về:", data);
       setChucNangs([]);
    }
    
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    console.log("Chọn tài khoản với ID:", userId);
    if (userId) fetchUserFunctions(userId);
    else setChucNangs([]);
  };

  const addFunctionToUser = async () => {
    if (!selectedUser || !selectedFunction) {
      alert("Vui lòng chọn tài khoản và chức năng!");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const bodyData = {
        IdUser: parseInt(selectedUser), // Đảm bảo gửi số
        ListChucNang_Id: [parseInt(selectedFunction)], // Gửi mảng chứa ID
      };
  
      console.log("Dữ liệu gửi đi:", JSON.stringify(bodyData));
  
      const res = await fetch("http://qltruonghoc.ddns.net/QuanLyTaiKhoan/ThemChucNang", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Lỗi khi thêm chức năng!", errorData);
        throw new Error(errorData.Message || "Lỗi không xác định");
      }
  
      alert("Thêm chức năng thành công!");
      fetchUserFunctions(selectedUser);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra! " + error.message);
    }
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
