import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UsersService } from "../services/users.service";
import type { InviteUserDto } from "../interfaces/dto/invite-user.dto";
import type { InviteUserRespDto } from "../interfaces/dto/invite-user-resp.dto";

export const useInvitation = () => {
  const sendInvitation = useMutation<InviteUserRespDto, unknown, InviteUserDto>(
    {
      mutationFn: (data: InviteUserDto) => UsersService.inviteUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        toast.success("Invitacion enviada correctament", {});
      },
      onError: (error: unknown) => {
        console.error(error);
        toast.error("No se pudo enviar la invitacion", {});
      },
    },
  );

  return {
    sendInvitation,
  };
};
