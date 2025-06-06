// types/index.ts
export type ProfileRole = 'master' | 'customer'

interface BaseProfile {
    id: string
    user_id: string
    role: ProfileRole
    username: string
    public_name?: string
    avatar_url?: string
    created_at: string
}

export interface MasterProfile extends BaseProfile {
    role: 'master'
    description: string
    job: string
    contacts: {
        telegram?: string
        phone?: string
    }
}

export interface CustomerProfile extends BaseProfile {
    role: 'customer'
    is_anonymous?: boolean
}

export type Profile = MasterProfile | CustomerProfile