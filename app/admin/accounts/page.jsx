"use client";

import { useEffect, useState } from "react";
import { fetchUsers } from "../../service/accountService";
import AccountManagerUI from "./UI";

export default function AccountPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return <AccountManagerUI users={users} />;
}
