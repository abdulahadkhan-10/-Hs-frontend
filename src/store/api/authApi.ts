import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  product: string;
  profile: any;
}

export interface LoginResponse {
  message: string;
  token: string;
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

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['User'],
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
} = authApi;
