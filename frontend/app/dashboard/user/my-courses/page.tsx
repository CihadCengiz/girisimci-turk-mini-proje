import { HomeButton } from '@/app/components/HomeButton';
import { Course, getCourses, getUserLiveCourseRequests } from '@/lib/db';
import Image from 'next/image';
import { cookies } from 'next/headers';

const MyCourses = async () => {
  // Get session cookie
  const cookieStore = await cookies();
  const userCookies = cookieStore.get('girisimci_turk_session');
  // Fetch courses the user has access to
  const courseData: Course[] = userCookies
    ? (await getCourses(userCookies)).filter(
        (course) => course.userCourseAccess
      )
    : [];

  // Fetch course requests created by the user
  const liveCourseRequests = userCookies
    ? await getUserLiveCourseRequests(userCookies)
    : [];

  return (
    <div className='p-6'>
      <h1 className='mb-2 font-bold'>My Courses</h1>
      <table className='w-full border-collapse'>
        <thead>
          <tr>
            <th className='border'>Course Id</th>
            <th className='border'>Course Name</th>
            <th className='border'>Description</th>
            <th className='border'>Instructor</th>
            <th className='border flex justify-center p-1'>
              <Image src='/cart.png' width={25} height={25} alt='Cart icon' />
            </th>
          </tr>
        </thead>
        <tbody>
          {courseData.length > 0 &&
            courseData.map((course) => {
              return (
                /* Render each course row */
                <tr key={course.id}>
                  <td className='border px-4 py-2 text-center'>{course.id}</td>
                  <td className='border px-4 py-2 text-center'>
                    {course.title}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {course.description}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {course.instructorName}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded'>
                      Start the Course
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <h1 className='mt-2 mb-2 font-bold'>Live Course Requests</h1>
      <table className='w-full border-collapse'>
        <thead>
          <tr>
            <th className='border'>Live Request Id</th>
            <th className='border'>Field Name</th>
            <th className='border'>Topic Name</th>
            <th className='border'>Instructor</th>
            <th className='border'>Status</th>
          </tr>
        </thead>
        <tbody>
          {liveCourseRequests.length > 0 &&
            liveCourseRequests.map((request) => {
              return (
                /* Render each live course request row */
                <tr key={request.id}>
                  <td className='border px-4 py-2 text-center'>{request.id}</td>
                  <td className='border px-4 py-2 text-center'>
                    {request.fieldName}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {request.topicName}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {request.instructorName}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {request.status === 'Approved' ? (
                      <p className='text-green-400'>{request.status}</p>
                    ) : request.status === 'Declined' ? (
                      <p className='text-red-400'>{request.status}</p>
                    ) : (
                      <p className='text-white'>{request.status}</p>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <HomeButton />
    </div>
  );
};

export default MyCourses;
