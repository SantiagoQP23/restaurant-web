import { useMutation } from "@tanstack/react-query";
import type { LoginRespDto } from "../interfaces/dto/login-resp.dto";
import { toast } from "sonner";
import { AuthService } from "../services/auth.service";

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
