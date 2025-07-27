function AdminRoute({ children }) {
  const { isLogged, isLoading } = useAuth();

  if (isLoading) {
      console.log("paso por is loading en admin route")
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
