"use client";
import React, { useEffect, useState } from "react";
import RoleSelect from "../components/RoleSelect";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { pusherClient } from "@/lib/pusher";
import TeacherDashBoard from "./components/Teacher";
import StudentDashBoard from "./components/Student";
import SocketConnect from "../components/SocketConnect";
import { Socket } from "dgram";

const DashBoard = () => {
  //const { isSignedIn, user, isLoaded } = useUser();
  const { isSignedIn, user, isLoaded } = useUser();
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [openSocketModal, setOpenSocketModal] = useState<string | undefined>();
  const [answer, setAnswer] = useState<string | undefined>();
  const [dbUser, setDbUser] = useState(null);
  const [projectId, setProjectId] = useState("");

  async function PostUser() {
    if (isLoaded) {
      const response = await axios.post("/api/User", {
        username: user.username,
        email: user.emailAddresses[0].emailAddress,
      });
      if (response.data.newUser === true) {
        setOpenModal("dismissible");
      }
      pusherClient.subscribe(`request-channel-${user.username}`);
      pusherClient.bind("project-request", (id : string) => {
        console.log(user.username);
        setOpenSocketModal("dismissible");
        setProjectId(id);
      })
      setDbUser(response.data.databaseUser);
    }
  }
  useEffect(() => {
    PostUser();
  }, [user]);

  return (
    <>
      <RoleSelect openModal={openModal} setOpenModal={setOpenModal} />
      <SocketConnect openModal={openSocketModal} setOpenModal={setOpenSocketModal} answer={answer} setAnswer={setAnswer} project={projectId} />

      {dbUser?.role === "Teacher" && (
        <TeacherDashBoard dbUser={dbUser} setDbUser={setDbUser} />
      )}
      {dbUser?.role === "Student" && <StudentDashBoard dbUser={dbUser} />}
    </>
  );
};

export default DashBoard;
