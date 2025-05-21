// UsersTable.tsx
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UsersTable = () => {
  const [rowData] = useState<User[]>([
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "User" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Manager" },
  ]);

  const [columnDefs] = useState<ColDef<User>[]>([
    { field: "id", filter: "agNumberColumnFilter", sortable: true },
    { field: "name", filter: "agTextColumnFilter", sortable: true },
    { field: "email", filter: "agTextColumnFilter", sortable: true },
    { field: "role", filter: "agTextColumnFilter", sortable: true },
  ]);

  return (
    <div className="ag-theme-balham border p-4" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={5}
        rowSelection="single"
      />
    </div>
  );
};

export default UsersTable;
