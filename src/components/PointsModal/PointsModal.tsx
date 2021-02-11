import React, {useEffect, useState} from 'react';
import {styles} from "../AddModal/AddModal.style";
import {Input, Modal, Select} from "antd";
import {PointsModalProps} from "./PointsModal.props";

const { Option } = Select;

const weeks = [
    1,2,3,4,5,6,7
];

export const PointsModal = (props: PointsModalProps) => {
    const {
        state,
        handleOk,
        handleCancel,
        title,
        teams
    } = props;

    const [params, setParams] = useState({
        teamId: '',
        gameWeek: '',
        points: ''
    });

    useEffect(() => {
        setParams({
            teamId: '',
            gameWeek: '',
            points: ''
        })
    }, [state]);

    const handleOkHandler = () => {
        handleOk(params);

        setParams({
            teamId: '',
            gameWeek: '',
            points: ''
        });
    };

    const handleInputChange = ( event ) => {
        const {...oldParams} = params;

        oldParams[event.target.name] = event.target.value;
        setParams(oldParams);
    };

    const onChangeSelect = (name: string , value: number | string) => {
        const {...oldParams} = params;

        oldParams[name] = value;
        setParams(oldParams);
    };

    return (
        <Modal title={title} visible={state} onOk={handleOkHandler} onCancel={() => handleCancel()}>
            <div style={styles.container}>
                {
                    teams.length &&
                    <Select
                        showSearch
                        style={styles.inputItem}
                        placeholder="Select a team"
                        optionFilterProp="children"
                        onChange={(event) => (onChangeSelect('teamId' , event))}
                        //onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option key={teams[0].teamId} value={teams[0].teamId}>{teams[0].teamName}</Option>
                        {
                            teams.slice(1, teams.length).map((team, index) =>
                                <Option key={index} value={team.teamId}>{team.teamName}</Option>
                            )
                        }
                    </Select>
                }

                {
                    weeks.length &&
                    <Select
                        showSearch
                        style={styles.inputItem}
                        placeholder="Select a game week"
                        optionFilterProp="children"
                        onChange={(event) => (onChangeSelect('gameWeek' , event))}
                        //onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option key={weeks[0]} value={weeks[0]}>{weeks[0]}</Option>
                        {
                            weeks.slice(1 , weeks.length).map((week, index) =>
                                <Option key={index} value={week}>{week}</Option>
                            )
                        }
                    </Select>
                }


                <Input
                    name="points"
                    type="number"
                    onChange={handleInputChange}
                    value={params.points || ''}
                    style={styles.inputItem}
                    placeholder={`Enter points`}
                />
            </div>
        </Modal>
    )
};
