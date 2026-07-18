import { useUsers } from "../hooks/useUsers";
import { UsersTable } from "../components/users-table.component";

export const UsersPage = () => {
  const {
    users,
    rowsPerPage,
    handleChangeRowsPerPage,
    page,
    handleChangePage,
    usersQuery,
  } = useUsers();

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <UsersTable
        title="Usuarios"
        subtitle="Gestiona los empleados de tu restaurante"
        users={users}
        usersQuery={usersQuery}
        page={page}
        handleChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hideActionsForCurrentUser
      />
    </div>
  );
};
