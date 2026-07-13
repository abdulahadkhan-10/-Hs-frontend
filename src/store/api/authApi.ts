import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  product: string;
  profile: any;
}

export interface LoginResponse {
  message: string;
  token?: string; // Optional since it's stored in cookie now
  user: UserProfile;
}

export interface RegisterSchoolRequest {
  schoolName: string;
  schoolKey: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  region: string;
  email: string;
  password?: string;
}

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const baseQuery = fetchBaseQuery({ baseUrl: '/api/' });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If already refreshing, wait and retry when done
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(baseQuery(args, api, extraOptions));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResult = await baseQuery(
        { url: 'auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        isRefreshing = false;
        onRefreshed();
        result = await baseQuery(args, api, extraOptions);
      } else {
        isRefreshing = false;
        refreshSubscribers = [];
        api.dispatch(logout());
      }
    } catch (err) {
      isRefreshing = false;
      refreshSubscribers = [];
      api.dispatch(logout());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Teachers'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    registerSchool: builder.mutation<any, RegisterSchoolRequest>({
      query: (schoolData) => ({
        url: 'auth/register/school',
        method: 'POST',
        body: schoolData,
      }),
      invalidatesTags: ['User'],
    }),
    registerTeacher: builder.mutation<any, any>({
      query: (teacherData) => ({
        url: 'auth/register/teacher',
        method: 'POST',
        body: teacherData,
      }),
      invalidatesTags: ['User'],
    }),
    registerStudent: builder.mutation<any, any>({
      query: (studentData) => ({
        url: 'auth/register/student',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query<any, void>({
      query: () => 'auth/me',
      providesTags: ['User'],
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterSchoolMutation,
  useRegisterTeacherMutation,
  useRegisterStudentMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
