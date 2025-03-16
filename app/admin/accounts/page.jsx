"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
export default function AccountManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ id: null, tenTaiKhoan: "", matKhau: "", hoTen: "", role_id: "" });
  const [user, setUser] = useState(null); // Lưu trạng thái người dùng hiện tại
  const router = useRouter();

  const toggleForm = (editUser = null) => {
    if (editUser) {
      setForm(editUser);
    } else {
      setForm({ id: null, tenTaiKhoan: "", matKhau: "", hoTen: "", role_id: ""});
    }
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  //  Fetch danh sách tài khoản
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role_id !== 1) {
      router.push("/login"); // Chuyển hướng về trang đăng nhập nếu không phải admin
      return;
    }
  
    setUser(storedUser);
  
    if (searchTerm === "") {
      fetchUsers();
    }
  }, [searchTerm, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };
  
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3001/users");
    const data = await res.json();
    setUsers(data);
  };

  //  Tìm kiếm tài khoản
  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      fetchUsers(); // Nếu ô tìm kiếm rỗng -> Hiển thị toàn bộ danh sách
      return;
    }
  
    const filteredUsers = users.filter(user =>
      user.tenTaiKhoan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.hoTen.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    setUsers(filteredUsers);
  };

  // Thêm tài khoản
  const addUser = async () => {
    const res = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenTaiKhoan: form.tenTaiKhoan,
        matKhau: form.matKhau,
        hoTen: form.hoTen,
        role_id: form.role_id
      }),
    });
  
    if (res.ok) {
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setForm({ id: null, tenTaiKhoan: "", matKhau: "", hoTen: "", role_id: "" });
    }
  };
  

  //  Cập nhật tài khoản
  const updateUser = async () => {
    const res = await fetch(`http://localhost:3001/users/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      tenTaiKhoan: form.tenTaiKhoan, 
      matKhau: form.matKhau, 
      hoTen: form.hoTen, 
      role_id: form.role_id 
      }),
    });

    if (res.ok) {
      const updatedUser = await res.json(); // ✅ Lấy `id` từ response
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setForm({ id: null, tenTaiKhoan: "", matKhau: "", hoTen: "", role_id: "" });
    }
  };

  //  Xóa tài khoản
  const deleteUser = async (id) => {
    const res = await fetch(`http://localhost:3001/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers(users.filter(user => user.id !== id));
    };
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-white text-slate-800">
      <div className="flex flex-1">
        <Sidebar user={user} className="h-auto min-h-full" />
        <main className="flex-1 p-10 flex flex-col">
          <Header user={user} onLogout={handleLogout} />
          <section className="mt-10 flex flex-col">
            <h1 className="text-3xl font-extrabold text-orange-500 text-left mb-6">Quản Lý Tài Khoản</h1>
            <div className="flex gap-3 mb-6">
              <input type="text" placeholder="Tìm kiếm tài khoản..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-3 rounded w-full" />
              <button onClick={searchUsers} className="bg-cyan-600 text-white px-5 py-3 rounded">Tìm</button>
              <button onClick={() => toggleForm()} className="bg-pink-600 text-white px-5 py-3 rounded">Thêm tài khoản</button>
            </div>
            {showForm && (
              <div className="p-6 bg-purple-50 rounded-lg shadow-md mb-6 relative">
                <button onClick={closeForm} className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded">✕</button>
                <h3 className="text-xl font-semibold mb-4">{form.id ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Tên tài khoản" value={form.tenTaiKhoan} onChange={(e) => setForm({ ...form, tenTaiKhoan: e.target.value })} className="border p-3 rounded" />
                  <input type="password" placeholder="Mật khẩu" value={form.matKhau} onChange={(e) => setForm({ ...form, matKhau: e.target.value })} className="border p-3 rounded" />
                  <input type="text" placeholder="Họ và tên" value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} className="border p-3 rounded" />
                  <select value={form.role_id} onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })} className="border p-3 rounded">
                    <option value={1}>Admin</option>
                    <option value={2}>Giảng viên</option>
                    <option value={3}>Sinh viên</option>
                  </select>
                </div>
                <button onClick={form.id ? updateUser : addUser} className="bg-rose-400 text-white px-5 py-3 mt-4 rounded w-full">{form.id ? "Cập nhật" : "Thêm"}</button>
              </div>
            )}
            <table className="w-full bg-amber-50 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-stone-400">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Tên tài khoản</th>
                  <th className="p-4 text-left">Họ tên</th>
                  <th className="p-4 text-left">Quyền</th>
                  <th className="p-4 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.tenTaiKhoan}</td>
                    <td className="p-4">{user.hoTen}</td>
                    <td className="p-4">{user.role_id === 1 ? "Admin" : user.role_id === 2 ? "Giảng viên" :  "sinh viên"}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => toggleForm(user)} className="bg-cyan-400 text-white px-3 py-1 rounded">Sửa</button>
                      <button onClick={() => deleteUser(user.id)} className="bg-orange-500 text-white px-3 py-1 rounded">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};
  
