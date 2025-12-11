'use client';

import { Course } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Modal = ({ courseList }: { courseList: Course[] }) => {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<string>('default');
  const [selectedTopic, setSelectedTopic] = useState<string>('default');

  // Generate unique field list
  const fieldList = [
    ...new Set(
      courseList.map((course) => course.field[course.field.length - 1])
    ),
  ];
  const filteredFields = courseList.filter((course) =>
    course.field.includes(selectedField)
  );
  // Generate topic list based on selected field
  const topicList = filteredFields.map((course) => course.field[0]);

  // Request live course with selected field and topic
  const handleLiveCourseRequest = async () => {
    if (selectedField === 'default' || selectedTopic === 'default') {
      alert('Please select a field.');
      return;
    }
    try {
      const requestLiveCourse = await fetch('/api/live-course-request', {
        method: 'POST',
        body: JSON.stringify({
          fieldName: selectedField,
          topicName: selectedTopic,
        }),
      });
      const response = await requestLiveCourse.json();
      if (!requestLiveCourse.ok) {
        alert('Live course request failed: ' + response.message);
        return;
      }
      alert(response.message + " You will be redirected to 'My courses' page.");
      router.push('/dashboard/user/my-courses');
    } catch (err) {
      console.error('Live course request failed:', err);
      alert(
        err instanceof Error
          ? 'Live course request failed: ' + err.message
          : 'Live course request failed'
      );
    }
  };

  // Close the live course request modal
  const handleCloseModal = () => {
    document.getElementById('liveRequestModal')!.style.display = 'none';
  };

  return (
    <div
      id='liveRequestModal'
      className='hidden fixed z-1 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.4)]'
    >
      <div className='bg-gray-400 border-2 border-red-500 w-[40%] h-[30%] flex justify-between flex-col p-4'>
        <div className='border-red-200 w-[50%] mx-auto flex flex-col'>
          <label htmlFor='courses' className='font-bold'>
            Fields:
          </label>
          <select
            name='courses'
            id='courses'
            className='border-2 m-2 bg-gray-500'
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option key='default' value='default' className='text-center'>
              Select a field
            </option>
            {fieldList.length > 0 &&
              fieldList.map((field, index) => (
                /* Render each field as an option */
                <option key={index} value={field} className='text-center'>
                  {field}
                </option>
              ))}
          </select>
          <label htmlFor='courses' className='font-bold'>
            Topic:
          </label>
          <select
            name='courses'
            id='courses'
            className='border-2 m-2 bg-gray-500'
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option key='default' value='default' className='text-center'>
              Select a field
            </option>
            {topicList.length > 0 &&
              topicList.map((field, index) => (
                /* Render each topic as an option */
                <option key={index} value={field} className='text-center'>
                  {field}
                </option>
              ))}
          </select>
        </div>
        <div className='flex justify-between gap-3'>
          <button
            onClick={handleCloseModal}
            className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 rounded w-[50%]'
          >
            Cancel
          </button>
          <button
            onClick={handleLiveCourseRequest}
            className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 rounded w-[50%]'
          >
            Live Course Request
          </button>
        </div>
      </div>
    </div>
  );
};
