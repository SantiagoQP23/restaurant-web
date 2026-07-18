import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { useUsers } from "@/modules/users/hooks/useUsers";
import { UsersTable } from "@/modules/users/components/users-table.component";
import { SetupStepper } from "../components/setup-stepper.component";
import { WhatsappFAB } from "../components/whatsapp-fab.component";

export const StaffPage = () => {
  const {
    users,
    rowsPerPage,
    handleChangeRowsPerPage,
    page,
    handleChangePage,
    usersQuery,
  } = useUsers();

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 flex-col gap-6 w-full max-w-7xl mx-auto">
        <UsersTable
          title="Equipo"
          subtitle="Gestiona los empleados de tu restaurante."
          users={users}
          usersQuery={usersQuery}
          page={page}
          handleChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          hideActionsForCurrentUser
          inviteButtonVariant="outline"
          inviteButtonClassName="rounded-full"
        />

        <div className="flex justify-end">
          <Button asChild className="rounded-full px-6">
            <Link to="/setup/complete">Continuar</Link>
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
      <WhatsappFAB />
    </div>
  );
};
