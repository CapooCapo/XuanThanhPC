import React from 'react';
import '@/pages/admin/styles/admin.scss';

const DataTable = ({ columns, data, onEdit, onDelete, onCustomAction, customActionLabel }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No data available.</div>;
  }

  return (
    <div className="data-table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
            {(onEdit || onDelete || onCustomAction) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete || onCustomAction) && (
                <td>
                  {onCustomAction && (
                    <button 
                      onClick={() => onCustomAction(row)} 
                      style={{ marginRight: '10px', background: '#0ea5e9', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      {customActionLabel || 'Action'}
                    </button>
                  )}
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(row)} 
                      style={{ marginRight: '10px', background: 'transparent', border: '1px solid #16a34a', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(row.id)} 
                      style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
