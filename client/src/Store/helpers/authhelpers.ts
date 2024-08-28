// helpers/authHelper.ts
export const setTokensWithExpiry = (accessToken: string, refreshToken: string, accessTokenDays: number, refreshTokenDays: number) => {
    const now = new Date();
    const accessTokenExpiry = new Date(now);
    const refreshTokenExpiry = new Date(now);
  
    accessTokenExpiry.setTime(now.getTime() + accessTokenDays * 24 * 60 * 60 * 1000); // Set expiry time for access token
    refreshTokenExpiry.setTime(now.getTime() + refreshTokenDays * 24 * 60 * 60 * 1000); // Set expiry time for refresh token
  
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessTokenExpiry", accessTokenExpiry.toISOString());
    localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry.toISOString());
  };
  
  export const getTokens = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const accessTokenExpiry = localStorage.getItem("accessTokenExpiry");
    const refreshTokenExpiry = localStorage.getItem("refreshTokenExpiry");
  
    if (!accessToken || !refreshToken || !accessTokenExpiry || !refreshTokenExpiry) {
      return { accessToken: null, refreshToken: null };
    }
  
    const now = new Date();
    const accessExpiryDate = new Date(accessTokenExpiry);
    const refreshExpiryDate = new Date(refreshTokenExpiry);
  
    if (now > accessExpiryDate) {
      removeTokens();
      return { accessToken: null, refreshToken: null };
    }
  
    return { accessToken, refreshToken, refreshExpiryDate };
  };
  
  export const removeTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiry");
    localStorage.removeItem("refreshTokenExpiry");
  };
  