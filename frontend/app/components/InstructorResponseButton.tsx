'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const InstructorResponseButton = (instructorNotification: {
  instructorNotification: number;
}) => {
  const router = useRouter();

  // Alert instructor on unanswered live course requests
  useEffect(() => {
    console.log(instructorNotification.instructorNotification)
    if (instructorNotification.instructorNotification > 0) {
      alert(
        `You have ${instructorNotification.instructorNotification} new live course request(s). Please respond to the request(s).`
      );
    }
  }, [instructorNotification.instructorNotification]);

  const handleLiveCourseRequest = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const requestId =
      e.currentTarget.parentNode?.parentNode?.childNodes[0]?.textContent; // Get requestId from the first cell of the row
    if (!requestId) return;

    // Send instructor response to the server
    if ((e.target as HTMLElement).textContent === 'Approve') {
      try {
        await fetch('/api/live-course-response', {
          method: 'POST',
          body: JSON.stringify({
            requestId: requestId,
            instructorResponse: true, // Approved
          }),
        });
        router.refresh();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred');
        return;
      }
    } else {
      try {
        const instructorResponse = await fetch('/api/live-course-response', {
          method: 'POST',
          body: JSON.stringify({
            requestId: requestId,
            instructorResponse: false, // Declined
          }),
        });
        const response = await instructorResponse.json();
        if (response.error) {
          alert(response.message);
          return;
        }
        router.refresh();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred');
        return;
      }
    }
  };
  return (
    <>
      <button
        onClick={(e) => handleLiveCourseRequest(e)}
        className='bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded'
      >
        Approve
      </button>
      <button
        onClick={(e) => handleLiveCourseRequest(e)}
        className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded'
      >
        Decline
      </button>
    </>
  );
};
