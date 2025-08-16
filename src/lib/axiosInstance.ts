import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

// Define the shape of your token refresh response
interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: "https://api.fundos.services/staging/v1",
});

export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("phoneNumber");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("invitationCode");
  sessionStorage.removeItem("subAdminId");
  toast.error("You have been logged out due to session expiration.");
  // Redirect to login or home page if needed
  window.location.href = "/";

  axios
    .post("https://api.fundos.services/staging/v1/auth/logout")
    .then(() => {
      console.log("Logged out successfully");
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
};

// Token queue for failed requests during refresh
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Handle 401 and 403 responses and try refresh token flow
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle both 401 and 403 errors for authentication issues
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token: any) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post<RefreshTokenResponse>(
          "https://api.fundos.services/staging/v1/auth/refresh",
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } =
          refreshResponse.data;

        // Store new tokens
        localStorage.setItem("accessToken", access_token);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        processQueue(null, access_token);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        handleLogout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
