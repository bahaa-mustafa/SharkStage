import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import Link from "next/link";
import {
  Ban,
  Bell,
  CheckCircle,
  Inbox,
  MessageCircle,
  XCircle,
} from "lucide-react";
function Notifications() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);

  const [userNotifications, setUserNotifications] = useState([]);
  const fetchUserNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await api.get(`/notifications/user`);
      setUserNotifications(res.data.userNotifications);
    } catch (err) {
      console.error(err);
    }
  };
  const markAsRead = async (notId) => {
    try {
      await api.patch(`/notifications/read/${notId}`);
      fetchUserNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, [currentUser]);
  return (
    <div className="relative">
      <button
        className="relative p-2 rounded "
        onClick={() => setNotificationsOpen(!notificationsOpen)}
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-background" />
        {userNotifications.filter((ele) => ele.isRead == false).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {userNotifications.filter((ele) => ele.isRead == false).length}
          </span>
        )}
      </button>
      {notificationsOpen && (
        <div className="absolute right-0 top-10 bg-white dark:bg-background-dark shadow-lg rounded-lg w-64 z-50">
          <p className="font-semibold p-3 ps-5">Notifications</p>
          <ul className="space-y-2 text-sm h-48 overflow-auto">
            {userNotifications.map((n, i) => (
              <Link
                href={n.link}
                key={i}
                onClick={() => {
                  markAsRead(n._id);
                }}
                className={`${
                  !n.isRead ? "bg-blue-300/50 hover:bg-blue-300/60" : null
                } p-2 hover:bg-gray-100 rounded cursor-pointer flex gap-2`}
              >
                {n.type == "offer_sent" ? (
                  <Inbox color="grey" />
                ) : n.type == "offer_cancelled" ? (
                  <XCircle color="red" />
                ) : n.type == "offer_accepted" ? (
                  <CheckCircle color="green" />
                ) : n.type == "offer_rejected" ? (
                  <Ban color="red" />
                ) : n.type == "message" ? (
                  <MessageCircle color="grey" />
                ) : null}
                <span>{n.message}</span>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notifications;
