import React from 'react';
import { Form, Modal, ModalProps } from 'antd';
import { Storages } from '.';

interface Props {
    type: Storages;
    modalProps: ModalProps;
}

const ModalCreate = (props: Props) => {
    return (
        <Modal
            {...props.modalProps}
        >
            <Form>

            </Form>
        </Modal>
    )
}

export default ModalCreate;