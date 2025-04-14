"use client";

const API_BASE = "http://qltruonghoc.ddns.net/odata";

export const getToken = () => {
  return localStorage.getItem("token") || "";
};

// ======================== USERS ==========================

export async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/Users`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch Users:", error);
    return [];
  }
}

// ======================== GIẢNG VIÊN ==========================

export async function fetchGiangViens() {
  try {
    const res = await fetch(`${API_BASE}/GiangViens`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch GiangViens:", error);
    return [];
  }
}

export async function createGiangVien(newGV) {
  try {
    const res = await fetch(`${API_BASE}/GiangViens`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGV),
    });
    if (!res.ok) throw new Error("Lỗi tạo giảng viên");
    return await res.json();
  } catch (error) {
    console.error("Lỗi createGiangVien:", error);
    throw error;
  }
}

export async function updateGiangVien(id, updatedGV) {
  try {
    const res = await fetch(`${API_BASE}/GiangViens(${id})`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedGV),
    });
    if (!res.ok) throw new Error("Lỗi cập nhật giảng viên");
    return true;
  } catch (error) {
    console.error("Lỗi updateGiangVien:", error);
    throw error;
  }
}

export async function deleteGiangVien(id) {
  try {
    const res = await fetch(`${API_BASE}/GiangViens(${id})`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error("Lỗi xoá giảng viên");
    return true;
  } catch (error) {
    console.error("Lỗi deleteGiangVien:", error);
    throw error;
  }
}

// ======================== LỚP HỌC ==========================

export async function fetchLopHocs() {
  try {
    const res = await fetch(`${API_BASE}/LopHocs`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch LopHocs:", error);
    return [];
  }
}

// ======================== MÔN HỌC ==========================

export async function fetchMonHocs() {
  try {
    const res = await fetch(`${API_BASE}/MonHocs`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch MonHocs:", error);
    return [];
  }
}

export async function ganMonHocLopHoc(monHocData) {
  try {
    const res = await fetch(`${API_BASE}/MonHocs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monHocData),
    });
    if (!res.ok) throw new Error("Lỗi gán môn học và lớp học");
    return await res.json();
  } catch (error) {
    console.error("Lỗi ganMonHocLopHoc:", error);
    throw error;
  }
}
