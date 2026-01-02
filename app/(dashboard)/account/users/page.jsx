"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Users() {
  const [users, setUsers] = useState();
  const { currentUser } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    if (!currentUser) return;
    try {
      const res = await api.get(`/admin/users`);
      setUsers(res.data.userProjects);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  return (
    <>
      {users?.map((user) => (
        <div className="p-2">{user.email}</div>
      ))}
    </>
  );
}

export default Users;
