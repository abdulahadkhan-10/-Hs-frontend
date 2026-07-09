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
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerSchool: builder.mutation<any, RegisterSchoolRequest>({
      query: (schoolData) => ({
        url: 'auth/register/school',
        method: 'POST',
        body: schoolData,
      }),
    }),
    registerTeacher: builder.mutation<any, any>({
      query: (teacherData) => ({
        url: 'auth/register/teacher',
        method: 'POST',
        body: teacherData,
      }),
    }),
    registerStudent: builder.mutation<any, any>({
      query: (studentData) => ({
        url: 'auth/register/student',
        method: 'POST',
        body: studentData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterSchoolMutation,
  useRegisterTeacherMutation,
  useRegisterStudentMutation,
} = authApi;
