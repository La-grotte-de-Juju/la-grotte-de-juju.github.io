'use client';

import { useEffect, useState } from 'react';
import { getBDFolders, type BDFolder } from '@/data/bd-data';

export default function TestGitHubPage() {
  // Données retournées par getBDFolders : tableau de BDFolder ou null avant chargement
  const [data, setData] = useState<BDFolder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Override console.log pour capturer les logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      setLogs(prev => [...prev, `LOG: ${args.join(' ')}`]);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalError(...args);
    };
    
    console.warn = (...args) => {
      setLogs(prev => [...prev, `WARN: ${args.join(' ')}`]);
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    async function test() {
      try {
        setLoading(true);
        setLogs(prev => [...prev, 'Début du test...']);
        const result = await getBDFolders();
        setData(result);
        setLogs(prev => [...prev, `Résultat: ${JSON.stringify(result, null, 2)}`]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setLogs(prev => [...prev, `Erreur: ${err}`]);
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test GitHub API</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">État:</h2>
        <p>Loading: {loading ? 'Oui' : 'Non'}</p>
        <p>Error: {error || 'Aucune'}</p>
        <p>Data length: {data ? data.length : 'N/A'}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Logs:</h2>
        <div className="bg-black text-white p-4 rounded max-h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Données brutes:</h2>
        <pre className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
