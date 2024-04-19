import React from 'react';
import { Storages } from '.';
import { Form, Modal, ModalProps } from 'antd';

interface Props extends ModalProps {
    type: Storages;
}

const ModalCreate = (props: Props) => {
    return (
        <Modal
            {...props}
        >
            <Form>

            </Form>
        </Modal>
    )
}

export default ModalCreate;