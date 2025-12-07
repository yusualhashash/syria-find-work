export type CarRepairman = {
    id: string
    name: string
    surname: string
    whatsapp_number: string
    gender: "male" | "female"
    age: number
    city: string
    address: string
    experience_years: number
    notes: string | null
    created_at: string
    updated_at: string
    created_by: string
}
