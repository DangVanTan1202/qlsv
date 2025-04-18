const API_BASE = "http://qltruonghoc.ddns.net/odata";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// 1. Lấy tất cả môn học (gồm lớp học và giảng viên)
export const fetchAllMonHocs = async () => {
  try {
    const res = await fetch(`${API_BASE}/MonHocs?$expand=GiangVien,LopHoc`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch tất cả môn học:", error);
    return [];
  }
};

// 2. Lấy danh sách sinh viên theo lớp (bao gồm họ tên từ User)
export const fetchSinhViensByLop = async (idLopHoc) => {
  try {
    const res = await fetch(`${API_BASE}/SinhViens?$filter=idLopHoc eq ${idLopHoc}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const sinhViensData = await res.json();
    const sinhViens = sinhViensData.value || [];

    const sinhViensWithNames = await Promise.all(
      sinhViens.map(async (sv) => {
        const userRes = await fetch(`${API_BASE}/Users?$filter=id eq ${sv.user_id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const userData = await userRes.json();
        const user = userData.value[0] || {};
        return {
          ...sv,
          hoTen: user.hoTen || "Chưa có họ tên",
        };
      })
    );

    return sinhViensWithNames;
  } catch (error) {
    console.error("Lỗi fetch sinh viên theo lớp:", error);
    return [];
  }
};

//  Lấy điểm số của sinh viên theo môn học
export const fetchDiemTheoMonHoc = async (idMonHoc) => {
  try {
    const res = await fetch(`${API_BASE}/DiemSoes?$filter=idMonHoc eq ${idMonHoc}&$expand=SinhVien`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    return data.value || [];
  } catch (error) {
    console.error("Lỗi fetch điểm theo môn học:", error);
    return [];
  }
};
//  Duyệt toàn bộ điểm trong danh sách (IsDuyet = true)
export const duyetBangDiem = async (dsDiem) => {
    try {
      await Promise.all(
        dsDiem.map((d) =>
          fetch(`${API_BASE}/DiemSoes(${d.id})`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ IsDuyet: true }),
          })
        )
      );
    } catch (error) {
      console.error("Lỗi duyệt bảng điểm:", error);
      throw error;
    }
  };
  //  Từ chối toàn bộ điểm trong danh sách (IsDuyet = false)
  export const tuChoiBangDiem = async (dsDiem) => {
    try {
      await Promise.all(
        dsDiem.map((d) =>
          fetch(`${API_BASE}/DiemSoes(${d.id})`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ IsDuyet: false }),
          })
        )
      );
    } catch (error) {
      console.error("Lỗi từ chối bảng điểm:", error);
      throw error;
    }
  };
  
// Lấy danh sách chức năng
export const fetchChucNangs = async (setChucNangs) => {
  try {
    const res = await fetch(`${API_BASE}/ChucNangs`, {
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
    const res = await fetch(`${API_BASE}/PhanQuyen_LoaiTK?$filter=IdLoaiTK eq ${idLoaiTK}`, {
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
  
