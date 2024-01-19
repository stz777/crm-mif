import { LeadInterface } from "../components/types/lead"

export default async function fetchClientLeads(lead_id: number): Promise<{
    leads: LeadInterface[]
}> {
    return fetch(
        `/api/leads/get/by-client-id/${lead_id}`,
        {
            method: "POST"
        }
    )
        .then(x => x.json())
}