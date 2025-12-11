import { InstructorResponseButton } from '@/app/components/InstructorResponseButton';
import { LogoutButton } from '@/app/components/LogoutButton';
import { getInstructorLiveCourseRequests } from '@/lib/db';
import { cookies } from 'next/headers';

const InstructorDashboard = async () => {
  // Get session cookie
  const cookieStore = await cookies();
  const instructorCookies = cookieStore.get('girisimci_turk_session');
  // Fetch live course requests for the instructor
  const liveCourseRequests = instructorCookies
    ? await getInstructorLiveCourseRequests(instructorCookies)
    : [];
  // Pending request count for notification
  const instructorNotification = liveCourseRequests.filter(
    (request) => request.status === 'Pending'
  ).length;

  return (
    <div className='p-6'>
      <h1 className='mt-2 mb-2 font-bold'>Live Course Requests</h1>
      <table className='w-full border-collapse'>
        <thead>
          <tr>
            <th className='border'>Live Request Id</th>
            <th className='border'>Field Name</th>
            <th className='border'>Topic Name</th>
            <th className='border'>User</th>
            <th className='border'>Status</th>
          </tr>
        </thead>
        <tbody>
          {liveCourseRequests.length > 0 &&
            liveCourseRequests.map((request) => {
              return (
                /* Render each live course request as a table row */
                <tr key={request.id}>
                  <td className='border px-4 py-2 text-center'>{request.id}</td>
                  <td className='border px-4 py-2 text-center'>
                    {request.fieldName}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {request.topicName}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    {request.userName}
                  </td>
                  <td className='border px-4 py-2 flex w-auto justify-center gap-2'>
                    {request.status === 'Pending' ? (
                      <InstructorResponseButton
                        instructorNotification={instructorNotification}
                      />
                    ) : request.status === 'Approved' ? (
                      <p className='text-green-400'>{request.status}</p>
                    ) : (
                      <p className='text-red-400'>{request.status}</p>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className='fixed bottom-4 right-4 w-32'>
        <LogoutButton />
      </div>
    </div>
  );
};

export default InstructorDashboard;
