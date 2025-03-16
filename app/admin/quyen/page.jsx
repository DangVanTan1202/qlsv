"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function RoleList() {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [chucNangs, setChucNangs] = useState([]); 
  const router = useRouter();

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role_id !== 1) {
      router.push("/login");
      return;
    }
    setUser(storedUser);
    fetchRoles();
    fetchChucNangs();
  }, [router]);

  // Fetch danh sách quyền
  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:3001/roles");
      if (!res.ok) throw new Error("Không thể lấy dữ liệu roles");
      const data = await res.json();
      console.log("Fetched roles:", data); // Debug
      setRoles(data);
    } catch (error) {
      console.error("Lỗi khi lấy roles:", error.message);
    }
  };

  // Fetch danh sách chức năng
  const fetchChucNangs = async () => {
    try {
      const res = await fetch("http://localhost:3001/chucNang");
      if (!res.ok) throw new Error("Không thể lấy dữ liệu chức năng");
      const data = await res.json();
      console.log("Fetched chucNangs:", data); // Debug
      setChucNangs(data);
    } catch (error) {
      console.error("Lỗi khi lấy chức năng:", error.message);
    }
  };

  // Hàm cập nhật quyền
  const updateRolePermission = async (roleId, field, value) => {
    try {
      const updatedRoles = roles.map((role) =>
        role.id === roleId ? { ...role, [field]: value } : role
      );
      setRoles(updatedRoles);

      const roleToUpdate = updatedRoles.find((role) => role.id === roleId);
      if (!roleToUpdate) {
        console.error("Không tìm thấy role để cập nhật");
        return;
      }

      const res = await fetch(`http://localhost:3001/roles/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleToUpdate),
      });

      if (!res.ok) {
        console.error("Lỗi cập nhật quyền:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error.message);
    }
  };

  // Debug kiểm tra dữ liệu
  useEffect(() => {
    console.log("Roles:", roles);
    console.log("ChucNangs:", chucNangs);
  }, [roles, chucNangs]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <Sidebar user={user} className="h-auto min-h-full" />
      <div className="flex flex-col flex-1">
        <Header user={user} nLogout={handleLogout} />
        <div className="p-6 bg-white shadow-md rounded-lg m-4">
          <h2 className="text-2xl font-semibold mb-4">Quản lý quyền</h2>
          <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-300 text-gray-800">
                <th className="border p-2">Tên quyền</th>
                <th className="border p-2">Chức năng</th>
                <th className="border p-2">Thêm</th>
                <th className="border p-2">Sửa</th>
                <th className="border p-2">Xóa</th>
                <th className="border p-2">Duyệt</th>
                <th className="border p-2">Xem</th>
                <th className="border p-2">Từ chối</th>
                <th className="border p-2">Nộp</th>
              </tr>
            </thead>
            <tbody>
                  {roles.length > 0 && chucNangs.length > 0 ? (
                    roles
                     .filter((role) => role.name !== "Admin")
                   .map((role) => {
                        const chucNang = chucNangs.find((cn) => Number(cn.id) === Number(role.idChucNang)) || { name: "Không xác định" };
                         return (
                        <tr key={role.id} className="hover:bg-gray-100">
                     <td className="border p-2">{role.name.trim()}</td>
                        <td className="border p-2">{chucNang.name.trim()}</td>
                        {["them", "sua", "xoa", "duyet", "xem", "tu_choi", "nop"].map((field) => (
                  <td key={field} className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={role[field]}
                  onChange={(e) => updateRolePermission(role.id, field, e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </td>
            ))}
          </tr>
        );
      })
  ) : (
    <tr>
      <td colSpan="9" className="text-center p-4">Đang tải dữ liệu...</td>
    </tr>
  )}
 </tbody>
</table>
    </div>
     </div>
    </div>
  );
}
