"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DuyetDiemUI from "./ui";
import {
  fetchAllMonHocs,
  fetchDiemTheoMonHoc,
  fetchSinhViensByLop,
  duyetBangDiem,
  tuChoiBangDiem,
  fetchPhanQuyenByLoaiTK,
  fetchChucNangs,
} from "../../service/duyetDiemService";

export default function Page() {
  const [user, setUser] = useState(null);
  const [monHocs, setMonHocs] = useState([]);
  const [sinhViens, setSinhViens] = useState([]);
  const [diemList, setDiemList] = useState([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState(null);
  const [permissions, setPermissions] = useState({
    Xem: false,
    Duyet: false,
    TuChoi: false,
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
    if (![ "Admin"].includes(parsedUser.LoaiTK_Name)) {
      router.push("/login");
      return;
    }

    setUser(parsedUser);

    const loadData = async () => {
      const monHocData = await fetchAllMonHocs();
      setMonHocs(monHocData);

      const quyenData = await new Promise((resolve) =>{
        fetchPhanQuyenByLoaiTK(0, resolve)
    });
      const chucNangData = await new Promise((resolve) =>
        fetchChucNangs(resolve)
      );

      const chucNang = chucNangData.find((c) => c.code === "DD");
      const quyen = quyenData.find((q) => q.IdChucNang === chucNang?.id);

      setPermissions({
        Xem: quyen?.Xem || false,
        Duyet: quyen?.Duyet || false,
        TuChoi: quyen?.TuChoi || false,
      });
    };

    loadData();
  }, []);

  const handleMonHocChange = async (monHocId) => {
    setSelectedMonHoc(monHocId);
    const data = await fetchDiemTheoMonHoc(monHocId);
    setDiemList(data);
  };
   const handleLopChange = async (lopId) => {
       console.log(" Đang lấy SV cho lớp:", lopId);
       const data = await fetchSinhViensByLop(lopId, setSinhViens );
       console.log(" Danh sách SV nhận được:", data);
       setSinhViens(data);
     };

  const handleDuyet = async () => {
    if (!selectedMonHoc) return;
    await duyetBangDiem(selectedMonHoc);
    alert("✅ Bảng điểm đã được duyệt.");
    handleMonHocChange(selectedMonHoc); // reload lại dữ liệu
  };

  const handleTuChoi = async () => {
    if (!selectedMonHoc) return;
    await tuChoiBangDiem(selectedMonHoc);
    alert("❌ Bảng điểm đã bị từ chối.");
    handleMonHocChange(selectedMonHoc); // reload lại dữ liệu
  };
  return (
    <DuyetDiemUI
      user={user}
      handleLogout={handleLogout}
      monHocs={monHocs}
      diemList={diemList}
      sinhViens={sinhViens}
      selectedMonHoc={selectedMonHoc}
      onMonHocChange={handleMonHocChange}
      onLopChange={handleLopChange}
      permissions={permissions}
      onDuyet={handleDuyet}
      onTuChoi={handleTuChoi}
    />
  );
}
