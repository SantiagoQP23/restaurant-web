import { useMutation } from "@tanstack/react-query";
import type { LoginRespDto } from "../interfaces/dto/login-resp.dto";
import type { RegisterUserDto } from "../interfaces/dto/register-user.dto";
import { toast } from "sonner";
import { AuthService } from "../services/auth.service";
import { authRegister } from "../actions/auth.actions";
import { useAuthStore } from "../store/auth.store";

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
    onError: () => {
      toast.error("Error al cambiar de restaurante");
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
    { data: { message: string } },
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
    onError: (error: { data: { message: string } }) => {
      toast.error(error?.data?.message || "Error al registrar el usuario");
    },
  });
};
