import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default function LoadingUsersTable(){
    return( 
    <Table className="w-full">
        <TableCaption>Loading Users</TableCaption>
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
            <TableRow>
                <TableCell> <Skeleton className="w-12 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-8 h-4" /> <Skeleton className="w-8" /> </TableCell>
            </TableRow>
            
            <TableRow>
                <TableCell> <Skeleton className="w-12 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-8 h-4" /> <Skeleton className="w-8" /> </TableCell>
            </TableRow>
            
            <TableRow>
                <TableCell> <Skeleton className="w-12 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-8 h-4" /> <Skeleton className="w-8" /> </TableCell>
            </TableRow>
            
            <TableRow>
                <TableCell> <Skeleton className="w-12 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-8 h-4" /> <Skeleton className="w-8" /> </TableCell>
            </TableRow>
            
            <TableRow>
                <TableCell> <Skeleton className="w-12 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-24 h-4" /> </TableCell>
                <TableCell> <Skeleton className="w-8 h-4" /> <Skeleton className="w-8" /> </TableCell>
            </TableRow>
        </TableBody>
    </Table>
    )
}