"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
export default function RoleListUI({
  user,
  users,
  chucNangs,
  allFunctions,
  selectedUser,
  selectedFunction,
  handleUserChange,
  setSelectedFunction,
  addFunctionToUser,
  handleLogout,
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar user={user} />
      <div className="flex-1 p-6">
        <Header user={user} onLogout={handleLogout} />
        <h2 className="text-3xl font-extrabold text-orange-500 text-left mb-6">Quản lý chức năng</h2>
        {/* Tìm kiếm tài khoản */}
        <div className="mb-4">
          <label className=" block font-medium">Tìm tài khoản:</label>
          <input
            type="text"
            list="userList"
            className="border p-2 rounded w-full"
            placeholder="Nhập tên tài khoản hoặc họ tên..."
            onChange={(e) => {
              const selected = users.find(
                (u) => `${u.tenTaiKhoan} (${u.hoTen})` === e.target.value
              );
              if (selected) {
                handleUserChange({ target: { value: selected.id } });
              }
            }}
          />
          <datalist id="userList">
            {users.map((user) => (
              <option
                key={user.id}
                value={`${user.tenTaiKhoan} (${user.hoTen})`}
              />
            ))}
          </datalist>
        </div>

        {/* Dropdown chọn chức năng */}
        <div className="mb-4">
          <label className="block font-medium">Chọn chức năng:</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedFunction}
            onChange={(e) => setSelectedFunction(e.target.value)}
          >
            <option value="">-- Chọn chức năng --</option>
            {Array.isArray(allFunctions) &&
              allFunctions.map((chucNang) => (
                <option key={chucNang.id} value={chucNang.id}>
                  {chucNang.tenChucNang} {chucNang.name}
                </option>
              ))}
          </select>
        </div>

        {/* Nút Thêm chức năng */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addFunctionToUser}
        >
          Thêm chức năng
        </button>
        {/* Bảng danh sách chức năng của user */}
        {selectedUser && chucNangs.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-2">
              Danh sách chức năng
            </h3>
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-300 text-gray-800">
                  <th className="border p-2">Tên Chức Năng</th>
                  {["them", "sua", "xoa", "duyet", "xem", "tu_choi", "nop"].map(
                    (perm) => (
                      <th key={perm} className="border p-2 capitalize">
                        {perm.replace("_", " ")}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {chucNangs.map((chucNang) => (
                  <tr key={chucNang.Id} className="hover:bg-gray-100">
                    <td className="border p-2">{chucNang.Name}</td>
                    {[
                      "them",
                      "sua",
                      "xoa",
                      "duyet",
                      "xem",
                      "tu_choi",
                      "nop",
                    ].map((perm) => (
                      <td key={perm} className="border p-2 text-center">
                        <input
                          type="checkbox"
                          checked={chucNang.Role?.[perm] === true}
                          readOnly
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}