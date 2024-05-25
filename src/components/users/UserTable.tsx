import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { SimpleUser } from "@/interfaces/company_users";
import LoadingUserSkeleton from "./LoadingUserSkeleton";
import { Button } from "../ui/button";

export default function UserListTable({userList, search_term}:{userList : SimpleUser[] | null, search_term:string}){
    
    let users = userList;
    console.log(search_term);
    let search_t = "" //search_term.trim().toLowerCase();
    if (users && search_term.length > 0){
        users = users.filter((user)=>
            (user.email.toLowerCase().includes(search_t) 
                || user.first_name.toLowerCase().includes(search_t) 
                || user.role.name.toLowerCase().includes(search_t))
            );
    }

    const rows = users?.map((user, i)=>(
        <TableRow key={i}>
            <TableCell> {user._id} </TableCell>
            <TableCell> { user.first_name } </TableCell>
            <TableCell> { user.email } </TableCell>
            <TableCell> { user.role.name } </TableCell>
            <TableCell> 
                <Button asChild><a href={"/users/edit?_id=" + user._id }>Edit</a></Button>
            </TableCell>
        </TableRow>
    ));

    return (
        <Table className="w-full">
            <TableCaption>{users ? "Loading Users":"-"}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { (users == null) ? (<LoadingUserSkeleton />):rows }
            </TableBody>
        </Table>
    )
}