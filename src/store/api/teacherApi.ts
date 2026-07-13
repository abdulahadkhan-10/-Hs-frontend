import { authApi } from './authApi';

export interface ClassInfo {
  id: string;
  grade: string;
  division: string;
  classTeacherId?: string | null;
}

export interface TeacherProfile {
  id: string;
  name: string;
  phone?: string;
  qualification?: string;
  expertise?: string;
  schoolId: string;
  user: {
    email: string;
    isActive: boolean;
  };
  classes: ClassInfo[];
  classTeacherOf: ClassInfo[];
}

export interface BulkUploadResponse {
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

export const teacherApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<{ teachers: TeacherProfile[] }, string>({
      query: (schoolId) => `teachers/school/${schoolId}`,
      providesTags: ['Teachers'],
    }),
    addTeacher: builder.mutation<any, any>({
      query: (teacherData) => ({
        url: 'teachers/register',
        method: 'POST',
        body: teacherData,
      }),
      invalidatesTags: ['Teachers'],
    }),
    bulkUploadTeachers: builder.mutation<BulkUploadResponse, { schoolId: string; teachers: any[] }>({
      query: (data) => ({
        url: 'teachers/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),
    getSchoolClasses: builder.query<{ classes: any[] }, string>({
      query: (schoolId) => `classes/school/${schoolId}`,
      providesTags: ['Teachers'],
    }),
    createClass: builder.mutation<any, any>({
      query: (classData) => ({
        url: 'classes',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Teachers'],
    }),
    assignClassTeacher: builder.mutation<any, { classId: string; teacherId: string | null }>({
      query: (data) => ({
        url: 'teachers/assign-class-teacher',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeachersQuery,
  useAddTeacherMutation,
  useBulkUploadTeachersMutation,
  useGetSchoolClassesQuery,
  useCreateClassMutation,
  useAssignClassTeacherMutation,
} = teacherApi;
