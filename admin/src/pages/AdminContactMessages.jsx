import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaSyncAlt,
  FaCheck,
  FaReply,
  FaEye
} from "react-icons/fa";

import {
  getContactMessagesApi,
  updateContactMessageStatusApi
} from "../services/contactService";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getContactMessagesApi();

      const receivedMessages = Array.isArray(data)
        ? data
        : data.messages || data.data || [];

      setMessages(receivedMessages);
    } catch (err) {
      console.error("Contact messages fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load contact messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await updateContactMessageStatusApi(id, status);

      setMessages((previousMessages) =>
        previousMessages.map((message) =>
          message._id === id
            ? {
                ...message,
                status
              }
            : message
        )
      );
    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update message status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "read") {
      return "bg-yellow-500/20 text-yellow-400";
    }

    if (status === "replied") {
      return "bg-green-500/20 text-green-400";
    }

    return "bg-blue-500/20 text-blue-400";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Contact Messages
          </h1>

          <p className="text-gray-400 mt-1">
            Messages received from RoadsRiser users
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="bg-gray-900 rounded-xl p-10 text-center text-gray-400">
          Loading contact messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-10 text-center">
          <FaEnvelope className="mx-auto text-4xl text-gray-600 mb-4" />

          <h2 className="text-xl font-semibold text-white">
            No messages found
          </h2>

          <p className="text-gray-400 mt-2">
            Contact messages will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {messages.map((message) => (
            <div
              key={message._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              {/* TOP SECTION */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {message.name}
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <FaEnvelope />
                      {message.email}
                    </span>

                    {message.phone && (
                      <span className="flex items-center gap-2">
                        <FaPhone />
                        {message.phone}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`w-fit px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                    message.status
                  )}`}
                >
                  {message.status || "new"}
                </span>
              </div>

              {/* SERVICE */}
              {message.service && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Service
                  </p>

                  <p className="text-gray-200 mt-1">
                    {message.service}
                  </p>
                </div>
              )}

              {/* MESSAGE */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Message
                </p>

                <p className="text-gray-300 mt-1 whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>

              {/* DATE */}
              <p className="text-xs text-gray-500 mt-4">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleString()
                  : "Date unavailable"}
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-800">
                {message.status === "new" && (
                  <button
                    onClick={() =>
                      updateStatus(message._id, "read")
                    }
                    disabled={updatingId === message._id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white text-sm transition"
                  >
                    <FaEye />
                    Mark as Read
                  </button>
                )}

                {message.status !== "replied" && (
                  <button
                    onClick={() =>
                      updateStatus(message._id, "replied")
                    }
                    disabled={updatingId === message._id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm transition"
                  >
                    <FaCheck />
                    Mark as Replied
                  </button>
                )}

                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition"
                >
                  <FaReply />
                  Reply by Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}