import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    // 1. Limpiar datos viejos (Opcional, pero útil para frescura)
    // await sql`TRUNCATE users, equipment, service_orders, service_catalog CASCADE`;

    // 2. Generar Passwords Hasheados
    const hash = await bcrypt.hash('123456', 10);

    // 3. Crear Usuarios Core
    const users = await sql`
      INSERT INTO users (email, password_hash, name, role, phone)
      VALUES 
        ('admin@cooltrack.com', ${hash}, 'Administrador Pro', 'admin', '555-0101'),
        ('tech@cooltrack.com', ${hash}, 'Juan Pérez (Técnico)', 'technician', '555-0202'),
        ('client@cooltrack.com', ${hash}, 'Empresa Alpha', 'client', '555-0303')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id, role, email;
    `;

    const admin = users.find((u: any) => u.role === 'admin');
    const tech = users.find((u: any) => u.role === 'technician');
    const client = users.find((u: any) => u.role === 'client');

    if (!admin || !tech || !client) {
      throw new Error('No se pudieron crear los usuarios de prueba correctamente.');
    }

    // 4. Catálogo de Servicios
    await sql`
      INSERT INTO service_catalog (name, category, base_price, unit)
      VALUES 
        ('Mantenimiento Preventivo', 'Mantenimiento', 850.00, 'servicio'),
        ('Recarga de Gas R410A', 'Reparación', 1200.00, 'carga'),
        ('Diagnóstico General', 'Inspección', 400.00, 'servicio')
      ON CONFLICT DO NOTHING;
    `;

    // 5. Equipo de Prueba para el Cliente
    const equipment = await sql`
      INSERT INTO equipment (client_id, name, type, brand, location_description)
      VALUES (${client.id}, 'Mini Split Sala', 'mini_split', 'Carrier', 'Sala de Juntas B')
      RETURNING id;
    `;

    if (!equipment[0]) throw new Error('No se pudo crear el equipo de prueba.');

    // 6. Una Orden de Servicio para empezar
    await sql`
      INSERT INTO service_orders (client_id, technician_id, equipment_id, service_type, description, status, address)
      VALUES (
        ${client.id}, 
        ${tech.id}, 
        ${equipment[0].id}, 
        'Mantenimiento', 
        'El equipo enciende pero no enfría lo suficiente.', 
        'assigned', 
        'Calle Falsa 123, Sector Industrial'
      )
    `;

    return Response.json({ 
      success: true, 
      message: 'Base de datos poblada exitosamente con usuarios 123456.',
      users: users.map(u => ({ email: u.email, role: u.role }))
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
