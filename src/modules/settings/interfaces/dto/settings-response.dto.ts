export interface SettingsResponse {
  ORDER_PREP_TIME: number;
  SOUND_ENABLED: boolean;
  DEFAULT_PRINTER: string;
}

export interface UpdateSettingsDto {
  ORDER_PREP_TIME: number;
  SOUND_ENABLED: boolean;
  DEFAULT_PRINTER: string;
}
