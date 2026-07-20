import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, logout } from "../store/authSlice";
import { updateProfile, deleteAccount } from "../api/auth";
import { UpdateProfileDto } from "../types";
import { UpdateProfileForm } from "../components/profile/UpdateProfileForm";
import { DeleteAccountForm } from "../components/profile/DeleteAccountForm";

export function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // handle profile update — updates Redux store with new user data
  async function handleUpdate(data: UpdateProfileDto) {
    const updated = await updateProfile(data);
    dispatch(setUser(updated));
  }

  // handle account deletion — logs out and redirects to home
  async function handleDelete(password: string) {
    await deleteAccount({ password });
    dispatch(logout());
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">{t("profile.title")}</h1>
      <UpdateProfileForm currentName={user.name} onUpdate={handleUpdate} />
      <DeleteAccountForm onDelete={handleDelete} />
    </div>
  );
}