export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Intento seguro de obtener JSON de una respuesta.
 * Si el Content-Type no es JSON o el cuerpo está mal formado, 
 * devuelve un objeto descriptivo en lugar de lanzar un SyntaxError.
 */
export async function safeJsonResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('[API-SAFE-JSON] No se recibió JSON legítimo. Content-Type:', contentType);
    console.error('[API-SAFE-JSON] Inicio del cuerpo recibido:', text.substring(0, 100));
    
    return {
      success: false,
      error: `Error del servidor (${response.status}). El servidor no respondió con JSON.`,
      isHtml: text.trim().startsWith('<')
    };
  }

  try {
    return await response.json();
  } catch (err) {
    return {
      success: false,
      error: 'Error al procesar la respuesta JSON del servidor.'
    };
  }
}

export async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await safeJsonResponse(response);
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `Error HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.success === false ? data : data, // Manejo de estructura anidada si existe
    };
  } catch (error) {
    console.error('[API-CALL-FATAL]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red o de servidor desconocido',
    };
  }
}

export function createErrorResponse(message: string, status = 400, details?: any) {
  return new Response(JSON.stringify({ 
    success: false, 
    error: message,
    details: details || null 
  }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createSuccessResponse<T>(data: T, status = 200) {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
