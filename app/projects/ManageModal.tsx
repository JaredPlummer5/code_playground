"use client";
import { Checkbox, Table, Modal, Button } from "flowbite-react";
import { useState } from "react";
import axios from "axios";

export default function StudentModal({
    openStudentModal,
    setOpenStudentModal,
    students,
    teacherUsername,
    currentProject,
}) {
    // Having an array of students that are selected
    const [selectedStudents, setSelectedStudents] = useState([]);

    const props = {
        openStudentModal,
        setOpenStudentModal,
        students,
        teacherUsername,
        currentProject,
    };
    //studentEmail, teacherEmail, projectId
    const handleStudentSelect = async (selectedStudents: string | any[], teacherUsername: any, Id: any) => {
        for (let i = 0; i < selectedStudents.length; i++) {

            const response = await axios.post("/api/AssignLab", {
                studentUsername: selectedStudents[i],
                teacherUsername: teacherUsername,
                projectId: Id
            });
        }

        setOpenStudentModal("undefined");
    }

    const handleSelect = async (username) => {
        // if student is found, remove him plz
        // if (selectedStudents.includes(username)) {
        //     //Set array to current students
        //     const studentArray = selectedStudents
        //     //find index of username/student
        //     const index = studentArray.indexOf(username);
        //     //remove that kid
        //     studentArray.splice(index, 1);
        //     setSelectedStudents(studentArray);
        // }
        const studentArray = selectedStudents
        studentArray.push(username);
        setSelectedStudents(studentArray);
    };

    return (
        <Modal
            dismissible
            show={props.openStudentModal === "dismissible"}
            onClose={() => props.setOpenStudentModal(undefined)}
        >
            <Modal.Header>Students</Modal.Header>
            <Modal.Body>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell className="p-4">
                        </Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Student ID</Table.HeadCell>
                        <Table.HeadCell># of Projects</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {students.map((Student) => {
                            return (
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="p-4">
                                        <Checkbox
                                            className="checkbox"
                                            onClick={(e) =>
                                                handleSelect(Student.username)
                                            }
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {Student.username}
                                    </Table.Cell>
                                    <Table.Cell>{Student._id}</Table.Cell>
                                    <Table.Cell>{Student.projects.length}</Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center "
                    onClick={(e) =>
                        handleStudentSelect(selectedStudents, teacherUsername, currentProject)
                    }
                >
                    <svg
                        className="fill-current w-4 h-4 mr-2 "
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                    >
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                    </svg>
                    <span>Assign</span>
                </button>
            </Modal.Footer>
        </Modal>
    );
}