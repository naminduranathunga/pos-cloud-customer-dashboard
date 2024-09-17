import { CompanyBranch } from "@/interfaces/company";
import config from "./config";


export default async function get_branch_list(jwt:string){
    const response2 = await fetch(`${config.apiURL}/company-manager/branches/get`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    const branches = (await response2.json()) as CompanyBranch[];

    return branches;
}