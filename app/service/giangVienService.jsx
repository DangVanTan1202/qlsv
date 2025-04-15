const API_BASE = 'http://qltruonghoc.ddns.net/odata';

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem("token") || "";
};

// 👉 Dùng trong Server Component
export const fetchGiangViens = async () => {
  try {
    const res = await fetch(`${API_BASE}/GiangViens?$expand=User`);
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch giảng viên:", error);
    return [];
  }
};

// 👉 Dùng trong Client Component
export const fetchGiangViensClient = async (setGiangViens) => {
  try {
    const res = await fetch(`${API_BASE}/GiangViens?$expand=User`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setGiangViens(data.value || []);
  } catch (error) {
    console.error("Lỗi fetch giảng viên:", error);
  }
};
// Lấy danh sách user
export const fetchUsers = async (setUsers) => {
  try {
    const res = await fetch(`${API_BASE}/Users`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    setUsers(data.value || []);
  } catch (error) {
    console.error("Lỗi fetch users:", error);
  }
};

// Lấy danh sách lớp học
export const fetchLopHocs = async (setLopHocs) => {
  try {
    const res = await fetch(`${API_BASE}/LopHocs`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    setLopHocs(data.value || []);
  } catch (error) {
    console.error("Lỗi fetch lớp học:", error);
  }
};

// Lấy danh sách môn học
export const fetchMonHocs = async (setMonHocs) => {
  try {
    const res = await fetch(`${API_BASE}/MonHocs`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    setMonHocs(data.value || []);
  } catch (error) {
    console.error("Lỗi fetch môn học:", error);
  }
};

// Thêm giảng viên
export const addGiangVien = async (data) => {
  try {
    const res = await fetch(`${API_BASE}/GiangViens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Lỗi thêm: ${error}`);
    }

    console.log("Thêm giảng viên thành công");
  } catch (error) {
    console.error("Lỗi thêm giảng viên:", error);
  }
};
// Cập nhật giảng viên
export const updateGiangVien = async (id, data) => {
  try {
    const res = await fetch(`${API_BASE}/GiangViens(${id})`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Lỗi cập nhật: ${error}`);
    }

    console.log("Cập nhật giảng viên thành công");
  } catch (error) {
    console.error("Lỗi cập nhật giảng viên:", error);
  }
};

// Xoá giảng viên
export const deleteGiangVien = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/GiangViens(${id})`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Lỗi xoá: ${error}`);
    }

    console.log("Xoá giảng viên thành công");
  } catch (error) {
    console.error("Lỗi xoá giảng viên:", error);
  }
};
// Lấy danh sách chức năng
export const fetchChucNangs = async (setChucNangs) => {
  try {
    const res = await fetch("http://qltruonghoc.ddns.net/odata/ChucNangs", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    setChucNangs(data.value || []);
  } catch (error) {
    console.error("Lỗi fetch chức năng:", error);
  }
};
// Lấy danh sách phân quyền theo loại tài khoản
export const fetchPhanQuyenByLoaiTK = async (idLoaiTK, setPhanQuyenList) => {
  try {
    const res = await fetch(`http://qltruonghoc.ddns.net/odata/PhanQuyen_LoaiTK?$filter=IdLoaiTK eq ${idLoaiTK}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    const data = await res.json();
    setPhanQuyenList(data.value || []);
  } catch (error) {
    console.error("Lỗi fetch phân quyền:", error);
  }
};
