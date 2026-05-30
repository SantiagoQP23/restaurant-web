import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useReducer, useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { User } from "@/shared/models/user.model";
import { useAuthStore } from "@/modules/auth/store/auth.store";

// const defaultData: Person[] = [
//   {
//     firstName: "tanner",
//     lastName: "linsley",
//     age: 24,
//     visits: 100,
//     status: "In Relationship",
//     progress: 50,
//   },
//   {
//     firstName: "tandy",
//     lastName: "miller",
//     age: 40,
//     visits: 40,
//     status: "Single",
//     progress: 80,
//   },
//   {
//     firstName: "joe",
//     lastName: "dirte",
//     age: 45,
//     visits: 20,
//     status: "Complicated",
//     progress: 10,
//   },
// ];

const columnHelper = createColumnHelper<User>();

const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor(
    (row) => `${row.person.firstName} ${row.person.lastName}`,
    {
      id: "fullName",
      header: "Nombre",
    },
  ),

  columnHelper.accessor((row) => row.person.email, {
    id: "email",
    header: "Email",
  }),

  columnHelper.accessor("username", {
    header: "Username",
  }),

  columnHelper.accessor((row) => row.restaurantRoles, {
    id: "role",
    cell: (info) => {
      const roles = info.row.original.restaurantRoles;
      const restaurant = useAuthStore.getState().restaurant;

      const userRole = roles.find(
        (resRole) => resRole.restaurant.id === restaurant?.id,
      )?.role;
      return userRole ? userRole.name : "";
    },
    header: "Rol",
  }),
];

export const UsersPage = () => {
  const rerender = useReducer(() => ({}), {})[1];
  const { users } = useUsers();

  const table = useReactTable<User>({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los empleados de tu restaurante
          </p>
        </div>
        <Button onClick={() => rerender()}>Invitar usuario</Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
