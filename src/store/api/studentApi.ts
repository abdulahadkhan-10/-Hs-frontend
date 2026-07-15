import { authApi } from './authApi';

export interface BulkStudentUploadResponse {
  success: boolean;
  successCount: number;
  failureCount: number;
  results: {
    email: string;
    name: string;
    success: boolean;
    error?: string;
  }[];
}

export const studentApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    addStudent: builder.mutation<any, any>({
      query: (studentData) => ({
        url: 'students/register',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Teachers'],
    }),
    bulkUploadStudents: builder.mutation<BulkStudentUploadResponse, { classId: string; students: any[] }>({
      query: (data) => ({
        url: 'students/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddStudentMutation,
  useBulkUploadStudentsMutation,
} = studentApi;
