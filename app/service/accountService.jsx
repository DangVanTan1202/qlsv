"use client";
export const getToken = () => {
    return localStorage.getItem("token") || "";
}
// BASE URL cho tất cả các API
const API_BASE = "http://qltruonghoc.ddns.net/odata";

export async function fetchUsers() {
    try {
  const token = getToken();
  const res = await fetch("http://qltruonghoc.ddns.net/odata/Users",{
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Lỗi khi lấy danh sách tài khoản");
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch Users:", error);
    return [];
  }
}
//  GET danh sách loại tài khoản
export async function fetchLoaiTKs() {
    try{
  const res = await fetch("http://qltruonghoc.ddns.net/odata/DM_LoaiTK");
  const data = await res.json();
  return data.value;
}catch (error) {
    console.error("Lỗi fetch loại tài khoản:", error);
    return [];
  }
}
  export const fetchChucNangs = async () => {
    try {
      const res = await fetch("http://qltruonghoc.ddns.net/odata/ChucNangs", {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      return data.value || [];
    } catch (error) {
      console.error("Lỗi fetch chức năng:", error);
      return [];
    }
  };
  export async function fetchPhanQuyenLoaiTK(loaiTKId) {
    try {
      const res = await fetch(
        `http://qltruonghoc.ddns.net/odata/PhanQuyen_LoaiTK?$filter=IdLoaiTK eq ${loaiTKId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      return data.value || [];
    } catch (error) {
      console.error("Lỗi fetch phân quyền loại tài khoản:", error);
      return [];
    }
  }
  