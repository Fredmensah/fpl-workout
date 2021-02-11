interface ManagerType {
    "managerName": string
    "teamName": string
    "teamId": number
    "points"?: number,
    "key"?: number
}

export interface PointsModalProps {
    title?: string

    description?: string

    state: boolean

    handleOk: Function

    handleCancel: Function

    teams: ManagerType[]
}
