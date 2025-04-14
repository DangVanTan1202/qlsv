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
    console.log(data);
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
  // Cập nhật thông tin người dùng
export async function updateUser(userId, updatedData) {
  try {
    const res = await fetch(`http://qltruonghoc.ddns.net/odata/Users(${userId})`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      throw new Error("Lỗi khi cập nhật tài khoản");
    }

    // Nếu response có body thì mới parse JSON, còn không thì return success status
    if (res.status === 204) {
      return { success: true }; // Không có nội dung trả về
    }

    const data = await res.json();
    console.log("➡️ Payload gửi khi cập nhật:", updatedData);

    return data;
  } catch (error) {
    console.error("Lỗi updateUser:", error);
    throw error;
  }
}

// Xoá người dùng
export async function deleteUser(userId) {
  try {
    const res = await fetch(`http://qltruonghoc.ddns.net/odata/Users(${userId})`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      throw new Error("Lỗi khi xoá tài khoản");
    }

    return true;
  } catch (error) {
    console.error("Lỗi deleteUser:", error);
    throw error;
  }
}
export async function createUser(newUser) {
  try {
    const res = await fetch("http://qltruonghoc.ddns.net/odata/Users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    
    if (!res.ok) {
      throw new Error("Lỗi khi tạo tài khoản");
    }

    const data = await res.json();
    console.log("➡️ Payload gửi khi tạo:", newUser);
    return data;
  } catch (error) {
    console.error("Lỗi createUser:", error);
    throw error;
  }
}


  
  