"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllMonHocs,
  fetchSinhViensByLop,
  getDiemTheoLopVaMon,
  xoaBangDiem,
} from "../../service/duyetDiemService";

export default function useThongBaoLogic() {
  const [user, setUser] = useState(null);
  const [monHocs, setMonHocs] = useState([]);
  const [sinhViens, setSinhViens] = useState([]);
  const [diemList, setDiemList] = useState([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState(null);
  const [loading, setLoading] = useState(true);

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
      try {
        setLoading(true);

        if (parsedUser.LoaiTK_Name === "Giảng Viên") {
          const res = await fetch(
            `http://qltruonghoc.ddns.net/odata/GiangViens?$filter=user_id eq ${parsedUser.Id}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );
          const data = await res.json();
          if (data.value && data.value.length > 0) {
            parsedUser.GiangVien = data.value[0];
            localStorage.setItem("user", JSON.stringify(parsedUser));
          }
        }

        setUser(parsedUser);

        const monHocData = await fetchAllMonHocs();
        if (parsedUser.LoaiTK_Name === "Giảng Viên") {
          const idGiangVien = parsedUser.GiangVien?.id;
          const monHocCuaGV = monHocData.filter((mh) => mh.idGiangVien === idGiangVien);
          setMonHocs(monHocCuaGV);
        } else {
          setMonHocs(monHocData);
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu trang thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMonHocChange = async (monHocId) => {
    const monHoc = monHocs.find((mh) => mh.id === monHocId);
    if (!monHoc) return;

    setSelectedMonHoc(monHoc);

    const lopId = monHoc?.LopHoc_Id;
    if (!lopId) return;

    try {
      const [sinhViens, diemList] = await Promise.all([
        fetchSinhViensByLop(lopId),
        getDiemTheoLopVaMon(lopId, monHocId),
      ]);

      const mergedData = sinhViens.map((sv) => {
        const diem = diemList.find((d) => d.idSinhVien === sv.id);
        return {
          ...sv,
          diem: diem?.diem ?? null,
          IsDuyet: diem?.IsDuyet ?? null,
        };
      });

      setSinhViens(mergedData);
      setDiemList(diemList);
    } catch (err) {
      console.error("Lỗi khi load điểm và sinh viên:", err);
    }
  };

  const handleNhapLai = async () => {
    if (!selectedMonHoc) return;

    const idLopHoc = selectedMonHoc?.LopHoc_Id;
    const idMonHoc = selectedMonHoc?.id;

    if (!idLopHoc || !idMonHoc) {
      console.error("Thiếu idLopHoc hoặc idMonHoc");
      return;
    }

    try {
      await xoaBangDiem(idLopHoc, idMonHoc);
      router.push("/teacher/diem");
    } catch (err) {
      console.error("Lỗi khi xóa bảng điểm:", err);
    }
  };

  return {
    user,
    handleLogout,
    monHocs,
    sinhViens,
    selectedMonHoc,
    loading,
    handleMonHocChange,
    handleNhapLai,
  };
}
