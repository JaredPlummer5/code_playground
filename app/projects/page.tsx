"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded) {
      fetchProjects();
    }
  }, [user]);
  const fetchProjects = async () => {
    try {
      const res = await fetch(`./api/User/projects/${user.username}`);
      const newProjects = await res.json();
      setProjects(newProjects);
    } catch (error) {
      setProjects([]);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const res = await fetch(`./api/project/${id}`, {
      method: "DELETE",
    });

    await fetchProjects();
  };
  return (
    <div>
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {projects.map((project) => (
          <li
            key={project._id}
            className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
          >
            <Link href={`/projects/${project._id}`}>
              <h2 className='text-2xl font-bold mb-2'>{project.title}</h2>
            </Link>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 text-red-600 ml-auto cursor-pointer'
              onClick={(e) => handleDeleteClick(project._id)}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
              />
            </svg>
          </li>
        ))}
        <li className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-center justify-center'>
          <Link href='/create/project'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 text-gray-500'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 012 0v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 010-2h3z'
                clipRule='evenodd'
              />
            </svg>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ProjectsPage;
