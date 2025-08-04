import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import PreguntaForm from "../components/PreguntaForm";
import EncuestaForm from "../components/EncuestaForm";
import CrearGrupoYAsignar from "../components/CrearGrupoYAsignar";
import CargarClienteForm from "../components/CargarClienteForm";
import CrearUsuarioForm from "../components/CrearUsuarioForm";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { userEmail } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (tabValue) => {
    const token = localStorage.getItem("token");
    console.log("Tab cambiada a:", tabValue, "Token actual:", token);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Panel de Administración
          </h1>
          <button
            onClick={() => navigate("/estadisticas")}
            className="mt-4 inline-flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            📊 Ver estadísticas
          </button>
        </header>

        <Tabs
          defaultValue="preguntas"
          className="space-y-6"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex gap-2 border-b pb-2">
            <TabsTrigger
              value="preguntas"
              className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50"
            >
              ➕ Preguntas
            </TabsTrigger>
            <TabsTrigger
              value="encuestas"
              className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50"
            >
              📝 Encuestas
            </TabsTrigger>
            <TabsTrigger
              value="grupos"
              className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50"
            >
              👥 Grupos
            </TabsTrigger>
            <TabsTrigger
              value="clientes"
              className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50"
            >
              👤 Clientes
            </TabsTrigger>
            <TabsTrigger
              value="usuarios"
              className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50"
            >
              👤 Usuarios
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="preguntas"
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Agregar Pregunta</h2>
            <p className="text-gray-500 mb-4">
              Estas preguntas estarán disponibles para futuras encuestas.
            </p>
            <PreguntaForm />
          </TabsContent>

          <TabsContent
            value="encuestas"
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Crear Encuesta</h2>
            <p className="text-gray-500 mb-4">
              Seleccioná preguntas, grupos y fechas para la encuesta.
            </p>
            <EncuestaForm />
          </TabsContent>

          <TabsContent value="grupos" className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              Cargar Grupo
            </h2>
            <p className="text-gray-500 mb-4">
              Dá de alta grupos o colaboradores y asignales uno o muchos clientes.
            </p>
            <CrearGrupoYAsignar />
          </TabsContent>

          <TabsContent
            value="clientes"
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Cargar Cliente</h2>
            <p className="text-gray-500 mb-4">
              Dá de alta nuevos clientes en el sistema.
            </p>
            <CargarClienteForm />
          </TabsContent>

          <TabsContent
            value="usuarios"
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Crear Usuario</h2>
            <p className="text-gray-500 mb-4">
              Registra un nuevo usuario en el sistema.
            </p>
            <CrearUsuarioForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
