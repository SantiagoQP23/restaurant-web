export interface ApiErrorRespDto {
  data: {
    statusCode: number;
    message: string | string[];
    error: string;
  };
}
