"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  fetchLoaiTKs,
  fetchPhanQuyenLoaiTK,
  fetchChucNangs,
  updateUser,
  deleteUser,
  createUser,
} from "../../service/accountService";
import { Edit, Trash2, PlusCircle } from "lucide-react"; // Import icons from lucide-react

export default function AccountManagerUI({ users }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loaiTKList, setLoaiTKList] = useState([]);
  const [phanQuyenMap, setPhanQuyenMap] = useState({});
  const [chucNangs, setChucNangs] = useState([]);
  const [editUser, setEditUser] = useState(null);
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
      if (parsedUser.LoaiTK_Name!== "Admin") {
        router.push("/login");
        return;
      }
      setUser(parsedUser);
      const token = localStorage.getItem("token");
      fetchUsers(token, setUsers);
    } catch (error) {
      console.error("Lỗi đọc dữ liệu user:", error);
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setCurrentUser(JSON.parse(userFromStorage));
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [roles, chucnangs] = await Promise.all([
        fetchLoaiTKs(),
        fetchChucNangs(),
      ]);
      setLoaiTKList(roles);
      setChucNangs(chucnangs);

      const uniqueLoaiTKIds = [...new Set(users.map((u) => u.LoaiTK_Id))];
      const allPermissions = {};
      await Promise.all(
        uniqueLoaiTKIds.map(async (id) => {
          const pq = await fetchPhanQuyenLoaiTK(id);
          allPermissions[id] = pq;
        })
      );
      setPhanQuyenMap(allPermissions);
    };

    if (users?.length) loadData();
  }, [users]);

  const getQuyen = (loaiTKId, chucNangCode, action) => {
    const chucNang = chucNangs.find((c) => c.code === chucNangCode);
    if (!chucNang) return false;
    const danhSachQuyen = phanQuyenMap[Number(loaiTKId)] || [];
    const quyen = danhSachQuyen.find((p) => p.IdChucNang === chucNang.id);
    if (!quyen) return false;
    const key = action.charAt(0).toUpperCase() + action.slice(1);
    return quyen[key] === true;
  };

  const handleFormSubmit = async () => {
    if (!editUser.tenTaiKhoan || !editUser.matKhau) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (editUser.id) {
      await updateUser(editUser.id, editUser);
      alert("Đã cập nhật!");
    } else {
      await createUser(editUser);
      alert("Đã thêm mới!");
    }

    setEditUser(null);
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xoá tài khoản này?")) {
      await deleteUser(id);
      alert("Đã xoá!");
      window.location.reload();
    }
  };

  if (!currentUser) return <div className="text-center mt-10">Đang tải...</div>;

  const currentLoaiTK = currentUser.LoaiTK_Id;
  const canThem = getQuyen(currentLoaiTK, "QLTK", "them");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
    <Sidebar user={user} />
    <div className="flex-1 px-8 py-6">
      <Header user={user} onLogout={handleLogout} />
    <div className="p-8 space-y-6 bg-base-100 text-base-content">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-orange-600">
           Quản lý tài khoản
        </h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="input input-bordered input-sm w-60 rounded-lg py-2 px-4 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ease-in-out"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {canThem && (
           <button
           className="btn btn-sm btn-primary bg-cyan-600 hover:bg-cyan-600 text-white rounded-full flex items-center gap-0"
           onClick={() =>
             setEditUser({
               tenTaiKhoan: "",
               hoTen: "",
               matKhau: "",
               LoaiTK_Id: loaiTKList[0]?.Id || 1,
             })
           }
         >
           <PlusCircle size={40} />
           Thêm
         </button>
         
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl shadow-md bg-white mt-4">
        <table className="table w-full table-zebra text-base">
          <thead className="bg-orange-100 text-orange-700 text-base font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Tài khoản</th>
              <th className="px-4 py-3 text-left">Họ tên</th>
              <th className="px-4 py-3 text-left">Loại</th>
              <th className="px-4 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => {
                const text = searchText.toLowerCase();
                return (
                  user.tenTaiKhoan?.toLowerCase().includes(text) ||
                  user.hoTen?.toLowerCase().includes(text)
                );
              })
              .map((user) => {
                const role = loaiTKList.find((r) => r.Id === user.LoaiTK_Id);
                const canXem = getQuyen(currentLoaiTK, "QLTK", "xem");
                const canSua = getQuyen(currentLoaiTK, "QLTK", "sua");
                const canXoa = getQuyen(currentLoaiTK, "QLTK", "xoa");

                if (!canXem) return null;

                return (
                  <tr key={user.id} className="hover:bg-orange-50">
                    <td className="px-4 py-3">{user.tenTaiKhoan}</td>
                    <td className="px-4 py-3">{user.hoTen}</td>
                    <td className="px-4 py-3">{role?.Name || "N/A"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {canSua && (
                          <button
                            className="btn btn-sm btn-info text-sky-700 flex items-center gap-1"
                            onClick={() => setEditUser(user)}
                          >
                            <Edit size={16} /> Sửa
                          </button>
                        )}
                        {canXoa && (
                          <button
                            className="btn btn-sm btn-error text-pink-700 flex items-center gap-1"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 size={16} /> Xoá
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-orange-600">
              {editUser.id ? "Cập nhật tài khoản" : "Thêm tài khoản"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên tài khoản"
                value={editUser.tenTaiKhoan}
                onChange={(e) =>
                  setEditUser({ ...editUser, tenTaiKhoan: e.target.value })
                }
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Họ tên"
                value={editUser.hoTen}
                onChange={(e) =>
                  setEditUser({ ...editUser, hoTen: e.target.value })
                }
                className="input input-bordered w-full"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={editUser.matKhau}
                onChange={(e) =>
                  setEditUser({ ...editUser, matKhau: e.target.value })
                }
                className="input input-bordered w-full"
              />
              <select
                value={editUser.LoaiTK_Id}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    LoaiTK_Id: Number(e.target.value),
                  })
                }
                className="select select-bordered w-full"
              >
                {loaiTKList.map((role) => (
                  <option key={role.Id} value={role.Id}>
                    {role.Name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditUser(null)}
                className="btn btn-sm btn-outline"
              >
                Huỷ
              </button>
              <button
                onClick={handleFormSubmit}
                className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
              >
                {editUser.id ? "Lưu thay đổi" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}
