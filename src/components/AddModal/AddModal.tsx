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

    const handleInputChange = ( event: any ) => {
        const {...oldParams} = params;

        //@ts-ignore
        oldParams[event.target.name] = event.target.value;
        setParams(oldParams);
    };

    const _renderColumnsTextInputs = () => {
        return (
            //@ts-ignore
            <div style={styles.inputContainer}>
                {
                    columns.map((column: columnType, index) => {
                        return !excludeColumns.includes(column.dataIndex) && (
                            <div key={index}>
                                {/*@ts-ignore*/}
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
            {/*@ts-ignore*/}
            <div style={styles.container}>
                {_renderColumnsTextInputs()}
            </div>
        </Modal>
    )
};
