export default function get_selected_branch(){
    let branch = localStorage.getItem("inventory_branch");
    if (typeof branch === "string"){
        branch = JSON.parse(branch);
    }
    return branch;
}

export function remove_branch_selection(){
    localStorage.removeItem("inventory_branch");
}