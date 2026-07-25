import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllUsers, adminUpdateUser, adminDeleteUser } from "../api/admin";
import { User } from "../types";
import { UserTable } from "../components/admin/UserTable";
import { useAppSelector } from "../store/hooks";
export function AdminPage() {
  const { t } = useTranslation();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch all users when page loads
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // toggle user role between user and admin
  async function handleRoleChange(userId: string, currentRole: string) {
  const newRole = currentRole === "admin" ? "user" : "admin";
  setError(null);

  if (currentRole === "admin") {
    const adminCount = users.filter((u) => u.role === "admin").length;
    if (adminCount <= 1) {
      setError(t("admin.errors.lastAdmin", "Cannot demote the last active admin."));
      return;
    }
  }

  try {
    const updated = await adminUpdateUser(userId, { role: newRole });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
    );
  } catch (err: unknown) {
    if (err instanceof Error) setError(err.message);
  }
}

  // delete a user and remove from list
  async function handleDelete(userId: string) {
    setError(null);

    if (currentUser?.id === userId) {
    setError(t("admin.errors.cannotDeleteSelf", "You cannot delete your own account."));
    return;
  }
  
    try {
      await adminDeleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/60">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">{t("admin.title")}</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <UserTable
        users={users}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
