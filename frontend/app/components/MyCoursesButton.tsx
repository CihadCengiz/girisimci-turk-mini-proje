"use client"
import { redirect } from "next/navigation";

// Redirect to My Courses page
export const MyCoursesButton = () => {
  return (
    <button
      onClick={() => redirect('/dashboard/user/my-courses')}
      className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded'
    >
      My Courses
    </button>
  );
};
