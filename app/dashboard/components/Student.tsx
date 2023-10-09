"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import RoleSelect from "../../components/RoleSelect";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiInbox, HiUser, HiViewBoards } from 'react-icons/hi';

const StudentDashBoard = ({dbUser}) => {
    //const { isSignedIn, user, isLoaded } = useUser();
    const { isSignedIn, user, isLoaded } = useUser();
    const [openModal, setOpenModal] = useState<string | undefined>();
   

    async function PostUser() {
        if (isLoaded) {
            const response = await axios.post('/api/User', { username: user.username, email: user.emailAddresses[0].emailAddress });
            if (response.data.newUser === true) {
                setOpenModal("dismissible");
           }
            console.log(response.data);
             console.log(user.username)
         }
 
    }

    //async function GetProjects() {
       // const response = await axios.get('http://localhost3000/api/', {});

    //}
    useEffect(() => {
        PostUser();
       
    }, [user]);

    return (
        <>
       
    <Sidebar id="default-sidebar" className="fixed top-20 right-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar" >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="#"
            icon={HiChartPie}
          >
            <p>
              Dashboard
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiViewBoards}
          >
            <p>
              Courses
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiInbox}
          >
            <p>
              Inbox
            </p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
            <div className='flex justify-center items-center h-96'>
            {/* <Button onClick={() => setOpenModal('dismissible')}>Toggle modal</Button> */}
                <div className='text-center'>

                    <Link href="/create/project">
                        <button className='bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded mr-2'>
                            New Project
                        </button>
                    </Link>
                    <Link href="/projects">
                        <button className='bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded ml-2'>
                            Browse Projects
                        </button>
                    </Link>

                    <div className="container "></div>
                    <RoleSelect
                        openModal={openModal }
                        setOpenModal={ setOpenModal} />
                </div>
            </div>
        </>
    );
};

export default StudentDashBoard;