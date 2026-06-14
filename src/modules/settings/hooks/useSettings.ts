import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SettingsService } from "../services/settings.service";
import { queryClient } from "@/app/api/query-client";
import { toast } from "sonner";
import type { SettingsResponse, UpdateSettingsDto } from "../interfaces/dto/settings-response.dto";
import type { ApiErrorRespDto } from "@/shared/interfaces/dto/api-error-resp.dto";

const DEFAULT_SETTINGS: SettingsResponse = {
  ORDER_PREP_TIME: 15,
  SOUND_ENABLED: true,
  DEFAULT_PRINTER: "",
};

export const useSettings = () => {
  const getAllQuery = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  const [localSettings, setLocalSettings] = useState<SettingsResponse>(DEFAULT_SETTINGS);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (getAllQuery.isSuccess && getAllQuery.data && !hasInitialized.current) {
      setLocalSettings(getAllQuery.data);
      hasInitialized.current = true;
    }
  }, [getAllQuery.data, getAllQuery.isSuccess]);

  const updateSettings = useMutation<SettingsResponse, ApiErrorRespDto, UpdateSettingsDto>({
    mutationFn: (data: UpdateSettingsDto) => SettingsService.updateSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
      toast.success("Preferencias guardadas");
    },
    onError: (error) => {
      console.log("Error saving settings", error);
      toast.error("Error al guardar preferencias");
    },
  });

  const handleUpdateSettings = (newSettings: Partial<SettingsResponse>) => {
    const updatedSettings = { ...localSettings, ...newSettings };
    setLocalSettings(updatedSettings);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateSettings.mutate(updatedSettings);
    }, 500);
  };

  return {
    settings: localSettings,
    isLoading: getAllQuery.isLoading,
    isSaving: updateSettings.isPending,
    handleUpdateSettings,
  };
};
