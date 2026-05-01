import { UserSchema, userSchema } from "@/features/dashboard/forms/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const DEFAULT_VALUES = (initialValues?: UserSchema) => {
  if (!initialValues) {
    return {
      email: "",
      fullName: "",
      role: "officer",
    };
  }
};

export const useUserForm = (initialValues?: UserSchema) => {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });

  const handleSubmit = (data: UserSchema) => {};

  return { form, onSubmit: form.handleSubmit(handleSubmit) };
};
