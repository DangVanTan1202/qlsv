"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import XemDiemUI from "./ui";
import {
  fetchDiemBySinhVienId,
  fetchPhanQuyenByLoaiTK,
  fetchChucNangs,
  fetchSinhVienByUserId,
  fetchUserById // Cần hàm này để lấy thông tin giảng viên từ bảng User
} from "../../service/xemDiem";

export default function Page() {
  const [user, setUser] = useState(null);
  const [diemData, setDiemData] = useState([]);
  const [permissions, setPermissions] = useState({
    Xem: false,
  });

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
    if (!["Sinh Viên", "Admin"].includes(parsedUser.LoaiTK_Name)) {
      router.push("/login");
      return;
    }
  
    setUser(parsedUser);
  
    const loadPermissionsAndData = async () => {
        try {
          const quyenData = await new Promise((resolve) => {
            fetchPhanQuyenByLoaiTK(2, resolve);
          });
      
          const chucNangsData = await new Promise((resolve) => {
            fetchChucNangs(resolve);
          });
      
          const XDId = chucNangsData.find((c) => c.code === "XD")?.id;
          const quyenXemDiem = quyenData.find((q) => q.IdChucNang === XDId) || {};
          const hasXem = quyenXemDiem?.Xem;
      
          setPermissions({ Xem: hasXem });
      
          if (hasXem) {
            const userId = parsedUser?.id || parsedUser?.user_id || parsedUser?.Id;
            if (!userId) {
              throw new Error("Không tìm thấy ID người dùng hợp lệ.");
            }
      
            const sinhVien = await fetchSinhVienByUserId(userId);
            const rawData = await fetchDiemBySinhVienId(sinhVien.id);
      
            // 🧠 Với mỗi item, lấy tên giảng viên thông qua user_id
            const mappedData = await Promise.all(
              rawData.map(async (item) => {
                let tenGiangVien = "N/A";
                const giangVienUserId = item.GiangVien?.user_id;
                if (giangVienUserId) {
                  try {
                    const userGV = await fetchUserById(giangVienUserId);
                    tenGiangVien = userGV?.hoTen || "N/A";
                  } catch (error) {
                    console.error("❌ Lỗi khi lấy thông tin giảng viên:", error);
                  }
                }
      
                return {
                  maMonHoc: item.MonHoc?.maMonHoc || "N/A",
                  tenMonHoc: item.MonHoc?.tenMonHoc || "N/A",
                  tenGiangVien: tenGiangVien,
                  diem: item.diem ?? "Chưa có",
                };
              })
            );
      
            setDiemData(mappedData);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu điểm:", error);
        }
      };
  
    loadPermissionsAndData();
  }, []);
  

  return (
    <XemDiemUI
      user={user}
      handleLogout={handleLogout}
      data={diemData}
      permissions={permissions}
    />
  );
}
