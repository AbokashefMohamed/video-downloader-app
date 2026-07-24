import { useTranslation } from "react-i18next";
import { User } from "../../types";
import { UserRow } from "./UserRow";

interface Props {
  users: User[];
  currentUser?: User | null;
  onRoleChange: (userId: string, currentRole: string) => void;
  onDelete: (userId: string) => void;
}

export function UserTable({ users, currentUser, onRoleChange, onDelete }: Props) {
  const { t } = useTranslation();
  if (!users || users.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
        <p className="text-white/40">{t("admin.noUsers", "No users found")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-white/60 text-sm font-medium px-4 py-3">
                {t("auth.name")}
              </th>
              <th className="text-left text-white/60 text-sm font-medium px-4 py-3">
                {t("auth.email")}
              </th>
              <th className="text-left text-white/60 text-sm font-medium px-4 py-3">
                {t("admin.role")}
              </th>
              <th className="text-right text-white/60 text-sm font-medium px-4 py-3">
                {t("admin.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserRow
                key={user.id || user.email || index}
                user={user}
                currentUser={currentUser}
                onRoleChange={onRoleChange}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}