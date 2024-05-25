import { Skeleton } from "@/components/ui/skeleton"
import {
    TableCell,
    TableRow,
  } from "@/components/ui/table"

export default function LoadingRolesSkeleton(){
    return (
    <>
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
    </>
    );
}