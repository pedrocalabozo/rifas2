import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: "pedrodev16.alwaysdata.net",
    port: 3306,
    database: "pedrodev16_p",
    user: "411793",
    password: "Lol2024..",
     // ssl: { // Opcional: para conexiones SSL, ej. con PlanetScale u otros proveedores de DBaaS
    //   rejectUnauthorized: true, 
    //   // ca: fs.readFileSync('/path/to/ca-certificate.pem').toString(), // Ejemplo de CA cert
    // },
  },
  // connectTimeout: 10000, // Ejemplo: 10 segundos de timeout para la conexión
});

export async function query(queryString: string, values: any[] = []): Promise<any> {
  try {
    const results = await db.query(queryString, values);
    // serverless-mysql maneja eficientemente las conexiones.
    // No es necesario llamar a db.end() después de cada consulta en entornos serverless.
    return results;
  } catch (error) {
    console.error("Error en la consulta a la base de datos:t", process.env.DB_HOST, error);
    // Considera registrar errores de forma más segura o lanzar errores genéricos al cliente.
    throw new Error('Error al ejecutar la consulta en la base de datosaaa.');
  }
}

// Opcional: serverless-mysql maneja el cierre de conexiones al finalizar la ejecución de la función serverless.
// Para ejecuciones locales largas o servidores tradicionales, podrías necesitar db.quit().
// process.on('SIGTERM', async () => {
//   console.log('Cerrando conexiones de la base de datos...');
//   await db.quit();
// });
// process.on('SIGINT', async () => {
//   console.log('Cerrando conexiones de la base de datos...');
//   await db.quit();
// });
