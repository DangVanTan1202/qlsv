"use client";
import { useEffect, useState } from "react";
import {fetchGiangViens, fetchUsers, fetchLopHocs, fetchMonHocs  } from "../../service/giangVienService";
import GiangVienUI from "./UI";

export default function QuanLyGiangVienPage() {
  const [giangViens, setGiangViens] = useState([]);
  const [users, setUsers] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [gv, us, lop, mon] = await Promise.all([
      fetchGiangViens(),
      fetchUsers(),
      fetchLopHocs(),
      fetchMonHocs(),
    ]);
    setGiangViens(gv);
    setUsers(us.filter(u => u.LoaiTK_Id === 1)); // Chỉ lấy tài khoản giảng viên
    setLopHocs(lop);
    setMonHocs(mon);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <GiangVienUI
      giangViens={giangViens}
      users={users}
      lopHocs={lopHocs}
      monHocs={monHocs}
      fetchData={fetchData}
      loading={loading}
    />
  );
}
