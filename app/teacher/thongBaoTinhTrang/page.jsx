"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThongBaoUI from "./ui";
import { 
  fetchAllMonHocs,
  fetchSinhViensByLop,
  getDiemTheoLopVaMon,
  xoaBangDiem,
  fetchPhanQuyenByLoaiTK,
  fetchChucNangs,
} from "../../service/duyetDiemService";
export default function Page() {
  const [user, setUser] = useState(null);
  const [monHocs, setMonHocs] = useState([]);
  const [sinhViens, setSinhViens] = useState([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState(null);
  const [permissions, setPermissions] = useState({ Xem: false });
  const router = useRouter();

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

    setUser(parsedUser);

    const loadData = async () => {
      const monHocData = await fetchAllMonHocs(parsedUser.id);
      setMonHocs(monHocData);

      const quyenData = await new Promise((resolve) =>
        fetchPhanQuyenByLoaiTK(1, resolve)
      );
      const chucNangData = await new Promise((resolve) =>
        fetchChucNangs(resolve)
      );

      const chucNang = chucNangData.find((c) => c.code === "XD");
      const quyen = quyenData.find((q) => q.IdChucNang === chucNang?.id);

      setPermissions({ Xem: quyen?.Xem,});
    };

    loadData();
  }, []);

  const handleMonHocChange = async (monHocId) => {
    const monHoc = monHocs.find((mh) => mh.id === monHocId);
    if (!monHoc?.LopHoc?.id) return;

    setSelectedMonHoc(monHoc);

    const [sinhViens, diemList] = await Promise.all([
      fetchSinhViensByLop(monHoc.LopHoc.id),
      getDiemTheoLopVaMon(monHoc.LopHoc.id, monHoc.id),
    ]);

    const merged = sinhViens.map((sv) => {
      const diem = diemList.find((d) => d.idSinhVien === sv.id);
      return {
        ...sv,
        diem: diem?.diem ?? null,
        IsDuyet: diem?.IsDuyet ?? null,
      };
    });
-
    setSinhViens(merged);
  };

  const handleNhapLai = async () => {
    if (!selectedMonHoc) return;
    await xoaBangDiem(selectedMonHoc.id);
    router.push("/teacher/diem");
  };

  return (
    <ThongBaoUI
      user={user}
      monHocs={monHocs}
      selectedMonHoc={selectedMonHoc}
      sinhViens={sinhViens}
      onMonHocChange={handleMonHocChange}
      onNhapLai={handleNhapLai}
      permissions={permissions}
    />
  );
}
