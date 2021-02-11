import React, {useState, useEffect} from 'react';
import {AddModalProps, columnType} from "./AddModal.props";
import { Modal, Input } from 'antd';

import {styles} from "./AddModal.style";

export const AddModal = (props: AddModalProps) => {
    const {
        state,
        handleOk,
        handleCancel,
        title,
        columns,
        excludeColumns,
        type,
        editData
    } = props;

    const [params, setParams] = useState(type === 'edit' ? editData : {});

    useEffect(() => {
        setParams(type === 'edit' ? editData : {})
    }, [columns, excludeColumns, state, type]);

    const handleOkHandler = () => {
        handleOk(params);

        setParams({});
    };

    const handleInputChange = ( event ) => {
        const {...oldParams} = params;

        oldParams[event.target.name] = event.target.value;
        setParams(oldParams);
    };

    const _renderColumnsTextInputs = () => {
        return (
            <div style={styles.inputContainer}>
                {
                    columns.map((column: columnType, index) => {
                        return !excludeColumns.includes(column.dataIndex) && (
                            <div key={index}>
                                <Input name={column.dataIndex} onChange={handleInputChange} value={params[column.dataIndex] || ''} style={styles.inputItem} placeholder={`Enter ${column.title}`} />
                            </div>
                        )
                    })
                }
            </div>
        );
    };

    return (
        <Modal title={title} visible={state} onOk={handleOkHandler} onCancel={() => handleCancel()}>
            <div style={styles.container}>
                {_renderColumnsTextInputs()}
            </div>
        </Modal>
    )
};
