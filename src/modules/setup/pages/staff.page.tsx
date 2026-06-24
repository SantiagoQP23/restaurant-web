import { Link } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
} from "@/shared/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import NiceModal from "@ebay/nice-modal-react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useUsers } from "@/modules/users/hooks/useUsers";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { User } from "@/shared/models/user.model";
import { InviteUserModal } from "@/modules/users/components/invite-user.modal";
import { SetupStepper } from "../components/setup-stepper.component";
import { useTranslation } from "react-i18next";

const columnHelper = createColumnHelper<User>();

export const StaffPage = () => {
  const { t } = useTranslation();
  const {
    users,
    rowsPerPage,
    handleChangeRowsPerPage,
    page,
    handleChangePage,
    usersQuery,
  } = useUsers();

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
        return userRole ? t(`roles.${userRole.name}`, { defaultValue: userRole.name }) : "";
      },
      header: "Rol",
    }),
  ];

  const table = useReactTable<User>({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleInviteClick = () => {
    NiceModal.show(InviteUserModal, {
      existingUsers: users,
      onInvite: () => {
        usersQuery.refetch();
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 flex-col gap-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Equipo</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los empleados de tu restaurante.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleInviteClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Invitar usuario
          </Button>
        </div>

        <Card className="p-0">
          <CardContent className="p-0">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <Field orientation="horizontal" className="w-fit">
                <Select
                  defaultValue={String(rowsPerPage)}
                  onValueChange={(value) => handleChangeRowsPerPage(+value)}
                >
                  <SelectTrigger className="w-20" id="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectGroup>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem aria-disabled={page === 0}>
                    <PaginationPrevious
                      aria-disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handleChangePage(page + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild className="rounded-full px-6">
            <Link to="/setup/payment-methods">Guardar y continuar</Link>
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
