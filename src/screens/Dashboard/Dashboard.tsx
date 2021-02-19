import React, { useState, useEffect} from 'react';
import {DashboardProps} from "./Dashboard.props";
import {Api} from "../../services";
import { Table, Button, Popconfirm } from 'antd';
import {styles} from "./Dashboard.style";
import {AddModal, PointsModal} from "../../components";
const resources = require("../../config/resources.json");

interface WeekPoints {
    "gameWeek": number
    "points": number
}

interface ManagerType {
    "managerName": string
    "teamName": string
    "teamId": number
    "points"?: WeekPoints[],
    "key"?: number
}

interface ManagerType2 {
    "managerName": string
    "teamName": string
    "teamId": number
    "points"?: number,
    "key"?: number
}

export const Dashboard = (props: DashboardProps) => {
    const {
        resourceName
    } = props;

    const [modalType, setModalType] = useState<string>('add');
    const [managersData, setManagersData] = useState<ManagerType[]>([]);
    const [currentManager, setCurrentManager] = useState<ManagerType | undefined>(undefined);
    const [data, setData] = useState<ManagerType[]>([]);
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [openPointsModal, setOpenPointsModal] = useState<boolean>(false);
    const managerColumns = resources["managers"]["columns"];
    const excludeManagerColumns = resources["managers"]["notAddNewColumns"];

    useEffect(() => {
        getManagersData().then(() => {});
    }, []);

    const getManagersData = async () => {
        try {
            const results = await new Api('others').index(
                {},
                {},
                'https://run.mocky.io/v3/a8f4f5d6-3b59-4a55-893f-007d145b2f80',
                'Fetching managers'
            );
            const managers = results.data.managers;
            setManagersData(managers);

            const trimData = [];

            for (let i = 0; i < managers.length; i++) {
                trimData.push({
                    key: managers[i].teamId,
                    managerName: managers[i].managerName,
                    teamName: managers[i].teamName,
                    teamId: managers[i].teamId,
                    totalPoints: (managers[i].points).reduce((sum: number, weekPoints: WeekPoints) => sum + (weekPoints.points || 0), 0)
                });
            }

            setData(trimData);
        } catch (error) {
            console.log(error)
        }
    };

    /*const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
    };*/

    const addManager = (params: ManagerType) => {
        const [...trimData] = data;
        const [...oldManagersData] = managersData;


        if(modalType === 'add') {
            const teamId = Math.floor(Math.random() * Math.floor(9999999));

            trimData.push({
                ...params,
                teamId,
                key: teamId,
                //@ts-ignore
                totalPoints: 0,
            });

            oldManagersData.push({
                ...params,
                teamId,
                points: [],
            });
        } else {
            const dataSource = [...data];
            const itemIndex = dataSource.findIndex(item => item.key === params.key);

            trimData[itemIndex] = params;
            oldManagersData[itemIndex] = {
                ...params,
                points: oldManagersData[itemIndex].points
            };
        }

        setData(trimData);
        setManagersData(oldManagersData);
        setOpenAddModal(false);
        setModalType('add');
    };

    const addPoints = (params: any) => {
        const [...trimData] = data;
        const [...oldManagersData] = managersData;

        const itemIndex = trimData.findIndex(item => item.teamId === params.teamId);

        trimData[itemIndex] = {
            ...trimData[itemIndex],
            //@ts-ignore
            totalPoints: parseFloat(trimData[itemIndex].totalPoints) + parseFloat(params.points)
        };

        oldManagersData[itemIndex] = {
            ...oldManagersData[itemIndex],
            points: [
                //@ts-ignore
                ...oldManagersData[itemIndex].points,
                {
                    'gameWeek': params.gameWeek,
                    'points': parseFloat(params.points)
                }
            ]
        };
        setData(trimData);
        setManagersData(oldManagersData);
        setOpenPointsModal(false);
    };

    const closeModal = () => {
        setOpenAddModal(false);
        setModalType('add');
        setCurrentManager(undefined);
    };

    const closePointsModal = () => {
        setOpenPointsModal(false);
    };

    const handleDelete = (key: number) => {
        const dataSource = [...data];
        setData(dataSource.filter(item => item.key !== key) );
    };

    const handleEdit = (record: ManagerType) => {
        const dataSource = [...data];
        const item = dataSource.find(item => item.key === record.key);
        setCurrentManager(item);
        setModalType('edit');
        setOpenAddModal(true);
    };

    const renderActions = () => {
        return (
            [{
                title: 'Delete',
                dataIndex: 'delete',
                render: (text: string, record: any) =>
                    data.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <a style={{marginRight: '10px'}}>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
            {
                title: 'Edit',
                dataIndex: 'edit',
                render: (text: string, record: any) =>
                    data.length >= 1 ? (
                        <Popconfirm title="Sure to edit?" onConfirm={() => handleEdit(record)}>
                            <a>Edit</a>
                        </Popconfirm>
                    ) : null,
            }]
        );
    };

    return (
        <div style={styles.screen}>
            <AddModal
                state={openAddModal}
                handleOk={addManager}
                handleCancel={closeModal}
                columns={managerColumns}
                excludeColumns={excludeManagerColumns}
                title={`${modalType === 'add' ? `Add new ` : `Edit `} manager`}
                type={modalType}
                //@ts-ignore
                editData={currentManager}
            />

            <PointsModal
                state={openPointsModal}
                handleOk={addPoints}
                handleCancel={closePointsModal}
                //@ts-ignore
                teams={data}
                title={`Add team points`}
            />
            {/*@ts-ignore*/}
            <div style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    type="primary"
                    onClick={() => setOpenAddModal(true)}
                    /*onClick={this.start}
                    disabled={!hasSelected}
                    loading={loading}*/
                >
                    Add new manager
                </Button>

                <Button
                    style={styles.button2}
                    type="primary"
                    onClick={() => setOpenPointsModal(true)}
                    /*onClick={this.start}
                    disabled={!hasSelected}
                    loading={loading}*/
                >
                    Add user points
                </Button>
            </div>
            <Table columns={[...managerColumns, ...renderActions()]} dataSource={data} />
        </div>
    )
};
