import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      {/* Cabeçalho */}
      <header style={{ borderBottom: '1px solid #ccc', marginBottom: '24px' }}>
        <h1>Portal Têxtil</h1>
        <p>Dashboard Operacional</p>
      </header>

      {/* Indicadores */}
      <section style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Anúncios Ativos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>12</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Total de Contatos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>45</p>
        </div>
      </section>

      {/* Ações */}
      <section>
        <button 
          onClick={() => alert('Nova funcionalidade em breve')} 
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Novo Anúncio
        </button>
      </section>
    </div>
  );
}