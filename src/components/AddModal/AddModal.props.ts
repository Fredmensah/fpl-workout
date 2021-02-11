export interface columnType {
    title: string
    dataIndex: string
}

interface ManagerType {
    "managerName": string
    "teamName": string
    "teamId": number
    "points"?: number,
    "key"?: number
}

export interface AddModalProps {
    columns: columnType[]

    excludeColumns: string[]

    title?: string

    description?: string

    state: boolean

    handleOk: Function

    handleCancel: Function

    type: string

    editData?: ManagerType | undefined
}
