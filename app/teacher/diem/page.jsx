"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NopDiemUI from "./ui";
import {
  fetchMonHocsByGiangVien,
  fetchSinhViensByLop,
  submitDiem,
  fetchChucNangs,
  fetchPhanQuyenByLoaiTK,
} from "../../service/nopDiemService";

export default function Page() {
  const [user, setUser] = useState(null);
  const [monHocs, setMonHocs] = useState([]);
  const [sinhViens, setSinhViens] = useState([]);
  const [permissions, setPermissions] = useState({
    Xem: false,
    Nop: false,
  });

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (!["Giảng Viên", "Admin"].includes(parsedUser.LoaiTK_Name)) {
      router.push("/login");
      return;
    }
    const loadData = async () => {
      if (parsedUser.LoaiTK_Name === "Giảng Viên") {
        const res = await fetch(`http://qltruonghoc.ddns.net/odata/GiangViens?$filter=user_id eq ${parsedUser.Id}`,{
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },   
        });
        const data = await res.json();
        if (data.value && data.value.length > 0) {
          parsedUser.GiangVien = data.value[0]; // gán vào parsedUser
          localStorage.setItem("user", JSON.stringify(parsedUser)); // cập nhật lại localStorage
        }
      }
      setUser(parsedUser); 
      console.log(" ID giảng viên trong user:", parsedUser.GiangVien?.id);
      const monHocData = await fetchMonHocsByGiangVien(parsedUser.GiangVien?.id);
      console.log("📚 Môn học tìm thấy:", monHocData);
      setMonHocs(monHocData);

      const quyenData = await new Promise((resolve) =>
        fetchPhanQuyenByLoaiTK(1, resolve)
      );
      const chucNangData = await new Promise((resolve) =>
        fetchChucNangs(resolve)
      );

      const chucNangNopDiem = chucNangData.find(
        (c) => c.code === "QLDS"
      );
      const quyenNopDiem = quyenData.find(
        (q) => q.IdChucNang === chucNangNopDiem?.id
      );
      setPermissions({
        Xem: quyenNopDiem?.Xem,
        Nop: quyenNopDiem?.Nop,
      });
    };
    loadData();
  }, []);
  const handleLopChange = async (lopId) => {
    console.log(" Đang lấy SV cho lớp:", lopId);
    const data = await fetchSinhViensByLop(lopId, setSinhViens );
    console.log(" Danh sách SV nhận được:", data);
    setSinhViens(data);
  };
  const handleSubmit = async (dsDiem) => {
    let successCount = 0;
    let errorMessages = [];
  
    for (const d of dsDiem) {
      try {
        await submitDiem(d);
        successCount++;
      } catch (error) {
        // ✅ Tìm mã sinh viên từ danh sách sinh viên
        const sv = sinhViens.find((s) => s.id === d.idSinhVien);
        const maSinhVien = sv?.maSinhVien || `ID ${d.idSinhVien}`;
        errorMessages.push(`mã sinh viên ${maSinhVien}: ${error.message}`);
      }
    }
  
    // ✅ Thông báo tổng kết
    if (successCount > 0) {
      alert(`✅ Đã nộp điểm cho ${successCount} sinh viên.`);
    }
  
    if (errorMessages.length > 0) {
      alert(
        `⚠️ Một số sinh viên đã có điểm và không được ghi lại:\n\n${errorMessages.join(
          "\n"
        )}`
      );
    }
  };
  
  
  return (
    <NopDiemUI
      user={user}
      handleLogout={handleLogout}
      monHocs={monHocs}
      sinhViens={sinhViens}
      permissions={permissions}
      onLopChange={handleLopChange}
      onSubmit={handleSubmit}
    />
  );
}
