import { useTranslation } from "react-i18next";
import { User } from "../../types";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";

interface Props {
  user: User;
  currentUser?: User | null;
  onRoleChange: (userId: string, currentRole: string) => void;
  onDelete: (userId: string) => void;
}

export function UserRow({ user, currentUser, onRoleChange, onDelete }: Props) {
  const { t } = useTranslation();
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isSelf = currentUser?.id === user.id;
  const nextRole = user.role === "admin" ? "user" : "admin";
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      {/* name */}
      <td className="px-4 py-3 text-white text-sm">
        {user.name || t("admin.anonymousUser", "Anonymous")}
      </td>

      {/* email */}
      <td className="px-4 py-3 text-white/70 text-sm">{user.email || "—"}</td>

      {/* role badge */}
      <td className="px-4 py-3">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            user.role === "admin"
              ? "bg-purple-500/20 text-purple-300"
              : "bg-white/10 text-white/60"
          }`}
        >
          {user.role}
        </span>
      </td>

      {/* actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {/* toggle role */}
          {isSelf ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-white/20 text-white/30 hover:bg-yellow-500/50 text-xs "
            >
              {nextRole === "admin"
                ? t("make Admin")
                : t("make User")}
            </Button>
          ) : (
            <AlertDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
              <AlertDialogTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRoleDialogOpen(true)}
                  className="border-white/20 text-black/70 hover:text-black/90 hover:bg-yellow-500/90 text-xs cursor-pointer"
                >
                  {nextRole === "admin"
                    ? t("make Admin")
                    : t("make User")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("admin.changeRole")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`Are you sure you want to change ${user.name}'s role to ${nextRole}?`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setRoleDialogOpen(false)}>
                    {t("common.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onRoleChange(user.id, user.role);
                      setRoleDialogOpen(false);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {t("common.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* delete with confirmation */}
          {isSelf ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-red-400/30 text-red-300/30 text-xs cursor-not-allowed opacity-30"
            >
              {t("admin.deleteUser")}
            </Button>
          ) : (
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-red-400/30 text-black-300 hover:bg-red-500/80 text-xs cursor-pointer"
                >
                  {t("admin.deleteUser")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("admin.deleteUser")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.deleteUserConfirm")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                    {t("common.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDelete(user.id);
                      setDeleteDialogOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {t("admin.deleteUser")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </td>
    </tr>
  );
}
