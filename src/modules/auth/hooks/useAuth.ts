import { useMutation } from "@tanstack/react-query";
import type { LoginRespDto } from "../interfaces/dto/login-resp.dto";
import type { RegisterUserDto } from "../interfaces/dto/register-user.dto";
import { toast } from "sonner";
import { AuthService } from "../services/auth.service";
import { authRegister } from "../actions/auth.actions";
import { useAuthStore } from "../store/auth.store";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useAuth = () => {
  const switchRestaurantMutation = useMutation<LoginRespDto, unknown, string>({
    mutationFn: (restaurantId: string) =>
      AuthService.switchRestaurant(restaurantId),
    onSuccess: (data: LoginRespDto) => {
      // setRestaurant(data.currentRestaurant);
      // dispatch(onLogin(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", String(new Date().getTime()));
      // setRestaurant(data.currentRestaurant);
      window.location.reload();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.auth.switchRestaurant") }),
      );
    },
  });

  return {
    switchRestaurant: switchRestaurantMutation,
  };
};

export const useSignup = () => {
  const changeStatus = useAuthStore((state) => state.changeStatus);

  return useMutation<
    LoginRespDto,
    unknown,
    RegisterUserDto
  >({
    mutationFn: async (data: RegisterUserDto) => {
      const resp = await authRegister(data);
      await changeStatus(resp.token, resp.user, resp.currentRestaurant);
      return {
        token: resp.token,
        user: resp.user,
        currentRestaurant: resp.currentRestaurant ?? null,
      };
    },
    onSuccess: () => {
      toast.success("Cuenta creada exitosamente");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.auth.register") }),
      );
    },
  });
};
