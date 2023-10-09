import React, { ChangeEvent, useState } from "react";
import { Button, Modal, Radio, Label } from "flowbite-react";
import Link from "next/link";
function SocketConnect(props: {
  setOpenModal: any;
  openModal?: any;
  answer: string;
  setAnswer?: any;
  project?: string;
}) {
  const changeAnswerState = (e: ChangeEvent<HTMLInputElement>) =>
    props.setAnswer(e.target.value);

  return (
    <div>
      <Modal
        dismissible
        show={props.openModal === "dismissible"}
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header>Would you like to connect?</Modal.Header>

        <Modal.Footer>
          <Link href={`/projects/${props.project}`}>
            <Button
              color='gray'
              onClick={() => {
                props.setOpenModal(undefined);
              }}
            >
              Join
            </Button>
          </Link>
          <Button
            color='gray'
            onClick={() => {
              props.setOpenModal(undefined);
            }}
          >
            No Thanks
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SocketConnect;
