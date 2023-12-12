export interface ClientInterface {
    id: number
    full_name: string
    address: string
    meta: ClientMetaInterface[]
}

export interface ClientMetaInterface {
    id: number
    client: number
    data_type: string
    data: string
}

export interface ClientsSearchInterface {
    phone?: string;
}

export type ClientWithMetaInterface = ClientInterface & { meta: ClientMetaInterface[] }
