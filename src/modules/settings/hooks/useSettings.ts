import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SettingsService } from "../services/settings.service";
import { queryClient } from "@/app/api/query-client";
import { toast } from "sonner";
import type { SettingsResponse, UpdateSettingsDto } from "../interfaces/dto/settings-response.dto";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

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

  const updateSettings = useMutation<SettingsResponse, unknown, UpdateSettingsDto>({
    mutationFn: (data: UpdateSettingsDto) => SettingsService.updateSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
      toast.success("Preferencias guardadas");
    },
    onError: (error) => {
      console.log("Error saving settings", error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.settings.update") }),
      );
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
