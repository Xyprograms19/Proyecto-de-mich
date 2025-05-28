import React, { useState } from 'react';

const Roles = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrador', permissions: ['Ver horas extras', 'Actualizar horas extras', 'Crear horas extras', 'Aprobar horas extras'] },
    { id: 2, name: 'Supervisor', permissions: ['Ver horas extras', 'Actualizar horas extras', 'Aprobar horas extras'] },
    { id: 3, name: 'Empleado', permissions: ['Ver horas extras', 'Crear horas extras'] },
  ]);

  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);

  const handleAddRole = () => {
    if (newRoleName) {
      const newRole = {
        id: roles.length + 1,
        name: newRoleName,
        permissions: newRolePermissions,
      };
      setRoles([...roles, newRole]);
      setNewRoleName('');
      setNewRolePermissions([]);
      setShowForm(false);
    }
  };

  const handleEditRole = (id) => {
    const role = roles.find((role) => role.id === id);
    setNewRoleName(role.name);
    setNewRolePermissions(role.permissions);
    setEditRoleId(id);
    setShowForm(true);
  };

  const handleUpdateRole = () => {
    const updatedRoles = roles.map((role) =>
      role.id === editRoleId ? { ...role, name: newRoleName, permissions: newRolePermissions } : role
    );
    setRoles(updatedRoles);
    setNewRoleName('');
    setNewRolePermissions([]);
    setEditRoleId(null);
    setShowForm(false);
  };

  const handleDeleteRole = (id) => {
    const updatedRoles = roles.filter((role) => role.id !== id);
    setRoles(updatedRoles);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setNewRoleName('');
    setNewRolePermissions([]);
    setEditRoleId(null);
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded shadow">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Roles</h1>
          <p className="text-gray-600">Administra los roles del sistema</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={toggleForm}>
          {editRoleId ? 'Cancelar' : 'Nuevo Rol'}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">{editRoleId ? 'Editar Rol' : 'Crear Nuevo Rol'}</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del Rol</label>
            <input 
              type="text" 
              placeholder="Nombre del Rol" 
              value={newRoleName} 
              onChange={(e) => setNewRoleName(e.target.value)} 
              className="w-full px-3 py-2 border rounded mb-2" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Permisos</label>
            <div className="flex items-center mb-2">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={newRolePermissions.includes('Ver horas extras')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewRolePermissions([...newRolePermissions, 'Ver horas extras']);
                  } else {
                    setNewRolePermissions(newRolePermissions.filter((perm) => perm !== 'Ver horas extras'));
                  }
                }} 
              /> Ver horas extras
            </div>
            <div className="flex items-center mb-2">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={newRolePermissions.includes('Actualizar horas extras')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewRolePermissions([...newRolePermissions, 'Actualizar horas extras']);
                  } else {
                    setNewRolePermissions(newRolePermissions.filter((perm) => perm !== 'Actualizar horas extras'));
                  }
                }} 
              /> Actualizar horas extras
            </div>
            <div className="flex items-center mb-2">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={newRolePermissions.includes('Crear horas extras')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewRolePermissions([...newRolePermissions, 'Crear horas extras']);
                  } else {
                    setNewRolePermissions(newRolePermissions.filter((perm) => perm !== 'Crear horas extras'));
                  }
                }} 
              /> Crear horas extras
            </div>
            <div className="flex items-center mb-2">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={newRolePermissions.includes('Aprobar horas extras')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewRolePermissions([...newRolePermissions, 'Aprobar horas extras']);
                  } else {
                    setNewRolePermissions(newRolePermissions.filter((perm) => perm !== 'Aprobar horas extras'));
                  }
                }} 
              /> Aprobar horas extras
            </div>
          </div>
          <button onClick={editRoleId ? handleUpdateRole : handleAddRole} className="bg-blue-500 text-white px-4 py-2 rounded">
            {editRoleId ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold">{role.name}</h3>
            <hr className="my-2" />
            <ul className="mt-2 space-y-2">
              {role.permissions.map((permission, index) => (
                <li key={index} className="flex items-center">
                  <span className="inline-block w-5 h-5 border-2 border-green-500 rounded-full flex items-center justify-center mr-2">
                    <i className="fas fa-check text-green-500 text-sm"></i>
                  </span>
                  {permission}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <button onClick={() => handleEditRole(role.id)} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded">Editar</button>
              <button onClick={() => handleDeleteRole(role.id)} className="text-red-600">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roles;