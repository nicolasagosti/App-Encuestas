function AdminRoute({ children }) {
  const { isLogged, isLoading } = useAuth();

  if (isLoading) {
    // Opcional: acá podés devolver un spinner de carga
    return null;
  }

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function UserRoute({ children }) {
  const { isLogged, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
