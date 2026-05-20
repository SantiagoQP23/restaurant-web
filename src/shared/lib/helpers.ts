export const getEnvVariables = () => {
  // import.meta.env;
  return {
    VITE_API_URL: `${import.meta.env.VITE_SERVER_URL}/api`,
    VITE_WS_URL: `${import.meta.env.VITE_SERVER_URL}/socket.io/socket.io.js`,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  };
};
