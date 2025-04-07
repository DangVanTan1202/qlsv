export const fetchUsers = async (token, setUsers) => {
    if (!token) return;
    try {
      const res = await fetch("http://qltruonghoc.ddns.net/odata/Users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách tài khoản");
      const data = await res.json();
      console.log("Danh sách tài khoản:", data);
      setUsers(data.value || []);
    } catch (error) {
      console.error(error);
    }
  };
  
  export const fetchAllFunctions = async (token, setAllFunctions) => {
    if (!token) return;
    try {
      const res = await fetch("http://qltruonghoc.ddns.net/odata/ChucNangs", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách chức năng!");
      const data = await res.json();
      console.log("Danh sách chức năng từ bảng ChucNang:", data);
      if (data.value && Array.isArray(data.value)) {
        setAllFunctions(data.value);
      } else {
        console.error("Dữ liệu không đúng định dạng:", data);
        setAllFunctions([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export const fetchUserFunctions = async (idUser, token, setChucNangs) => {
    if (!token) return;
    try {
      const res = await fetch(`http://qltruonghoc.ddns.net/QuanLyTaiKhoan/GetChucNangUser?idUser=${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách chức năng");
      const data = await res.json();
      console.log("Dữ liệu chức năng từ API:", data);
      if (data.existChucNang && Array.isArray(data.existChucNang)) {
        setChucNangs(data.existChucNang);
      } else {
        console.error("Dữ liệu không đúng định dạng, API trả về:", data);
        setChucNangs([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export const addFunctionToUser = async ({ selectedUser, selectedFunction, token, fetchUserFunctions }) => {
    if (!selectedUser || !selectedFunction) {
      alert("Vui lòng chọn tài khoản và chức năng!");
      return;
    }
    if (!token) return;
  
    try {
      const bodyData = {
        IdUser: parseInt(selectedUser),
        ListChucNang_Id: [parseInt(selectedFunction)],
      };
  
      console.log("Dữ liệu gửi đi:", JSON.stringify(bodyData));
  
      const res = await fetch("http://qltruonghoc.ddns.net/QuanLyTaiKhoan/ThemChucNang", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Lỗi khi thêm chức năng!", errorData);
        throw new Error(errorData.Message || "Lỗi không xác định");
      }
  
      alert("Thêm chức năng thành công!");
      fetchUserFunctions(selectedUser);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra! " + error.message);
    }
  };
  