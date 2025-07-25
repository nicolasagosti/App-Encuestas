function AdminRoute({ children }) {
  const { isLogged, userRole, isLoading } = useAuth();

  if (isLoading) {
    // Opcional: aquí podrías devolver un spinner
    return null;
  }
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }
  if (userRole !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function UserRoute({ children }) {
  const { isLogged, userRole, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }
  if (userRole !== 'USER') {
    return <Navigate to="/admin" replace />;
  }
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
