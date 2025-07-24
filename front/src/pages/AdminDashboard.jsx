// src/pages/AdminDashboard.jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import PreguntaForm from "../components/PreguntaForm";
import EncuestaForm from "../components/EncuestaForm";
import CrearGrupoYAsignar from "../components/CrearGrupoYAsignar";
import { useAuth } from "../AuthContext";

export default function AdminDashboard() {
  const { userEmail } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-500">Conectado como <span className="font-medium">{userEmail}</span></p>
        </header>

        <Tabs defaultValue="preguntas" className="space-y-6">
          <TabsList className="flex gap-2 border-b pb-2">
            <TabsTrigger value="preguntas" className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50">➕ Crear Preguntas</TabsTrigger>
            <TabsTrigger value="encuestas" className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50">📝 Crear Encuestas</TabsTrigger>
            <TabsTrigger value="grupos" className="px-4 py-2 rounded-t-lg bg-white shadow-sm hover:bg-blue-50">👥 Crear Grupos</TabsTrigger>
          </TabsList>

          <TabsContent value="preguntas" className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Agregar Pregunta</h2>
            <p className="text-gray-500 mb-4">Estas preguntas estarán disponibles para futuras encuestas.</p>
            <PreguntaForm />
          </TabsContent>

          <TabsContent value="encuestas" className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Crear Encuesta</h2>
            <p className="text-gray-500 mb-4">Seleccioná preguntas, grupos y fechas para la encuesta.</p>
            <EncuestaForm />
          </TabsContent>

          <TabsContent value="grupos" className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Cargar Grupo || Cargar Colaborador</h2>
            <p className="text-gray-500 mb-4">Dá de alta grupos o colaboradores y asignales uno o muchos clientes.</p>
            <CrearGrupoYAsignar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
