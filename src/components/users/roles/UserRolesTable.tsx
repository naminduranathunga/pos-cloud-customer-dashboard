import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import LoadingRolesSkeleton from "./LoadingRolesSkeleton"
import { SumpleUserRole } from "@/interfaces/company_users";
import { Button } from "@/components/ui/button";


export default function UserRolesTable({roles}:{roles:SumpleUserRole[]|null}){
    
    const rows = roles?.map((role, i)=>(
        <TableRow key={i}>
            <TableCell> {role._id} </TableCell>
            <TableCell> { role.name } </TableCell>
            <TableCell> { role.slug } </TableCell>
            <TableCell> 
                {
                    !role.is_public && <Button asChild><a href={"/users/roles/edit?_id=" + role._id }>Edit</a></Button>
                }
            </TableCell>
        </TableRow>)
    );

    return (
        <Table className="w-full">
            <TableCaption>{roles ? "":"Loading User Roles"}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>slug</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { (roles == null) ? (<LoadingRolesSkeleton />):rows }
            </TableBody>
        </Table>
    )
}