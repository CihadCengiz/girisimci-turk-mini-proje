'use client';
export const LiveCourseRequestButton = () => {
  // Set styles and open modal to submit live course request
  const handleOpenModal = () => {
    document.getElementById('liveRequestModal')!.style.display = 'flex';
    document.getElementById('liveRequestModal')!.style.justifyContent = 'center';
    document.getElementById('liveRequestModal')!.style.textAlign = 'center';
    document.getElementById('liveRequestModal')!.style.alignItems = 'center';
  };
  return (
    <button
      onClick={handleOpenModal}
      className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded w-full'
    >
      Live Course Request
    </button>
  );
};
