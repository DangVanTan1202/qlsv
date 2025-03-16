"use client";

import { useState, useEffect } from "react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState(null);
   
  useEffect(() => {
    fetch("http://localhost:3001/sinhVien")
      .then((res) => res.json())
      .then((data) => setStudents(data));

    fetch("http://localhost:3001/lopHoc")
      .then((res) => res.json())
      .then((data) => setClasses(data));

    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const availableUsers = users.filter(
    (user) => !students.some((student) => student.user_id === user.id)
  );

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleSaveEdit = () => {
    fetch(`http://localhost:3001/sinhVien/${editingStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingStudent),
    }).then(() => {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? editingStudent : s))
      );
      setEditingStudent(null);
    });
  };

  const handleSaveNew = () => {
    fetch("http://localhost:3001/sinhVien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    }).then((res) => res.json())
      .then((data) => {
        setStudents([...students, data]);
        setNewStudent(null);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quản lý Sinh viên</h1>
      <button
        className="bg-green-500 text-white px-3 py-2 rounded mb-4"
        onClick={() => setNewStudent({ maSinhVien: "", ngaySinh: "", idLopHoc: "", user_id: "" })}
      >
        + Thêm Sinh Viên
      </button>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Mã Sinh Viên</th>
            <th className="border px-4 py-2">Ngày Sinh</th>
            <th className="border px-4 py-2">Lớp Học</th>
            <th className="border px-4 py-2">Tài Khoản</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border">
              <td className="border px-4 py-2">{student.maSinhVien}</td>
              <td className="border px-4 py-2">{student.ngaySinh}</td>
              <td className="border px-4 py-2">
                {classes.find((c) => c.id === student.idLopHoc)?.tenLop || "Chưa có"}
              </td>
              <td className="border px-4 py-2">
                {users.find((u) => u.id === student.user_id)?.hoTen || "Chưa có"}
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(student)}
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(editingStudent || newStudent) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-lg font-bold mb-2">
              {editingStudent ? "Chỉnh sửa sinh viên" : "Thêm sinh viên"}
            </h2>
            <label className="block">Mã Sinh Viên:</label>
            <input
              type="text"
              value={editingStudent?.maSinhVien || newStudent?.maSinhVien}
              onChange={(e) => {
                const value = e.target.value;
                editingStudent
                  ? setEditingStudent({ ...editingStudent, maSinhVien: value })
                  : setNewStudent({ ...newStudent, maSinhVien: value });
              }}
              className="border p-2 w-full"
            />
            <label className="block mt-2">Ngày Sinh:</label>
            <input
              type="date"
              value={editingStudent?.ngaySinh || newStudent?.ngaySinh}
              onChange={(e) => {
                const value = e.target.value;
                editingStudent
                  ? setEditingStudent({ ...editingStudent, ngaySinh: value })
                  : setNewStudent({ ...newStudent, ngaySinh: value });
              }}
              className="border p-2 w-full"
            />
            <label className="block mt-2">Lớp Học:</label>
            <select
              value={editingStudent?.idLopHoc || newStudent?.idLopHoc}
              onChange={(e) => {
                const value = Number(e.target.value);
                editingStudent
                  ? setEditingStudent({ ...editingStudent, idLopHoc: value })
                  : setNewStudent({ ...newStudent, idLopHoc: value });
              }}
              className="border p-2 w-full"
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.tenLop}</option>
              ))}
            </select>
            {!editingStudent && (
              <>
                <label className="block mt-2">Tài Khoản:</label>
                <select 
             value={newStudent.user_id || ""}
               onChange={(e) =>
                     setNewStudent({ ...newStudent, user_id: Number(e.target.value) })
                   }
                  className="border p-2 w-full"
                 >
               <option value="">-- Chọn tài khoản --</option>
                {users
                .filter((u) => u.role_id === 3) // Chỉ lấy tài khoản có role_id = 3 (Sinh viên)
                 .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.hoTen}
                  </option>
                        ))}
                    </select>
              </>
            )}
            <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded" onClick={editingStudent ? handleSaveEdit : handleSaveNew}>Lưu</button>
          </div>
        </div>
      )}
    </div>
  );
}