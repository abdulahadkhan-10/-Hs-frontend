import { authApi } from './authApi';

export const profileApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: 'auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<any, { oldPassword: string; newPassword: string }>({
      query: (body) => ({
        url: 'auth/password',
        method: 'PUT',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
