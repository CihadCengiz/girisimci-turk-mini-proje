'use client';

import { Course } from '@/lib/db';
import Image from 'next/image';

export const CourseTable = ({ courseData }: { courseData: Course[] }) => {
  return (
    <div>
      <table className='w-full border-collapse'>
        <thead>
          <tr>
            <th className='border'>Course Id</th>
            <th className='border'>Course Name</th>
            <th className='border'>Description</th>
            <th className='border'>Instructor</th>
            <th className='border'>Price</th>
            <th className='border flex justify-center p-1'>
              <Image src='/cart.png' width={25} height={25} alt='Cart icon' />
            </th>
          </tr>
        </thead>
        <tbody>
          {courseData.length > 0 &&
            courseData.map((course) => {
              // Render each course as a table row
              return (
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
                    {course.price + ' ' + course.currency}
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <form
                      action='/api/checkout_sessions'
                      target='_blank'
                      method='POST'
                    >
                      <input
                        type='hidden'
                        name='productPriceId'
                        value={course.priceId}
                      />
                      {course.userCourseAccess ? (
                        <div className='flex justify-center p-1'>
                          <Image
                            src='/owned.png'
                            width={40}
                            height={40}
                            alt='Cart icon'
                          />
                        </div>
                      ) : (
                        <button
                          type='submit'
                          className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded'
                        >
                          Purchase
                        </button>
                      )}
                    </form>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className='mt-4 p-4 border rounded w-[50vh] h-auto'>
        <h1 className='font-bold'>Test Payment Data</h1>
        <p>
          <b>Email:</b> test@test.com
        </p>
        <p>
          <b>Card Number:</b> 4242 4242 4242 4242
        </p>
        <p>
          <b>Expiry Date:</b> 11/33
        </p>
        <p>
          <b>CVC:</b> 111
        </p>
        <p>
          <b>Cardholder Name:</b> Test
        </p>
      </div>
    </div>
  );
};
