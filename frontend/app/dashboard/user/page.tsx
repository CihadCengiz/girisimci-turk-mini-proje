import { CourseTable } from '../../components/CourseTable';
import { Course, getCourses } from '@/lib/db';
import { LogoutButton } from '../../components/LogoutButton';
import { MyCoursesButton } from '../../components/MyCoursesButton';
import { cookies } from 'next/headers';
import { LiveCourseRequestButton } from '@/app/components/LiveCourseRequestButton';
import { Modal } from '@/app/components/Modal';

const User = async () => {
  // Get session cookie
  const cookieStore = await cookies();
  const userCookies = cookieStore.get('girisimci_turk_session');
  // Fetch all courses
  const courseData: Course[] = await getCourses(userCookies!);

  return (
    <>
      <Modal courseList={courseData} />
      <div className='w-full h-full p-4 space-y-4'>
        <div className='grid grid-cols-3 items-center'>
          <h1 className='text-2xl font-bold col-start-2 text-center'>
            Dashboard
          </h1>
          <input
            type='text'
            placeholder='Search courses...'
            className='border rounded px-2 py-1'
          />
        </div>
        <div className='grid grid-cols-6 gap-4 grid-rows-3 h-[90vh]'>
          <div
            id='menu'
            className='border col-span-1 row-span-3 flex flex-col gap-0.5'
          >
            <MyCoursesButton />
            <LiveCourseRequestButton />
            <div className='mt-auto w-full'>
              <LogoutButton />
            </div>
          </div>
          <div id='content' className='border col-span-5 row-span-3'>
            <CourseTable courseData={courseData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
